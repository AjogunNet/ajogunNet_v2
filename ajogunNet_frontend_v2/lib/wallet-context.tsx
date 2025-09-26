"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { apiService } from "@/lib/api-service"

interface WalletContextType {
  isConnected: boolean
  address: string | null
  balance: string
  isConnecting: boolean
  isCreating: boolean
  isVerifying: boolean
  isLoadingBalance: boolean
  pendingWallet: { address: string; mnemonic: string; userId: string; password: string } | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  createWallet: (userId: string, password: string) => Promise<{ success: boolean; address?: string; mnemonic?: string; requiresVerification?: boolean; message?: string }>
  verifyAndActivateWallet: (mnemonic: string) => Promise<{ success: boolean; message?: string }>
  refreshBalance: (userId?: string) => Promise<void>
  refreshBalanceFast: () => Promise<void>
  transferTokens: (recipientAddress: string, amount: string) => Promise<{ success: boolean; message?: string }>

  userId: string | null
  password: string | null
  isAuthenticated: boolean
  logout: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [password, setPassword] = useState<string | null>(null)
  const [balance, setBalance] = useState("0.00")
  const [isConnecting, setIsConnecting] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [pendingWallet, setPendingWallet] = useState<{ address: string; mnemonic: string; userId: string; password: string } | null>(null)
  const isAuthenticated = !!userId && !!password

  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false)

  useEffect(() => {
    // Check if wallet was previously connected
    const savedAddress = localStorage.getItem("walletAddress")
    const savedUserId = localStorage.getItem("walletUserId")
    const walletActivatedAt = localStorage.getItem("walletActivatedAt")

    if (savedAddress && savedUserId && walletActivatedAt) {
      console.log("🔄 Restoring wallet session...")
      console.log(`📍 Address: ${savedAddress}`)
      console.log(`👤 User ID: ${savedUserId}`)
      console.log(`📅 Activated: ${walletActivatedAt}`)

      setAddress(savedAddress)
      setIsConnected(true)
      // Load balance from API with saved userId
      // refreshBalance(savedUserId)
    }
  }, [])

  // Auto-refresh balance every 30 seconds when connected
  // useEffect(() => {
  //   if (!isConnected) return

  //   const savedUserId = localStorage.getItem("walletUserId")
  //   if (!savedUserId) return

  //   const interval = setInterval(() => {
  //     const currentUserId = localStorage.getItem("walletUserId")
  //     if (currentUserId) {
  //       console.log("🔄 Auto-refreshing balance...")
  //       refreshBalance(currentUserId)
  //     }
  //   }, 30000) // 30 seconds

  //   return () => clearInterval(interval)
  // }, [isConnected])

  const refreshBalance = async (userId?: string) => {
    if (!userId) {
      console.warn("Cannot refresh balance without userId")
      return
    }

    // Prevent multiple simultaneous balance requests
    if (isRefreshingBalance) {
      console.log("💰 Balance refresh already in progress, skipping...")
      return
    }

    setIsLoadingBalance(true)
    setIsRefreshingBalance(true)
    try {
      console.log("💰 Fetching balance for userId:", userId)
      const balanceResult = await apiService.getWalletBalance(userId)
      console.log("💰 Balance API response:", balanceResult)

      if (balanceResult.success) {
        console.log("💰 Setting balance to:", balanceResult.balance)
        setBalance(balanceResult.balance)
      } else {
        console.warn("💰 Balance fetch failed:", balanceResult.message)
      }
    } catch (error) {
      console.error("💰 Failed to refresh balance:", error)
    } finally {
      setIsLoadingBalance(false)
      setIsRefreshingBalance(false)
    }
  }

  const logout = () => {
    disconnectWallet()
    setUserId(null)
    setPassword(null)
    localStorage.removeItem("ajogun-userId")
    localStorage.removeItem("ajogun-password")
  }


  const refreshBalanceFast = async () => {
    // Prevent multiple simultaneous balance requests
    if (isRefreshingBalance) {
      console.log("⚡ Balance refresh already in progress, skipping fast refresh...")
      return
    }

    const savedUserId = localStorage.getItem("walletUserId")
    if (!savedUserId) {
      console.warn("💰 Cannot refresh balance - no saved userId")
      return
    }

    console.log("⚡ Fast balance refresh triggered")
    await refreshBalance(savedUserId)
  }

  const createWallet = async (userId: string, password: string) => {
    setIsCreating(true)
    try {
      console.log('Creating wallet for user:', userId)
      const result = await apiService.createWallet({ userId, password })

      console.log('Wallet creation result:', result)

      if (result.success && result.address && result.mnemonic) {
        // Wallet created successfully - log the creation
        console.log("🔐 === WALLET CREATION SUCCESS ===")
        console.log(`✅ User ID: ${userId}`)
        console.log(`✅ Wallet Address: ${result.address}`)
        console.log(`⏳ Status: PENDING VERIFICATION`)
        console.log(`🔑 Mnemonic Length: ${result.mnemonic.split(' ').length} words`)
        console.log(`📅 Creation Time: ${new Date().toISOString()}`)
        console.log("==================================")

        // Store pending wallet info for verification step
        setPendingWallet({
          address: result.address,
          mnemonic: result.mnemonic,
          userId,
          password
        })

        return {
          success: true,
          address: result.address,
          mnemonic: result.mnemonic,
          requiresVerification: result.requiresVerification,
          message: result.message
        }
      } else {
        return { success: false, message: result.message || "Failed to create wallet" }
      }
    } catch (error) {
      console.error("Failed to create wallet:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create wallet"
      }
    } finally {
      setIsCreating(false)
    }
  }

  const verifyAndActivateWallet = async (mnemonic: string) => {
    if (!pendingWallet) {
      return { success: false, message: "No pending wallet to verify" }
    }

    setIsVerifying(true)
    try {
      console.log('Verifying wallet for user:', pendingWallet.userId)
      const result = await apiService.verifyAndActivateWallet({
        userId: pendingWallet.userId,
        mnemonic,
        password: pendingWallet.password
      })

      console.log('Wallet verification result:', result)

      if (result.success && result.activated) {
        // Wallet is now activated - log the success
        console.log("🎉 === WALLET ACTIVATION SUCCESS ===")
        console.log(`✅ User ID: ${pendingWallet.userId}`)
        console.log(`✅ Wallet Address: ${pendingWallet.address}`)
        console.log(`✅ Activation Time: ${new Date().toISOString()}`)
        console.log("=====================================")

        setAddress(pendingWallet.address)
        setIsConnected(true)
        localStorage.setItem("walletAddress", pendingWallet.address)
        localStorage.setItem("walletUserId", pendingWallet.userId)

        // Store activation timestamp for logging
        localStorage.setItem("walletActivatedAt", new Date().toISOString())

        // Clear pending wallet
        setPendingWallet(null)

        // Fetch actual balance after wallet activation
        await refreshBalance(pendingWallet.userId)

        // Store auth credentials
        localStorage.setItem("ajogun-userId", pendingWallet.userId)
        localStorage.setItem("ajogun-password", pendingWallet.password)

        return { success: true, message: result.message }
      } else {
        return { success: false, message: result.message || "Failed to verify wallet" }
      }
    } catch (error) {
      console.error("Failed to verify wallet:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to verify wallet"
      }
    } finally {
      setIsVerifying(false)
    }
  }

  const connectWallet = async () => {
    setIsConnecting(true)
    try {
      const savedAddress = localStorage.getItem("walletAddress")
      const savedUserId = localStorage.getItem("walletUserId")
      if (savedAddress && savedUserId) {
        setAddress(savedAddress)
        setIsConnected(true)
        await refreshBalance(savedUserId)
      } else {
        throw new Error("No wallet found. Please create a wallet first.")
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      throw error
    } finally {
      setIsConnecting(false)
    }
  }

  const transferTokens = async (_recipientAddress: string, _amount: string) => {
    if (!address) {
      return { success: false, message: "No wallet connected" }
    }

    try {
      // We need userId and password for transfers, but they're in auth context
      // This is a limitation - we might need to pass them as parameters
      // For now, we'll return an error asking user to use the transfer function from useApi
      return {
        success: false,
        message: "Please use the transfer function from the dashboard for authenticated transfers"
      }
    } catch (error) {
      console.error("Failed to transfer tokens:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Transfer failed"
      }
    }
  }

  const disconnectWallet = () => {
    setAddress(null)
    setIsConnected(false)
    setBalance("0.00")
    localStorage.removeItem("walletAddress")
    localStorage.removeItem("walletUserId")
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        balance,
        isConnecting,
        isCreating,
        isVerifying,
        isLoadingBalance,
        pendingWallet,
        connectWallet,
        disconnectWallet,
        createWallet,
        verifyAndActivateWallet,
        refreshBalance,
        refreshBalanceFast,
        transferTokens,
        userId,
        password,
        isAuthenticated,
        logout,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

// "use client"

// import type React from "react"
// import { createContext, useContext, useState, useEffect } from "react"
// import { apiService } from "@/lib/api-service"

// interface WalletContextType {
//   isConnected: boolean
//   address: string | null
//   balance: string
//   isConnecting: boolean
//   isCreating: boolean
//   isVerifying: boolean
//   isLoadingBalance: boolean
//   pendingWallet: { address: string; mnemonic: string; userId: string; password: string } | null
//   connectWallet: () => Promise<void>
//   disconnectWallet: () => void
//   createWallet: (userId: string, password: string) => Promise<{ success: boolean; address?: string; mnemonic?: string; requiresVerification?: boolean; message?: string }>
//   verifyAndActivateWallet: (mnemonic: string) => Promise<{ success: boolean; message?: string }>
//   refreshBalance: (userId?: string) => Promise<void>
//   refreshBalanceFast: () => Promise<void>
//   transferTokens: (recipientAddress: string, amount: string) => Promise<{ success: boolean; message?: string }>
// }

// const WalletContext = createContext<WalletContextType | undefined>(undefined)

// export function WalletProvider({ children }: { children: React.ReactNode }) {
//   const [isConnected, setIsConnected] = useState(false)
//   const [address, setAddress] = useState<string | null>(null)
//   const [balance, setBalance] = useState("0.00")
//   const [isConnecting, setIsConnecting] = useState(false)
//   const [isCreating, setIsCreating] = useState(false)
//   const [isVerifying, setIsVerifying] = useState(false)
//   const [isLoadingBalance, setIsLoadingBalance] = useState(false)
//   const [pendingWallet, setPendingWallet] = useState<{ address: string; mnemonic: string; userId: string; password: string } | null>(null)
//   const [isRefreshingBalance, setIsRefreshingBalance] = useState(false)

//   useEffect(() => {
//     // Check if wallet was previously connected
//     const savedAddress = localStorage.getItem("walletAddress")
//     const savedUserId = localStorage.getItem("walletUserId")
//     const walletActivatedAt = localStorage.getItem("walletActivatedAt")

//     if (savedAddress && savedUserId && walletActivatedAt) {
//       console.log("🔄 Restoring wallet session...")
//       console.log(`📍 Address: ${savedAddress}`)
//       console.log(`👤 User ID: ${savedUserId}`)
//       console.log(`📅 Activated: ${walletActivatedAt}`)

//       setAddress(savedAddress)
//       setIsConnected(true)
//       // Load balance from API with saved userId
//       refreshBalance(savedUserId)
//     }
//   }, [])

//   // Auto-refresh balance every 30 seconds when connected
//   // useEffect(() => {
//   //   if (!isConnected) return

//   //   const savedUserId = localStorage.getItem("walletUserId")
//   //   if (!savedUserId) return

//   //   const interval = setInterval(() => {
//   //     const currentUserId = localStorage.getItem("walletUserId")
//   //     if (currentUserId) {
//   //       console.log("🔄 Auto-refreshing balance...")
//   //       refreshBalance(currentUserId)
//   //     }
//   //   }, 30000) // 30 seconds

//   //   return () => clearInterval(interval)
//   // }, [isConnected])

//   const refreshBalance = async (userId?: string) => {
//     if (!userId) {
//       console.warn("Cannot refresh balance without userId")
//       return
//     }

//     // Prevent multiple simultaneous balance requests
//     if (isRefreshingBalance) {
//       console.log("💰 Balance refresh already in progress, skipping...")
//       return
//     }

//     setIsLoadingBalance(true)
//     setIsRefreshingBalance(true)
//     try {
//       console.log("💰 Fetching balance for userId:", userId)
//       const balanceResult = await apiService.getWalletBalance(userId)
//       console.log("💰 Balance API response:", balanceResult)

//       if (balanceResult.success) {
//         console.log("💰 Setting balance to:", balanceResult.balance)
//         setBalance(balanceResult.balance)
//       } else {
//         console.warn("💰 Balance fetch failed:", balanceResult.message)
//       }
//     } catch (error) {
//       console.error("💰 Failed to refresh balance:", error)
//     } finally {
//       setIsLoadingBalance(false)
//       setIsRefreshingBalance(false)
//     }
//   }

//   const refreshBalanceFast = async () => {
//     // Prevent multiple simultaneous balance requests
//     if (isRefreshingBalance) {
//       console.log("⚡ Balance refresh already in progress, skipping fast refresh...")
//       return
//     }

//     const savedUserId = localStorage.getItem("walletUserId")
//     if (!savedUserId) {
//       console.warn("💰 Cannot refresh balance - no saved userId")
//       return
//     }

//     console.log("⚡ Fast balance refresh triggered")
//     await refreshBalance(savedUserId)
//   }

//   const createWallet = async (userId: string, password: string) => {
//     setIsCreating(true)
//     try {
//       console.log('Creating wallet for user:', userId)
//       const result = await apiService.createWallet({ userId, password })

//       console.log('Wallet creation result:', result)

//       if (result.success && result.address && result.mnemonic) {
//         // Wallet created successfully - log the creation
//         console.log("🔐 === WALLET CREATION SUCCESS ===")
//         console.log(`✅ User ID: ${userId}`)
//         console.log(`✅ Wallet Address: ${result.address}`)
//         console.log(`⏳ Status: PENDING VERIFICATION`)
//         console.log(`🔑 Mnemonic Length: ${result.mnemonic.split(' ').length} words`)
//         console.log(`📅 Creation Time: ${new Date().toISOString()}`)
//         console.log("==================================")

//         // Store pending wallet info for verification step
//         setPendingWallet({
//           address: result.address,
//           mnemonic: result.mnemonic,
//           userId,
//           password
//         })

//         return {
//           success: true,
//           address: result.address,
//           mnemonic: result.mnemonic,
//           requiresVerification: result.requiresVerification,
//           message: result.message
//         }
//       } else {
//         return { success: false, message: result.message || "Failed to create wallet" }
//       }
//     } catch (error) {
//       console.error("Failed to create wallet:", error)
//       return {
//         success: false,
//         message: error instanceof Error ? error.message : "Failed to create wallet"
//       }
//     } finally {
//       setIsCreating(false)
//     }
//   }

//   const verifyAndActivateWallet = async (mnemonic: string) => {
//     if (!pendingWallet) {
//       return { success: false, message: "No pending wallet to verify" }
//     }

//     setIsVerifying(true)
//     try {
//       console.log('Verifying wallet for user:', pendingWallet.userId)
//       const result = await apiService.verifyAndActivateWallet({
//         userId: pendingWallet.userId,
//         mnemonic,
//         password: pendingWallet.password
//       })

//       console.log('Wallet verification result:', result)

//       if (result.success && result.activated) {
//         // Wallet is now activated - log the success
//         console.log("🎉 === WALLET ACTIVATION SUCCESS ===")
//         console.log(`✅ User ID: ${pendingWallet.userId}`)
//         console.log(`✅ Wallet Address: ${pendingWallet.address}`)
//         console.log(`✅ Activation Time: ${new Date().toISOString()}`)
//         console.log("=====================================")

//         setAddress(pendingWallet.address)
//         setIsConnected(true)
//         localStorage.setItem("walletAddress", pendingWallet.address)
//         localStorage.setItem("walletUserId", pendingWallet.userId)

//         // Store activation timestamp for logging
//         localStorage.setItem("walletActivatedAt", new Date().toISOString())

//         // Clear pending wallet
//         setPendingWallet(null)

//         // Fetch actual balance after wallet activation
//         await refreshBalance(pendingWallet.userId)

//         return { success: true, message: result.message }
//       } else {
//         return { success: false, message: result.message || "Failed to verify wallet" }
//       }
//     } catch (error) {
//       console.error("Failed to verify wallet:", error)
//       return {
//         success: false,
//         message: error instanceof Error ? error.message : "Failed to verify wallet"
//       }
//     } finally {
//       setIsVerifying(false)
//     }
//   }

//   const connectWallet = async () => {
//     setIsConnecting(true)
//     try {
//       const savedAddress = localStorage.getItem("walletAddress")
//       const savedUserId = localStorage.getItem("walletUserId")
//       if (savedAddress && savedUserId) {
//         setAddress(savedAddress)
//         setIsConnected(true)
//         await refreshBalance(savedUserId)
//       } else {
//         throw new Error("No wallet found. Please create a wallet first.")
//       }
//     } catch (error) {
//       console.error("Failed to connect wallet:", error)
//       throw error
//     } finally {
//       setIsConnecting(false)
//     }
//   }

//   const transferTokens = async (_recipientAddress: string, _amount: string) => {
//     if (!address) {
//       return { success: false, message: "No wallet connected" }
//     }

//     try {
//       // We need userId and password for transfers, but they're in auth context
//       // This is a limitation - we might need to pass them as parameters
//       // For now, we'll return an error asking user to use the transfer function from useApi
//       return {
//         success: false,
//         message: "Please use the transfer function from the dashboard for authenticated transfers"
//       }
//     } catch (error) {
//       console.error("Failed to transfer tokens:", error)
//       return {
//         success: false,
//         message: error instanceof Error ? error.message : "Transfer failed"
//       }
//     }
//   }

//   const disconnectWallet = () => {
//     setAddress(null)
//     setIsConnected(false)
//     setBalance("0.00")
//     localStorage.removeItem("walletAddress")
//     localStorage.removeItem("walletUserId")
//   }

//   return (
//     <WalletContext.Provider
//       value={{
//         isConnected,
//         address,
//         balance,
//         isConnecting,
//         isCreating,
//         isVerifying,
//         isLoadingBalance,
//         pendingWallet,
//         connectWallet,
//         disconnectWallet,
//         createWallet,
//         verifyAndActivateWallet,
//         refreshBalance,
//         refreshBalanceFast,
//         transferTokens,
//       }}
//     >
//       {children}
//     </WalletContext.Provider>
//   )
// }

// export function useWallet() {
//   const context = useContext(WalletContext)
//   if (context === undefined) {
//     throw new Error("useWallet must be used within a WalletProvider")
//   }
//   return context
// }

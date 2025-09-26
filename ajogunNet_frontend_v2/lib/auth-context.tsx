"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  userId: string | null
  password: string | null
  isAuthenticated: boolean
  login: (userId: string, password: string) => void
  logout: () => void
  updateCredentials: (userId: string, password: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [password, setPassword] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if credentials were previously stored
    const savedUserId = localStorage.getItem("ajogun-userId")
    const savedPassword = localStorage.getItem("ajogun-password")
    
    if (savedUserId && savedPassword) {
      setUserId(savedUserId)
      setPassword(savedPassword)
      setIsAuthenticated(true)
    }
  }, [])

  const login = (newUserId: string, newPassword: string) => {
    setUserId(newUserId)
    setPassword(newPassword)
    setIsAuthenticated(true)
    
    // Store credentials securely (in production, consider more secure storage)
    localStorage.setItem("ajogun-userId", newUserId)
    localStorage.setItem("ajogun-password", newPassword)
  }

  const logout = () => {
    // Log current session info before clearing
    const currentUserId = userId
    const walletAddress = localStorage.getItem("walletAddress")
    const walletActivatedAt = localStorage.getItem("walletActivatedAt")
    const walletActivated = walletAddress ? "YES" : "NO"
    
    console.log("🚪 === LOGOUT SESSION INFO ===")
    console.log(`👤 User ID: ${currentUserId}`)
    console.log(`💼 Wallet Activated: ${walletActivated}`)
    if (walletActivated === "YES") {
      console.log(`🏠 Wallet Address: ${walletAddress}`)
      if (walletActivatedAt) {
        console.log(`📅 Activated At: ${walletActivatedAt}`)
        const activatedDate = new Date(walletActivatedAt)
        const now = new Date()
        const sessionDuration = Math.round((now.getTime() - activatedDate.getTime()) / 1000 / 60) // minutes
        console.log(`⏱️  Session Duration: ${sessionDuration} minutes`)
      }
    }
    console.log(`🕐 Logout Time: ${new Date().toISOString()}`)
    console.log("===============================")
    
    setUserId(null)
    setPassword(null)
    setIsAuthenticated(false)
    
    // Clear ALL stored data for complete logout
    console.log("🔄 Logging out - clearing all stored data...")
    
    // Auth data
    localStorage.removeItem("ajogun-userId")
    localStorage.removeItem("ajogun-password")
    console.log("✅ Auth data cleared")
    
    // Wallet data - disconnect wallet completely
    localStorage.removeItem("walletAddress")
    localStorage.removeItem("walletUserId")
    localStorage.removeItem("walletCredentials")
    localStorage.removeItem("walletActivatedAt")
    console.log("✅ Wallet disconnected and data cleared")
    
    // App data
    localStorage.removeItem("willchain-wills")
    localStorage.removeItem("willchain-preferences")
    localStorage.removeItem("willchain-current-will")
    console.log("✅ App data cleared")
    
    // Note: Theme is preserved so user doesn't lose their preference
    console.log("ℹ️  Theme preference preserved")
    
    // Force page reload to reset all contexts and state
    console.log("🏠 Redirecting to homepage for fresh start...")
    window.location.href = "/"
  }

  const updateCredentials = (newUserId: string, newPassword: string) => {
    login(newUserId, newPassword)
  }

  return (
    <AuthContext.Provider
      value={{
        userId,
        password,
        isAuthenticated,
        login,
        logout,
        updateCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// "use client"
// import type React from "react"
// import { createContext, useContext, useState, useEffect } from "react"

// interface AuthContextType {
//   userId: string | null
//   password: string | null
//   isAuthenticated: boolean
//   login: (userId: string, password: string) => void
//   logout: () => void
//   updateCredentials: (userId: string, password: string) => void
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [userId, setUserId] = useState<string | null>(null)
//   const [password, setPassword] = useState<string | null>(null)
//   const [isAuthenticated, setIsAuthenticated] = useState(false)

//   useEffect(() => {
//     // Check if credentials were previously stored
//     const savedUserId = localStorage.getItem("ajogun-userId")
//     const savedPassword = localStorage.getItem("ajogun-password")
    
//     if (savedUserId && savedPassword) {
//       setUserId(savedUserId)
//       setPassword(savedPassword)
//       setIsAuthenticated(true)
//     }
//   }, [])

//   const login = (newUserId: string, newPassword: string) => {
//     setUserId(newUserId)
//     setPassword(newPassword)
//     setIsAuthenticated(true)
    
//     // Store credentials securely (in production, consider more secure storage)
//     localStorage.setItem("ajogun-userId", newUserId)
//     localStorage.setItem("ajogun-password", newPassword)
//   }

//   const logout = () => {
//     // Log current session info before clearing
//     const currentUserId = userId
//     const walletAddress = localStorage.getItem("walletAddress")
//     const walletActivatedAt = localStorage.getItem("walletActivatedAt")
//     const walletActivated = walletAddress ? "YES" : "NO"
    
//     console.log("🚪 === LOGOUT SESSION INFO ===")
//     console.log(`👤 User ID: ${currentUserId}`)
//     console.log(`💼 Wallet Activated: ${walletActivated}`)
//     if (walletActivated === "YES") {
//       console.log(`🏠 Wallet Address: ${walletAddress}`)
//       if (walletActivatedAt) {
//         console.log(`📅 Activated At: ${walletActivatedAt}`)
//         const activatedDate = new Date(walletActivatedAt)
//         const now = new Date()
//         const sessionDuration = Math.round((now.getTime() - activatedDate.getTime()) / 1000 / 60) // minutes
//         console.log(`⏱️  Session Duration: ${sessionDuration} minutes`)
//       }
//     }
//     console.log(`🕐 Logout Time: ${new Date().toISOString()}`)
//     console.log("===============================")
    
//     setUserId(null)
//     setPassword(null)
//     setIsAuthenticated(false)
    
//     // Clear ALL stored data for complete logout
//     console.log("🔄 Logging out - clearing all stored data...")
    
//     // Auth data
//     localStorage.removeItem("ajogun-userId")
//     localStorage.removeItem("ajogun-password")
//     console.log("✅ Auth data cleared")
    
//     // Wallet data - disconnect wallet completely
//     localStorage.removeItem("walletAddress")
//     localStorage.removeItem("walletUserId")
//     localStorage.removeItem("walletCredentials")
//     localStorage.removeItem("walletActivatedAt")
//     console.log("✅ Wallet disconnected and data cleared")
    
//     // App data
//     localStorage.removeItem("willchain-wills")
//     localStorage.removeItem("willchain-preferences")
//     localStorage.removeItem("willchain-current-will")
//     console.log("✅ App data cleared")
    
//     // Note: Theme is preserved so user doesn't lose their preference
//     console.log("ℹ️  Theme preference preserved")
    
//     // Force page reload to reset all contexts and state
//     console.log("🏠 Redirecting to homepage for fresh start...")
//     window.location.href = "/"
//   }

//   const updateCredentials = (newUserId: string, newPassword: string) => {
//     login(newUserId, newPassword)
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         userId,
//         password,
//         isAuthenticated,
//         login,
//         logout,
//         updateCredentials,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }
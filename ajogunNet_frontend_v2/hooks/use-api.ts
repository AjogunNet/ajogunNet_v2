/**
 * Custom hook for API operations with loading states and error handling
 */

import { useState, useCallback } from 'react'
import { 
  apiService, 
  type CreateWillRequest, 
  type WillResponse, 
  type CreateWalletRequest,
  type TransferRequest 
} from '@/lib/api-service'
import { useApp } from '@/lib/app-context'
import { useWallet } from '@/lib/wallet-context'

interface ApiState<T = any> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi() {
  const { addNotification } = useApp()
  const { address } = useWallet()

  const [createWalletState, setCreateWalletState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  })

  const [createWillState, setCreateWillState] = useState<ApiState<WillResponse>>({
    data: null,
    loading: false,
    error: null,
  })

  const [willsState, setWillsState] = useState<ApiState<any[]>>({
    data: null,
    loading: false,
    error: null,
  })

  const [executionState, setExecutionState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  })

  const [transferState, setTransferState] = useState<ApiState<any>>({
    data: null,
    loading: false,
    error: null,
  })

  // Create Wallet
  const createWallet = useCallback(async (walletData: CreateWalletRequest) => {
    setCreateWalletState({ data: null, loading: true, error: null })

    try {
      const result = await apiService.createWallet(walletData)

      setCreateWalletState({ data: result, loading: false, error: null })

      if (result.success && result.address) {
        addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: 'Wallet Created Successfully',
          message: `Your wallet has been created with address ${result.address}`,
          timestamp: new Date().toISOString(),
        })
      } else {
        addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Wallet Creation Failed',
          message: result.message || 'Failed to create wallet',
          timestamp: new Date().toISOString(),
        })
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create wallet'
      setCreateWalletState({ data: null, loading: false, error: errorMessage })

      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Wallet Creation Failed',
        message: errorMessage,
        timestamp: new Date().toISOString(),
      })

      return null
    }
  }, [addNotification])

  // Create Will
  const createWill = useCallback(async (willData: CreateWillRequest) => {
    setCreateWillState({ data: null, loading: true, error: null })

    try {
      const result = await apiService.createWill(willData)

      setCreateWillState({ data: result, loading: false, error: null })

      if (result.success) {
        addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: 'Will Created Successfully',
          message: result.willIndex 
            ? `Your will has been deployed to the blockchain with index ${result.willIndex}`
            : 'Your will has been created successfully',
          timestamp: new Date().toISOString(),
        })
      } else {
        addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Will Creation Failed',
          message: result.message || 'Failed to create will',
          timestamp: new Date().toISOString(),
        })
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create will'
      setCreateWillState({ data: null, loading: false, error: errorMessage })

      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Will Creation Failed',
        message: errorMessage,
        timestamp: new Date().toISOString(),
      })

      return null
    }
  }, [addNotification])

  // Get All Wills
  const fetchWills = useCallback(async () => {
    if (!address) {
      console.warn("📋 Cannot fetch wills - no wallet address")
      return
    }

    console.log("📋 Fetching wills for address:", address)
    setWillsState({ data: null, loading: true, error: null })

    try {
      const wills = await apiService.getAllWillsForOwner(address)
      console.log("📋 Fetched wills:", wills)
      console.log(`📋 Found ${wills.length} wills for address ${address}`)
      
      setWillsState({ data: wills, loading: false, error: null })
      
      if (wills.length > 0) {
        console.log("📋 === WILLS SUMMARY ===")
        wills.forEach((will, index) => {
          console.log(`📋 Will ${index + 1}:`)
          console.log(`   - Index: ${will.willIndex}`)
          console.log(`   - Status: ${will.status}`)
          console.log(`   - Heirs: ${will.heirs?.length || 0}`)
          console.log(`   - Created: ${will.createdAt}`)
          console.log(`   - Contract: ${will.contractAddress}`)
        })
        console.log("========================")
      } else {
        console.log("📋 No wills found for this address")
      }
      
      return wills
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch wills'
      console.error("📋 Failed to fetch wills:", error)
      setWillsState({ data: null, loading: false, error: errorMessage })
      return null
    }
  }, [address])

  // Transfer Tokens
  const transferTokens = useCallback(async (transferData: TransferRequest & { userId: string }) => {
    setTransferState({ data: null, loading: true, error: null })

    try {
      const result = await apiService.transferTokens(transferData)

      setTransferState({ data: result, loading: false, error: null })

      if (result.success) {
        addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: 'Transfer Successful',
          message: `Tokens transferred successfully to ${transferData.recipientAddress}`,
          timestamp: new Date().toISOString(),
        })
      } else {
        throw new Error(result.message || 'Transfer failed')
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to transfer tokens'
      setTransferState({ data: null, loading: false, error: errorMessage })

      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Transfer Failed',
        message: errorMessage,
        timestamp: new Date().toISOString(),
      })

      return null
    }
  }, [addNotification])

  // Update Activity
  const updateActivity = useCallback(async (willIndex: number, userId: string, password: string) => {
    try {
      const result = await apiService.updateActivity(willIndex, {
        userId,
        password,
      })

      if (result.success) {
        addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: 'Activity Updated',
          message: 'Will activity has been updated successfully',
          timestamp: new Date().toISOString(),
        })
      }

      return result
    } catch (error) {
      console.error('Failed to update activity:', error)
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update will activity',
        timestamp: new Date().toISOString(),
      })
      return null
    }
  }, [addNotification])

  // Execute Will
  const executeWill = useCallback(async (willIndex: number, ownerAddress: string, userId: string, password: string) => {
    setExecutionState({ data: null, loading: true, error: null })

    try {
      const result = await apiService.executeWill(willIndex, ownerAddress, {
        userId,
        password,
      })

      setExecutionState({ data: result, loading: false, error: null })

      if (result.success) {
        addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: 'Will Executed',
          message: 'The will has been successfully executed and assets distributed',
          timestamp: new Date().toISOString(),
        })
      } else {
        addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Execution Failed',
          message: result.message || 'Failed to execute will',
          timestamp: new Date().toISOString(),
        })
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to execute will'
      setExecutionState({ data: null, loading: false, error: errorMessage })

      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Execution Failed',
        message: errorMessage,
        timestamp: new Date().toISOString(),
      })

      return null
    }
  }, [addNotification])

  // Check Will Status
  const checkWillStatus = useCallback(async (ownerAddress: string, willIndex: number) => {
    try {
      const result = await apiService.checkWillReadyForExecution(ownerAddress, willIndex)
      return result
    } catch (error) {
      console.error('Failed to check will status:', error)
      return null
    }
  }, [])

  // Get Monitored Wills
  const fetchMonitoredWills = useCallback(async () => {
    try {
      const result = await apiService.getMonitoredWills()
      return result
    } catch (error) {
      console.error('Failed to fetch monitored wills:', error)
      return null
    }
  }, [])

  // Initiate Will Execution
  const initiateWillExecution = useCallback(async (willIndex: number, ownerAddress: string, userId: string, password: string) => {
    try {
      const result = await apiService.initiateWillExecution(willIndex, ownerAddress, {
        userId,
        password,
      })

      if (result.success) {
        addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: 'Will Execution Initiated',
          message: 'The will execution process has been started',
          timestamp: new Date().toISOString(),
        })
      } else {
        addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Initiation Failed',
          message: result.message || 'Failed to initiate will execution',
          timestamp: new Date().toISOString(),
        })
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initiate will execution'
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Initiation Failed',
        message: errorMessage,
        timestamp: new Date().toISOString(),
      })
      return null
    }
  }, [addNotification])

  // Execute Will Automatically
  const executeWillAutomatically = useCallback(async (ownerAddress: string, willIndex: number, password: string) => {
    try {
      const result = await apiService.executeWillAutomatically(ownerAddress, willIndex, { password })

      if (result.success) {
        addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: 'Will Executed Automatically',
          message: 'The will has been executed automatically and assets distributed',
          timestamp: new Date().toISOString(),
        })
      } else {
        addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Auto Execution Failed',
          message: result.message || 'Failed to execute will automatically',
          timestamp: new Date().toISOString(),
        })
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to execute will automatically'
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Auto Execution Failed',
        message: errorMessage,
        timestamp: new Date().toISOString(),
      })
      return null
    }
  }, [addNotification])

  // Revoke Will
  const revokeWill = useCallback(async (willIndex: number, userId: string, password: string) => {
    try {
      const result = await apiService.revokeWill(willIndex, {
        userId,
        password,
      })

      if (result.success) {
        addNotification({
          id: Date.now().toString(),
          type: 'info',
          title: 'Will Revoked',
          message: 'The will has been successfully revoked',
          timestamp: new Date().toISOString(),
        })

        // Refresh wills list
        await fetchWills()
      } else {
        throw new Error(result.message || 'Revocation failed')
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to revoke will'

      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Revocation Failed',
        message: errorMessage,
        timestamp: new Date().toISOString(),
      })

      return null
    }
  }, [addNotification, fetchWills])

  // Get Wallet Balance
  const getWalletBalance = useCallback(async (userId: string) => {
    try {
      const result = await apiService.getWalletBalance(userId)
      return result
    } catch (error) {
      console.error('Failed to get wallet balance:', error)
      return null
    }
  }, [])

  return {
    // States
    createWalletState,
    createWillState,
    willsState,
    executionState,
    transferState,

    // Actions
    createWallet,
    createWill,
    fetchWills,
    updateActivity,
    executeWill,
    revokeWill,
    transferTokens,
    getWalletBalance,
    checkWillStatus,
    fetchMonitoredWills,
    initiateWillExecution,
    executeWillAutomatically,
  }
}
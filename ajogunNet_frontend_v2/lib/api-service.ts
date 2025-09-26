/**
 * API Service for AjogunNet Will Management
 * Integrates with the backend API at https://ajogun-willon-sui-2.onrender.com/
 */

import { corsProxyService } from './cors-proxy'

const API_BASE_URL = 'http://localhost:3000'

// Development mode detection
const isDevelopment = typeof window !== 'undefined' && window.location.hostname === 'localhost'

// Wallet Management Interfaces
export interface CreateWalletRequest {
  userId: string
  password: string
}

export interface CreateWalletResponse {
  address?: string
  mnemonic?: string
  requiresVerification?: boolean
  success?: boolean
  message?: string
  // Handle different response formats
  [key: string]: any
}

export interface VerifyWalletRequest {
  userId: string
  mnemonic: string
  password: string
}

export interface VerifyWalletResponse {
  address?: string
  activated?: boolean
  success?: boolean
  message?: string
  // Handle different response formats
  [key: string]: any
}

export interface WalletResponse {
  address?: string
  balance?: string
  success?: boolean
  message?: string
  // Handle different response formats
  [key: string]: any
}

export interface TransferRequest {
  password: string
  recipientAddress: string
  amount: number
}

// Will Management Interfaces
export interface CreateWillRequest {
  userId: string
  password: string
  heirs: string[]
  shares: number[]
}

export interface WillResponse {
  willIndex?: number
  contractAddress?: string
  transactionHash?: string
  status?: 'active' | 'executed' | 'revoked'
  createdAt?: string
  success?: boolean
  message?: string
  // Handle different response formats
  [key: string]: any
}

export interface UpdateActivityRequest {
  userId: string
  password: string
}

export interface RevokeWillRequest {
  userId: string
  password: string
}

export interface AutoExecutionRequest {
  password: string
}

export interface WillData {
  willIndex?: number
  heirs?: string[]
  shares?: number[]
  status?: 'active' | 'executed' | 'revoked'
  createdAt?: string
  lastActivity?: string
  contractAddress?: string
  transactionHash?: string
  // Handle different response formats
  [key: string]: any
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // In development, try Next.js proxy first
    if (isDevelopment) {
      try {
        return await this.makeProxyRequest<T>(endpoint, options)
      } catch (proxyError) {
        console.log('Next.js proxy failed, trying direct connection...', proxyError)
      }
    }

    const url = `${API_BASE_URL}${endpoint}`

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    }

    try {
      console.log(`Making API request to: ${url}`, {
        method: options.method || 'GET',
        headers: { ...defaultHeaders, ...options.headers },
        body: options.body ? JSON.parse(options.body as string) : undefined
      })

      // Try direct request
      const response = await fetch(url, {
        ...options,
        mode: 'cors',
        credentials: 'omit', // Don't include credentials to avoid CORS issues
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      })

      console.log(`API Response Status: ${response.status}`)
      console.log(`API Response Headers:`, Object.fromEntries(response.headers.entries()))

      const responseText = await response.text()
      console.log(`API Response Body:`, responseText)

      if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${responseText}`)
      }

      // Try to parse as JSON, fallback to text if it fails
      try {
        const data = JSON.parse(responseText)
        return data
      } catch (parseError) {
        // If response is not JSON, return as text wrapped in object
        return { message: responseText, success: response.ok } as T
      }
    } catch (error) {
      console.error(`Direct API request failed for ${endpoint}:`, error)

      // If direct request fails due to CORS, try using CORS proxy
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.log('Attempting request via CORS proxy...')
        try {
          const proxyResponse = await corsProxyService.makeProxiedRequest<T>(endpoint, options)
          console.log('CORS proxy request successful')
          return proxyResponse
        } catch (proxyError) {
          console.error('CORS proxy request also failed:', proxyError)
          throw new Error(`Network Error: Unable to connect to ${url}. All connection methods failed. The backend server may not be configured for CORS or may be down.`)
        }
      }

      throw error
    }
  }

  private async makeProxyRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `/api/proxy${endpoint}`

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    console.log(`Making Next.js proxy request to: ${url}`)

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    })

    const responseText = await response.text()
    console.log(`Proxy Response Status: ${response.status}`)
    console.log(`Proxy Response Body:`, responseText)

    if (!response.ok) {
      throw new Error(`Proxy Error ${response.status}: ${responseText}`)
    }

    try {
      const data = JSON.parse(responseText)
      return data
    } catch (parseError) {
      return { message: responseText, success: response.ok } as T
    }
  }

  // Wallet Management Methods

  /**
   * Create a new wallet (Step 1)
   * POST /wallet/create
   */
  async createWallet(walletData: CreateWalletRequest): Promise<CreateWalletResponse> {
    try {
      const response = await this.makeRequest<CreateWalletResponse>('/wallet/create', {
        method: 'POST',
        body: JSON.stringify(walletData),
      })

      console.log('Raw API response for createWallet:', response)
      console.log('Response mnemonic:', response.mnemonic)
      console.log('Response address:', response.address)

      // Handle different response formats
      const result = {
        success: true,
        address: response.address || response.walletAddress || '',
        mnemonic: response.mnemonic || '',
        requiresVerification: response.requiresVerification || false,
        message: response.message || 'Wallet created successfully',
        ...response
      }

      console.log('Processed API result:', result)
      return result
    } catch (error) {
      console.error('Create wallet error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create wallet'
      }
    }
  }

  /**
   * Verify and activate wallet (Step 2)
   * POST /wallet/verify-activate
   */
  async verifyAndActivateWallet(verifyData: VerifyWalletRequest): Promise<VerifyWalletResponse> {
    try {
      const response = await this.makeRequest<VerifyWalletResponse>('/wallet/verify-activate', {
        method: 'POST',
        body: JSON.stringify(verifyData),
      })

      return {
        success: true,
        address: response.address || response.walletAddress || '',
        activated: response.activated || false,
        message: response.message || 'Wallet activated successfully',
        ...response
      }
    } catch (error) {
      console.error('Verify wallet error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to verify wallet'
      }
    }
  }

  /**
   * Get wallet information
   * GET /wallet/:userId
   */
  async getWallet(userId: string): Promise<WalletResponse> {
    try {
      const response = await this.makeRequest<WalletResponse>(`/wallet/${userId}`)
      return {
        success: true,
        ...response
      }
    } catch (error) {
      console.error('Get wallet error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get wallet'
      }
    }
  }

  /**
   * Get wallet balance
   * GET /wallet/:userId/balance
   */
  async getWalletBalance(userId: string): Promise<{ balance: string; success: boolean; message?: string }> {
    try {
      const response = await this.makeRequest<any>(`/wallet/${userId}/balance`)
      return {
        success: true,
        balance: response.balance || response.amount || '0',
        ...response
      }
    } catch (error) {
      console.error('Get wallet balance error:', error)
      return {
        success: false,
        balance: '0',
        message: error instanceof Error ? error.message : 'Failed to get balance'
      }
    }
  }

  /**
   * Transfer tokens
   * POST /wallet/:userId/transfer
   */
  async transferTokens(transferData: TransferRequest & { userId: string }): Promise<{ success: boolean; transactionHash?: string; message: string }> {
    try {
      const { userId, ...transferBody } = transferData
      const response = await this.makeRequest<any>(`/wallet/${userId}/transfer`, {
        method: 'POST',
        body: JSON.stringify(transferBody),
      })

      return {
        success: true,
        transactionHash: response.transactionHash || response.txHash || '',
        message: response.message || 'Transfer successful',
        ...response
      }
    } catch (error) {
      console.error('Transfer tokens error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Transfer failed'
      }
    }
  }

  // Will Management Methods

  /**
   * Create a new will
   * POST /create
   */
  async createWill(willData: CreateWillRequest): Promise<WillResponse> {
    try {
      console.log("📦 Will payload being sent to backend:", willData);

      const response = await this.makeRequest<WillResponse>('/will/create', {
        method: 'POST',
        body: JSON.stringify(willData),
      })

      return {
        success: true,
        willIndex: response.willIndex || response.id || 0,
        contractAddress: response.contractAddress || '',
        transactionHash: response.transactionHash || response.txHash || '',
        status: response.status || 'active',
        message: response.message || 'Will created successfully',
        ...response
      }
    } catch (error) {
      console.error('Create will error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create will'
      }
    }
  }

  /**
   * Update activity for a specific will
   * POST /update-activity/:willIndex
   */
  async updateActivity(
    willIndex: number,
    activityData: UpdateActivityRequest
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.makeRequest<any>(`/update-activity/${willIndex}`, {
        method: 'POST',
        body: JSON.stringify(activityData),
      })

      return {
        success: true,
        message: response.message || 'Activity updated successfully',
        ...response
      }
    } catch (error) {
      console.error('Update activity error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update activity'
      }
    }
  }

  /**
   * Initiate will execution
   * POST /initiate/:willIndex/:ownerAddress
   */
  async initiateWillExecution(
    willIndex: number,
    ownerAddress: string,
    initiateData: UpdateActivityRequest
  ): Promise<{ success: boolean; transactionHash?: string; message: string }> {
    try {
      const response = await this.makeRequest<any>(`/initiate/${willIndex}/${ownerAddress}`, {
        method: 'POST',
        body: JSON.stringify(initiateData),
      })

      return {
        success: true,
        transactionHash: response.transactionHash || response.txHash || '',
        message: response.message || 'Will execution initiated',
        ...response
      }
    } catch (error) {
      console.error('Initiate will execution error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to initiate will execution'
      }
    }
  }

  /**
   * Execute will manually
   * POST /execute/:willIndex/:ownerAddress
   */
  async executeWill(
    willIndex: number,
    ownerAddress: string,
    executeData: UpdateActivityRequest
  ): Promise<{ success: boolean; transactionHash?: string; distributionDetails?: any[]; message: string }> {
    try {
      const response = await this.makeRequest<any>(`/will/execute/${willIndex}/${ownerAddress}`, {
        method: 'POST',
        body: JSON.stringify(executeData),
      })

      return {
        success: true,
        transactionHash: response.transactionHash || response.txHash || '',
        distributionDetails: response.distributionDetails || response.distributions || [],
        message: response.message || 'Will executed successfully',
        ...response
      }
    } catch (error) {
      console.error('Execute will error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to execute will'
      }
    }
  }

  /**
   * Execute will automatically (triggered by conditions)
   * POST /execute-automatically/:ownerAddress/:willIndex
   */
  async executeWillAutomatically(
    ownerAddress: string,
    willIndex: number,
    autoExecutionData: AutoExecutionRequest
  ): Promise<{ success: boolean; transactionHash?: string; distributionDetails?: any[]; message: string }> {
    try {
      const response = await this.makeRequest<any>(`/will/execute-automatically/${ownerAddress}/${willIndex}`, {
        method: 'POST',
        body: JSON.stringify(autoExecutionData),
      })

      return {
        success: true,
        transactionHash: response.transactionHash || response.txHash || '',
        distributionDetails: response.distributionDetails || response.distributions || [],
        message: response.message || 'Will executed automatically',
        ...response
      }
    } catch (error) {
      console.error('Auto execute will error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to execute will automatically'
      }
    }
  }

  /**
   * Revoke a will
   * POST /revoke/:willIndex
   */
  async revokeWill(
    willIndex: number,
    revokeData: RevokeWillRequest
  ): Promise<{ success: boolean; transactionHash?: string; message: string }> {
    try {
      const response = await this.makeRequest<any>(`/will/revoke/${willIndex}`, {
        method: 'POST',
        body: JSON.stringify(revokeData),
      })

      return {
        success: true,
        transactionHash: response.transactionHash || response.txHash || '',
        message: response.message || 'Will revoked successfully',
        ...response
      }
    } catch (error) {
      console.error('Revoke will error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to revoke will'
      }
    }
  }

  /**
   * Check if will is ready for execution
   * GET /check-ready/:ownerAddress/:willIndex
   */
  async checkWillReadyForExecution(
    ownerAddress: string,
    willIndex: number
  ): Promise<{ isReady: boolean; reason: string; daysUntilExecution?: number; lastActivity?: string }> {
    try {
      const response = await this.makeRequest<any>(`/check-ready/${ownerAddress}/${willIndex}`)

      return {
        isReady: response.isReady || false,
        reason: response.reason || 'Status unknown',
        daysUntilExecution: response.daysUntilExecution,
        lastActivity: response.lastActivity,
        ...response
      }
    } catch (error) {
      console.error('Check will ready error:', error)
      return {
        isReady: false,
        reason: 'Failed to check will status'
      }
    }
  }

  /**
   * Get monitored wills
   * GET /monitored-wills
   */
  async getMonitoredWills(): Promise<Array<{
    willIndex: number
    ownerAddress: string
    status: string
    lastActivity: string
    daysUntilExecution: number
  }>> {
    try {
      const response = await this.makeRequest<any>('/monitored-wills')

      // Handle different response formats
      const wills = response.wills || response.data || response || []

      return wills.map((will: any) => ({
        willIndex: will.willIndex || will.id || 0,
        ownerAddress: will.ownerAddress || will.owner || '',
        status: will.status || 'unknown',
        lastActivity: will.lastActivity || will.last_activity || new Date().toISOString(),
        daysUntilExecution: will.daysUntilExecution || will.days_until_execution || 0,
        ...will
      }))
    } catch (error) {
      console.error('Get monitored wills error:', error)
      return []
    }
  }

  /**
   * Get all wills for a specific owner
   * GET /all/:ownerAddress
   */
  async getAllWillsForOwner(ownerAddress: string): Promise<WillData[]> {
    try {
      const response = await this.makeRequest<any>(`/will/all/${ownerAddress}`)

      // Handle different response formats
      const wills = response.wills || response.data || response || []

      // Ensure each will has the expected format
      return wills.map((will: any) => ({
        willIndex: will.willIndex || will.id || 0,
        heirs: will.heirs || will.beneficiaries || [],
        shares: will.shares || will.percentages || [],
        status: will.status || 'active',
        createdAt: will.createdAt || will.created_at || new Date().toISOString(),
        lastActivity: will.lastActivity || will.last_activity || new Date().toISOString(),
        contractAddress: will.contractAddress || '',
        transactionHash: will.transactionHash || '',
        ...will
      }))
    } catch (error) {
      console.error('Get all wills error:', error)
      return []
    }
  }
}

export const apiService = new ApiService()
/**
 * Alternative API Service using Next.js proxy
 * This bypasses CORS by routing requests through our Next.js server
 */

// Use Next.js proxy route instead of direct backend calls
const API_BASE_URL = '/api/proxy'

export class ProxyApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    try {
      console.log(`Making proxied API request to: ${url}`, {
        method: options.method || 'GET',
        headers: { ...defaultHeaders, ...options.headers },
        body: options.body ? JSON.parse(options.body as string) : undefined
      })
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      })

      console.log(`Proxied API Response Status: ${response.status}`)

      const responseText = await response.text()
      console.log(`Proxied API Response Body:`, responseText)

      if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${responseText}`)
      }

      // Try to parse as JSON, fallback to text if it fails
      try {
        const data = JSON.parse(responseText)
        return data
      } catch (parseError) {
        return { message: responseText, success: response.ok } as T
      }
    } catch (error) {
      console.error(`Proxied API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Wallet Management Methods
  async createWallet(walletData: { userId: string; password: string }) {
    try {
      const response = await this.makeRequest<any>('/wallet/create', {
        method: 'POST',
        body: JSON.stringify(walletData),
      })
      
      return {
        success: true,
        address: response.address || response.walletAddress || '',
        message: response.message || 'Wallet created successfully',
        ...response
      }
    } catch (error) {
      console.error('Create wallet error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create wallet'
      }
    }
  }

  async getWalletBalance(userId: string) {
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

  async transferTokens(transferData: { userId: string; password: string; recipientAddress: string; amount: string }) {
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
}

export const proxyApiService = new ProxyApiService()
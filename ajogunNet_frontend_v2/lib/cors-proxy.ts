/**
 * CORS Proxy Solution for Development
 * This helps bypass CORS issues during development
 */

const BACKEND_URL = 'https://ajogun-willon-sui-2.onrender.com'

// List of public CORS proxy services (use with caution in production)
const CORS_PROXIES = [
  'https://cors-anywhere.herokuapp.com/',
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
]

export class CorsProxyService {
  private currentProxyIndex = 0

  /**
   * Get the next available CORS proxy
   */
  private getNextProxy(): string {
    const proxy = CORS_PROXIES[this.currentProxyIndex]
    this.currentProxyIndex = (this.currentProxyIndex + 1) % CORS_PROXIES.length
    return proxy
  }

  /**
   * Make a request through CORS proxy
   */
  async makeProxiedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${BACKEND_URL}${endpoint}`
    let lastError: Error | null = null

    // Try direct request first
    try {
      console.log(`Attempting direct request to: ${url}`)
      const response = await fetch(url, {
        ...options,
        mode: 'cors',
        credentials: 'omit', // Don't send credentials for direct requests
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      })

      if (response.ok) {
        const text = await response.text()
        try {
          return JSON.parse(text)
        } catch {
          return { message: text, success: true } as T
        }
      }
    } catch (error) {
      console.log('Direct request failed, trying CORS proxies...')
      lastError = error as Error
    }

    // Try CORS proxies if direct request fails
    for (let i = 0; i < CORS_PROXIES.length; i++) {
      try {
        const proxy = this.getNextProxy()
        const proxiedUrl = `${proxy}${encodeURIComponent(url)}`
        
        console.log(`Attempting proxied request via: ${proxy}`)
        
        const response = await fetch(proxiedUrl, {
          ...options,
          mode: 'cors',
          credentials: 'omit',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...options.headers,
          },
        })

        if (response.ok) {
          const text = await response.text()
          try {
            return JSON.parse(text)
          } catch {
            return { message: text, success: true } as T
          }
        }
      } catch (error) {
        console.log(`Proxy ${i + 1} failed:`, error)
        lastError = error as Error
      }
    }

    // If all proxies fail, throw the last error
    throw lastError || new Error('All CORS proxy attempts failed')
  }

  /**
   * Test if the backend is reachable
   */
  async testConnection(): Promise<{ success: boolean; method: string; message: string }> {
    try {
      // Try direct connection first
      const response = await fetch(`${BACKEND_URL}/`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
      })
      
      if (response.ok) {
        return {
          success: true,
          method: 'direct',
          message: 'Direct connection successful'
        }
      }
    } catch (error) {
      console.log('Direct connection failed, testing proxies...')
    }

    // Test proxies
    for (let i = 0; i < CORS_PROXIES.length; i++) {
      try {
        const proxy = CORS_PROXIES[i]
        const proxiedUrl = `${proxy}${encodeURIComponent(`${BACKEND_URL}/`)}`
        
        const response = await fetch(proxiedUrl, {
          method: 'GET',
          mode: 'cors',
          credentials: 'omit',
        })

        if (response.ok) {
          return {
            success: true,
            method: `proxy-${i + 1}`,
            message: `Connection successful via proxy: ${proxy}`
          }
        }
      } catch (error) {
        console.log(`Proxy ${i + 1} test failed:`, error)
      }
    }

    return {
      success: false,
      method: 'none',
      message: 'All connection methods failed'
    }
  }
}

export const corsProxyService = new CorsProxyService()
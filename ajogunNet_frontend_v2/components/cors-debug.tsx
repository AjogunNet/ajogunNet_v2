"use client"

/**
 * CORS Debug Component
 * Helps diagnose and resolve CORS issues with the backend
 */

import React, { useState } from 'react'
import { corsProxyService } from '../lib/cors-proxy'
import { apiService } from '../lib/api-service'

export const CorsDebug: React.FC = () => {
  const [testResults, setTestResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const runCorsTests = async () => {
    setIsLoading(true)
    setTestResults([])
    
    const results: any[] = []

    // Test 1: Connection test
    try {
      results.push({ test: 'Connection Test', status: 'running' })
      setTestResults([...results])
      
      const connectionResult = await corsProxyService.testConnection()
      results[results.length - 1] = {
        test: 'Connection Test',
        status: connectionResult.success ? 'success' : 'failed',
        details: connectionResult
      }
      setTestResults([...results])
    } catch (error) {
      results[results.length - 1] = {
        test: 'Connection Test',
        status: 'error',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      }
      setTestResults([...results])
    }

    // Test 2: Simple GET request
    try {
      results.push({ test: 'Simple GET Request', status: 'running' })
      setTestResults([...results])
      
      const response = await fetch('https://ajogun-willon-sui-2.onrender.com/', {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
      })
      
      results[results.length - 1] = {
        test: 'Simple GET Request',
        status: response.ok ? 'success' : 'failed',
        details: {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        }
      }
      setTestResults([...results])
    } catch (error) {
      results[results.length - 1] = {
        test: 'Simple GET Request',
        status: 'error',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      }
      setTestResults([...results])
    }

    // Test 3: API Service wallet creation
    try {
      results.push({ test: 'API Service Test', status: 'running' })
      setTestResults([...results])
      
      const walletResult = await apiService.createWallet({
        userId: 'test-user-' + Date.now(),
        password: 'test-password'
      })
      
      results[results.length - 1] = {
        test: 'API Service Test',
        status: walletResult.success ? 'success' : 'failed',
        details: walletResult
      }
      setTestResults([...results])
    } catch (error) {
      results[results.length - 1] = {
        test: 'API Service Test',
        status: 'error',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      }
      setTestResults([...results])
    }

    setIsLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'failed': return 'text-red-600'
      case 'error': return 'text-red-600'
      case 'running': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅'
      case 'failed': return '❌'
      case 'error': return '❌'
      case 'running': return '⏳'
      default: return '⚪'
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">CORS Debug Tool</h2>
      
      <div className="mb-6">
        <button
          onClick={runCorsTests}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {isLoading ? 'Running Tests...' : 'Run CORS Tests'}
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Test Results:</h3>
          
          {testResults.map((result, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{getStatusIcon(result.status)}</span>
                <h4 className="font-medium text-gray-800">{result.test}</h4>
                <span className={`font-medium ${getStatusColor(result.status)}`}>
                  {result.status.toUpperCase()}
                </span>
              </div>
              
              {result.details && (
                <div className="bg-gray-50 rounded p-3 mt-2">
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">CORS Solutions:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• The backend server needs to include proper CORS headers</li>
          <li>• Add "Access-Control-Allow-Origin: *" or specific origins</li>
          <li>• Add "Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"</li>
          <li>• Add "Access-Control-Allow-Headers: Content-Type, Authorization"</li>
          <li>• Handle preflight OPTIONS requests</li>
        </ul>
      </div>
    </div>
  )
}

export default CorsDebug
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const CORSTest = () => {
  const [testResults, setTestResults] = useState<string[]>([])
  const API_BASE_URL = 'https://ajogun-willon-sui-2.onrender.com'

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testSimpleGET = async () => {
    addResult("Testing simple GET request...")
    try {
      const response = await fetch(`${API_BASE_URL}/monitored-wills`, {
        method: 'GET',
        mode: 'cors',
      })
      addResult(`GET Response Status: ${response.status}`)
      const data = await response.text()
      addResult(`GET Response: ${data.substring(0, 200)}...`)
    } catch (error) {
      addResult(`GET Error: ${error}`)
    }
  }

  const testPreflightPOST = async () => {
    addResult("Testing POST request (will trigger preflight)...")
    try {
      const response = await fetch(`${API_BASE_URL}/wallet/create`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          userId: "test123",
          password: "test123"
        })
      })
      addResult(`POST Response Status: ${response.status}`)
      const data = await response.text()
      addResult(`POST Response: ${data.substring(0, 200)}...`)
    } catch (error) {
      addResult(`POST Error: ${error}`)
    }
  }

  const testOPTIONS = async () => {
    addResult("Testing OPTIONS request (preflight)...")
    try {
      const response = await fetch(`${API_BASE_URL}/wallet/create`, {
        method: 'OPTIONS',
        mode: 'cors',
        headers: {
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type',
        }
      })
      addResult(`OPTIONS Response Status: ${response.status}`)
      addResult(`OPTIONS Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`)
    } catch (error) {
      addResult(`OPTIONS Error: ${error}`)
    }
  }

  const testServerHealth = async () => {
    addResult("Testing server health...")
    try {
      // First test the root endpoint
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
      })
      addResult(`Health Check - Server Status: ${response.status}`)
      const data = await response.text()
      addResult(`Health Check - Response: ${data.substring(0, 100)}...`)
    } catch (error) {
      addResult(`Health Check Error: ${error}`)
      
      // Try without CORS as fallback
      try {
        const fallbackResponse = await fetch(`${API_BASE_URL}/`, {
          method: 'GET',
          mode: 'no-cors',
        })
        addResult(`Fallback Health Check - Server is reachable but CORS is blocking`)
      } catch (fallbackError) {
        addResult(`Fallback Health Check Error: Server may be down - ${fallbackError}`)
      }
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>CORS Debugging Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Server Information</h3>
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-sm font-mono space-y-1">
                <div>API Base URL: {API_BASE_URL}</div>
                <div>Frontend Origin: {typeof window !== 'undefined' ? window.location.origin : 'Unknown'}</div>
                <div>User Agent: {typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 50) + '...' : 'Unknown'}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">CORS Tests</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button onClick={testServerHealth}>
                Test Server Health
              </Button>
              <Button onClick={testSimpleGET}>
                Test Simple GET
              </Button>
              <Button onClick={testOPTIONS}>
                Test OPTIONS
              </Button>
              <Button onClick={testPreflightPOST}>
                Test POST (Preflight)
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Test Results</h3>
              <Button onClick={clearResults} variant="outline" size="sm">
                Clear
              </Button>
            </div>
            <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-muted-foreground">No test results yet. Click a test button above.</p>
              ) : (
                <div className="space-y-1">
                  {testResults.map((result, index) => (
                    <div key={index} className="text-sm font-mono">
                      {result}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Expected Backend CORS Configuration</h3>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm font-mono whitespace-pre-wrap">
{`const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CORSTest
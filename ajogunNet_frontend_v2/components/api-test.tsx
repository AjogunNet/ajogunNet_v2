"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useWallet } from "@/lib/wallet-context"
import { useApi } from "@/hooks/use-api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const APITest = () => {
  const { userId, password, isAuthenticated } = useAuth()
  const { address, balance, createWallet, isCreating } = useWallet()
  const { createWill, fetchWills, transferTokens, getWalletBalance, checkWillStatus, fetchMonitoredWills } = useApi()
  
  const [testResults, setTestResults] = useState<string[]>([])
  const [testUserId, setTestUserId] = useState("testuser123")
  const [testPassword, setTestPassword] = useState("testpass123")

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testCreateWallet = async () => {
    addResult("Testing wallet creation...")
    try {
      const result = await createWallet(testUserId, testPassword)
      addResult(`Wallet creation result: ${JSON.stringify(result)}`)
    } catch (error) {
      addResult(`Wallet creation error: ${error}`)
    }
  }

  const testGetBalance = async () => {
    if (!userId) {
      addResult("No userId available")
      return
    }
    
    addResult("Testing balance fetch...")
    try {
      const result = await getWalletBalance(userId)
      addResult(`Balance result: ${JSON.stringify(result)}`)
    } catch (error) {
      addResult(`Balance error: ${error}`)
    }
  }

  const testCreateWill = async () => {
    if (!userId || !password) {
      addResult("No user credentials available")
      return
    }
    
    addResult("Testing will creation...")
    try {
      const result = await createWill({
        userId,
        password,
        heirs: ["0x1234567890123456789012345678901234567890", "0x0987654321098765432109876543210987654321"],
        shares: [50, 50]
      })
      addResult(`Will creation result: ${JSON.stringify(result)}`)
    } catch (error) {
      addResult(`Will creation error: ${error}`)
    }
  }

  const testFetchWills = async () => {
    if (!address) {
      addResult("No wallet address available")
      return
    }
    
    addResult("Testing fetch wills...")
    try {
      await fetchWills()
      addResult("Fetch wills completed - check network tab for response")
    } catch (error) {
      addResult(`Fetch wills error: ${error}`)
    }
  }

  const testTransfer = async () => {
    if (!userId || !password) {
      addResult("No user credentials available")
      return
    }
    
    addResult("Testing token transfer...")
    try {
      const result = await transferTokens({
        userId,
        password,
        recipientAddress: "0x1234567890123456789012345678901234567890",
        amount: "1"
      })
      addResult(`Transfer result: ${JSON.stringify(result)}`)
    } catch (error) {
      addResult(`Transfer error: ${error}`)
    }
  }

  const testCheckWillStatus = async () => {
    if (!address) {
      addResult("No wallet address available")
      return
    }
    
    addResult("Testing will status check...")
    try {
      const result = await checkWillStatus(address, 1)
      addResult(`Will status result: ${JSON.stringify(result)}`)
    } catch (error) {
      addResult(`Will status error: ${error}`)
    }
  }

  const testMonitoredWills = async () => {
    addResult("Testing monitored wills fetch...")
    try {
      const result = await fetchMonitoredWills()
      addResult(`Monitored wills result: ${JSON.stringify(result)}`)
    } catch (error) {
      addResult(`Monitored wills error: ${error}`)
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>API Integration Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Authentication Status</h3>
              <p>Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
              <p>User ID: {userId || "None"}</p>
              <p>Has Password: {password ? "Yes" : "No"}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Wallet Status</h3>
              <p>Address: {address || "None"}</p>
              <p>Balance: {balance}</p>
              <p>Creating: {isCreating ? "Yes" : "No"}</p>
            </div>
          </div>

          {/* Test Credentials */}
          <div className="space-y-4">
            <h3 className="font-semibold">Test Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="testUserId">Test User ID</Label>
                <Input
                  id="testUserId"
                  value={testUserId}
                  onChange={(e) => setTestUserId(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="testPassword">Test Password</Label>
                <Input
                  id="testPassword"
                  type="password"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="space-y-4">
            <h3 className="font-semibold">API Tests</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Button onClick={testCreateWallet} disabled={isCreating}>
                Test Create Wallet
              </Button>
              <Button onClick={testGetBalance}>
                Test Get Balance
              </Button>
              <Button onClick={testCreateWill}>
                Test Create Will
              </Button>
              <Button onClick={testFetchWills}>
                Test Fetch Wills
              </Button>
              <Button onClick={testTransfer}>
                Test Transfer
              </Button>
              <Button onClick={testCheckWillStatus}>
                Test Will Status
              </Button>
              <Button onClick={testMonitoredWills}>
                Test Monitored Wills
              </Button>
              <Button onClick={clearResults} variant="outline">
                Clear Results
              </Button>
            </div>
          </div>

          {/* Test Results */}
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

          {/* API Endpoints */}
          <div className="space-y-2">
            <h3 className="font-semibold">Available Endpoints</h3>
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-sm font-mono space-y-1">
                <div>POST /wallet/create - Create wallet</div>
                <div>GET /wallet/:userId - Get wallet info</div>
                <div>GET /wallet/:userId/balance - Get balance</div>
                <div>POST /wallet/:userId/transfer - Transfer tokens</div>
                <div>POST /create - Create will</div>
                <div>POST /update-activity/:willIndex - Update activity</div>
                <div>POST /initiate/:willIndex/:ownerAddress - Initiate execution</div>
                <div>POST /execute/:willIndex/:ownerAddress - Execute will</div>
                <div>POST /execute-automatically/:ownerAddress/:willIndex - Auto execute</div>
                <div>POST /revoke/:willIndex - Revoke will</div>
                <div>GET /check-ready/:ownerAddress/:willIndex - Check ready</div>
                <div>GET /monitored-wills - Get monitored wills</div>
                <div>GET /all/:ownerAddress - Get all wills</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default APITest
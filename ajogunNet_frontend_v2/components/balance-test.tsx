"use client"

import { useState } from "react"
import { useWallet } from "@/lib/wallet-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function BalanceTest() {
  const { balance, refreshBalance, address, isConnected } = useWallet()
  const { userId } = useAuth()
  const [testUserId, setTestUserId] = useState("")

  const handleTestBalance = async () => {
    const userIdToTest = testUserId || userId
    if (userIdToTest) {
      console.log("Testing balance fetch for userId:", userIdToTest)
      await refreshBalance(userIdToTest)
    } else {
      console.warn("No userId available for testing")
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Balance Test Component</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p><strong>Current Balance:</strong> {balance} SUI</p>
          <p><strong>Wallet Address:</strong> {address || "Not connected"}</p>
          <p><strong>Is Connected:</strong> {isConnected ? "Yes" : "No"}</p>
          <p><strong>Auth UserId:</strong> {userId || "Not logged in"}</p>
        </div>
        
        <div className="space-y-2">
          <Input
            placeholder="Test UserId (optional)"
            value={testUserId}
            onChange={(e) => setTestUserId(e.target.value)}
          />
          <Button onClick={handleTestBalance} className="w-full">
            Test Balance Fetch
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>This component helps test the real balance integration.</p>
          <p>Check the browser console for detailed logs.</p>
        </div>
      </CardContent>
    </Card>
  )
}
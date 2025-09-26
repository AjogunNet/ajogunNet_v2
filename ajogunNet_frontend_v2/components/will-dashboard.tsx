"use client"

import { useEffect, useState } from "react"
import { useApi } from "@/hooks/use-api"
import { useWallet } from "@/lib/wallet-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  Users,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
  Eye,
  Trash2,
  Play,
  Pause,
} from "lucide-react"

interface Will {
  willIndex: number
  heirs: string[]
  shares: string[]
  amount: string
  status: 'active' | 'executed' | 'revoked'
  createdAt?: string
  lastActivity?: string
}

const WillDashboard = () => {
  const { fetchWills, willsState, revokeWill, updateActivity } = useApi()
  const { address } = useWallet()
  const { userId, password, isAuthenticated } = useAuth()
  const [wills, setWills] = useState<Will[]>([])
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (address) {
      loadWills()
    }
  }, [address])

  useEffect(() => {
    if (willsState.data) {
      setWills(willsState.data)
    }
  }, [willsState.data])

  const loadWills = async () => {
    setRefreshing(true)
    await fetchWills()
    setRefreshing(false)
  }

  const handleRevokeWill = async (willIndex: number) => {
    if (!isAuthenticated || !userId || !password) {
      alert('Please login first')
      return
    }

    if (confirm('Are you sure you want to revoke this will? This action cannot be undone.')) {
      await revokeWill(willIndex, userId, password)
      await loadWills() // Refresh the list
    }
  }

  const handleUpdateActivity = async (willIndex: number) => {
    if (!isAuthenticated || !userId || !password) {
      alert('Please login first')
      return
    }

    await updateActivity(willIndex, userId, password)
    await loadWills() // Refresh the list
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'executed':
        return <Play className="w-4 h-4 text-blue-500" />
      case 'revoked':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'executed':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
      case 'revoked':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      default:
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (willsState.loading && !refreshing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your wills...</p>
        </div>
      </div>
    )
  }

  if (willsState.error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Failed to Load Wills</h3>
            <p className="text-muted-foreground">{willsState.error}</p>
            <Button onClick={loadWills} className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Your Digital Wills</h1>
          <p className="text-muted-foreground">
            Manage and monitor your blockchain-secured digital wills
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={loadWills}
            disabled={refreshing}
            className="flex items-center"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Create New Will
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{wills.length}</p>
                <p className="text-sm text-muted-foreground">Total Wills</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {wills.filter(w => w.status === 'active').length}
                </p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Play className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {wills.filter(w => w.status === 'executed').length}
                </p>
                <p className="text-sm text-muted-foreground">Executed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {wills.reduce((sum, w) => sum + w.heirs.length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Beneficiaries</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wills List */}
      {wills.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Wills Created Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first digital will to secure your crypto assets for your beneficiaries.
            </p>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Will
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {wills.map((will) => {
            const willStatus = willStatuses[will.willIndex]
            return (
              <Card key={will.willIndex} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Will #{will.willIndex}</CardTitle>
                        <CardDescription>
                          {will.heirs.length} heirs • {will.createdAt ? `Created ${formatDate(will.createdAt)}` : 'Recently created'}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(will.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(will.status)}`}>
                        {will.status.charAt(0).toUpperCase() + will.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Beneficiaries</p>
                      <p className="font-semibold">{will.heirs.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Contract</p>
                      <p className="font-semibold text-xs">{will.contractAddress ? `${will.contractAddress.slice(0, 8)}...` : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Activity</p>
                      <p className="font-semibold">{will.lastActivity ? formatDate(will.lastActivity) : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-semibold capitalize">{will.status}</p>
                    </div>
                  </div>



                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    
                    {will.status === 'active' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUpdateActivity(will.willIndex)}
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Update Activity
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRevokeWill(will.willIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Revoke
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default WillDashboard
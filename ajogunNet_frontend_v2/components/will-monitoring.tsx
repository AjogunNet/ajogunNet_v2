"use client"

import { useEffect, useState } from "react"
import { useApi } from "@/hooks/use-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Monitor,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Eye,
  Play,
} from "lucide-react"

interface MonitoredWill {
  willIndex: number
  ownerAddress: string
  status: string
  lastActivity: string
  daysUntilExecution: number
}

const WillMonitoring = () => {
  const { fetchMonitoredWills } = useApi()
  const [monitoredWills, setMonitoredWills] = useState<MonitoredWill[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMonitoredWills()
  }, [])

  const loadMonitoredWills = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const wills = await fetchMonitoredWills()
      if (wills) {
        setMonitoredWills(wills)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load monitored wills')
    } finally {
      setLoading(false)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'ready':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20'
      case 'executed':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getUrgencyLevel = (daysUntilExecution: number) => {
    if (daysUntilExecution <= 0) return 'critical'
    if (daysUntilExecution <= 7) return 'high'
    if (daysUntilExecution <= 30) return 'medium'
    return 'low'
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      case 'high':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      default:
        return 'text-green-600 bg-green-100 dark:bg-green-900/20'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading monitored wills...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Failed to Load Monitoring Data</h3>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={loadMonitoredWills} className="mt-4">
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
          <h1 className="text-2xl font-bold text-foreground">Will Monitoring Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor all wills across the platform for execution readiness
          </p>
        </div>
        <Button onClick={loadMonitoredWills} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Monitor className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{monitoredWills.length}</p>
                <p className="text-sm text-muted-foreground">Total Monitored</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {monitoredWills.filter(w => w.daysUntilExecution <= 0).length}
                </p>
                <p className="text-sm text-muted-foreground">Ready for Execution</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {monitoredWills.filter(w => w.daysUntilExecution > 0 && w.daysUntilExecution <= 7).length}
                </p>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
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
                  {monitoredWills.filter(w => w.status.toLowerCase() === 'active').length}
                </p>
                <p className="text-sm text-muted-foreground">Active Wills</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monitored Wills List */}
      {monitoredWills.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Monitor className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Wills Being Monitored</h3>
            <p className="text-muted-foreground">
              There are currently no wills in the monitoring system.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {monitoredWills
            .sort((a, b) => a.daysUntilExecution - b.daysUntilExecution)
            .map((will) => {
              const urgency = getUrgencyLevel(will.daysUntilExecution)
              return (
                <Card key={`${will.ownerAddress}-${will.willIndex}`} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Monitor className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Will #{will.willIndex}</CardTitle>
                          <CardDescription>
                            Owner: {formatAddress(will.ownerAddress)}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(will.status)}`}>
                          {will.status.charAt(0).toUpperCase() + will.status.slice(1)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(urgency)}`}>
                          {urgency.charAt(0).toUpperCase() + urgency.slice(1)} Priority
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Last Activity</p>
                        <p className="font-semibold">{formatDate(will.lastActivity)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Days Until Execution</p>
                        <p className={`font-semibold ${will.daysUntilExecution <= 0 ? 'text-red-600' : 
                          will.daysUntilExecution <= 7 ? 'text-orange-600' : 'text-foreground'}`}>
                          {will.daysUntilExecution <= 0 ? 'Ready Now' : `${will.daysUntilExecution} days`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Owner Address</p>
                        <p className="font-mono text-sm">{formatAddress(will.ownerAddress)}</p>
                      </div>
                    </div>

                    {will.daysUntilExecution <= 0 && (
                      <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <p className="text-sm text-red-800 dark:text-red-200">
                            <strong>Action Required:</strong> This will is ready for execution
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      
                      {will.daysUntilExecution <= 0 && (
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                          <Play className="w-4 h-4 mr-2" />
                          Execute Will
                        </Button>
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

export default WillMonitoring
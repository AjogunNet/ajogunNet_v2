"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useWallet } from "@/lib/wallet-context"
import { useApi } from "@/hooks/use-api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Home,
  FileText,
  Users,
  Wallet,
  MessageSquare,
  Bot,
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
  Plus,
  ArrowRight,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  ChevronDown,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

const MainDashboard = () => {
  const { userId, logout } = useAuth()
  const { address, balance, isConnected, isLoadingBalance } = useWallet()
  const { fetchWills, willsState } = useApi()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    if (address) {
      console.log("🏠 Dashboard mounted - fetching wills for address:", address)
      fetchWills()
    }
  }, [address, fetchWills])

  // Auto-refresh wills every 60 seconds
  useEffect(() => {
    if (!address) return

    const interval = setInterval(() => {
      console.log("🔄 Auto-refreshing wills...")
      fetchWills()
    }, 60000) // 60 seconds

    return () => clearInterval(interval)
  }, [address, fetchWills])

  const sidebarLinks = [
    { name: "Dashboard", icon: Home, href: "/dashboard", active: true },
    { name: "Create Will", icon: FileText, href: "/create" },
    { name: "Beneficiaries", icon: Users, href: "/beneficiaries" },
    { name: "Wallet", icon: Wallet, href: "/wallet" },
    { name: "Messages", icon: MessageSquare, href: "/messages" },
    { name: "AI Assistant", icon: Bot, href: "/ai-assistant" },
  ]

  const statsData = [
    { 
      title: "Total Assets", 
      value: isLoadingBalance ? "Loading..." : `$${(parseFloat(balance) * 2).toLocaleString()}`, 
      icon: DollarSign, 
      change: isLoadingBalance ? "Fetching..." : "+12%", 
      trend: "up",
      color: "bg-blue-500",
      loading: isLoadingBalance
    },
    { 
      title: "Will Status", 
      value: willsState.data?.length > 0 ? "Active" : "Not Created", 
      icon: Shield, 
      change: willsState.data?.length > 0 ? "Secured" : "Create Now", 
      trend: "neutral",
      color: "bg-green-500"
    },
    { 
      title: "Beneficiaries", 
      value: willsState.data?.reduce((sum, w) => sum + w.heirs?.length || 0, 0) || "0", 
      icon: Users, 
      change: "Verified", 
      trend: "up",
      color: "bg-purple-500"
    },
    { 
      title: "AI Assistance", 
      value: "Available", 
      icon: Bot, 
      change: "Get Help", 
      trend: "neutral",
      color: "bg-indigo-500"
    },
  ]

  const quickActions = [
    {
      title: "Create Digital Will",
      description: "Set up your digital asset distribution",
      icon: FileText,
      href: "/create",
      color: "from-blue-500 to-purple-600"
    },
    {
      title: "Add Beneficiaries",
      description: "Manage who inherits your assets",
      icon: Users,
      href: "/beneficiaries",
      color: "from-green-500 to-teal-600"
    },
    {
      title: "AI Assistant",
      description: "Get help with will creation",
      icon: Bot,
      href: "/ai-assistant",
      color: "from-purple-500 to-pink-600"
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-foreground">AjogunNet</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-md hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                link.active
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <link.icon className={`w-5 h-5 mr-3 ${link.active ? "text-primary-foreground" : ""}`} />
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Help Card */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-4 text-white">
            <h3 className="font-semibold text-sm">Need Help?</h3>
            <p className="text-xs opacity-90 mt-1">Our AI assistant can guide you through creating your digital will</p>
            <Button className="mt-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-0 text-xs font-medium h-8">
              Ask AI
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top navbar */}
        <header className="bg-card shadow-sm border-b border-border">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-muted">
                <Menu className="w-5 h-5" />
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search assets, beneficiaries..."
                  className="pl-10 pr-4 py-2 w-80 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-muted transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{userId?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-foreground">{userId}</p>
                    <p className="text-xs text-muted-foreground">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'No wallet'}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-lg border border-border py-2 z-50">
                    <button className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted">
                      <Settings className="inline w-4 h-4 mr-2" />
                      Settings
                    </button>
                    <button 
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      <LogOut className="inline w-4 h-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="p-6 space-y-6">
          {/* Welcome section */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Welcome to AjogunNet</h1>
            <p className="text-white/80 mb-4">Secure your digital legacy with blockchain technology</p>
            <div className="flex space-x-3">
              <Button 
                asChild
                className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm"
              >
                <Link href="/create">Create Your Will</Link>
              </Button>
              <Button 
                variant="outline" 
                className="bg-transparent border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        {stat.loading && (
                          <div className="ml-2 animate-spin rounded-full h-4 w-4 border-2 border-primary/20 border-t-primary"></div>
                        )}
                      </div>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center ${stat.loading ? 'animate-pulse' : ''}`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    {stat.trend === "up" && !stat.loading && <TrendingUp className="w-4 h-4 text-green-500 mr-1" />}
                    <span className={`text-sm ${stat.trend === "up" && !stat.loading ? "text-green-600" : "text-muted-foreground"}`}>
                      {stat.change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{action.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                      <div className="flex items-center text-primary text-sm font-medium">
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Wills Section */}
          <Card>
            <CardHeader>
              <CardTitle>Your Wills</CardTitle>
              <CardDescription>Manage your digital wills and beneficiaries</CardDescription>
            </CardHeader>
            <CardContent>
              {willsState.loading ? (
                /* Loading State */
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
                    <FileText className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-medium text-foreground">Loading your wills...</p>
                    <p className="text-sm text-muted-foreground">Fetching data from blockchain</p>
                  </div>
                </div>
              ) : willsState.error ? (
                /* Error State */
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-medium text-foreground">Failed to load wills</p>
                    <p className="text-sm text-muted-foreground">{willsState.error}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => fetchWills()}
                      className="mt-2"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : willsState.data && willsState.data.length > 0 ? (
                /* Wills Data */
                <>
                  <div className="space-y-4">
                    {willsState.data.slice(0, 3).map((will, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Will #{will.willIndex}</p>
                            <p className="text-sm text-muted-foreground">
                              {will.heirs?.length || 0} beneficiaries • Created {new Date(will.createdAt || Date.now()).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            will.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                          }`}>
                            {will.status}
                          </span>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/dashboard">View All Wills</Link>
                    </Button>
                  </div>
                </>
              ) : (
                /* No Wills State */
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-medium text-foreground">No wills created yet</p>
                    <p className="text-sm text-muted-foreground">Create your first digital will to get started</p>
                    <Button asChild className="mt-2">
                      <Link href="/create">Create Your First Will</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default MainDashboard
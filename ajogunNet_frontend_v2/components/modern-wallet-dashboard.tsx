"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/lib/wallet-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import TransferModal from "@/components/transfer-modal"
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Copy,
  ExternalLink,
  RefreshCw,
  Send,
  Download,
  Eye,
  EyeOff,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Home,
  FileText,
  Users,
  MessageSquare,
  Bot,
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"

const ModernWalletDashboard = () => {
  const { address, balance, refreshBalance, isConnected, isLoadingBalance } = useWallet()
  const { userId, logout } = useAuth()
  const [showBalance, setShowBalance] = useState(true)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Auto-refresh balance when userId is available
  useEffect(() => {
    if (userId && isConnected) {
      refreshBalance(userId)
    }
  }, [userId, isConnected, refreshBalance])

  const sidebarLinks = [
    { name: "Dashboard", icon: Home, href: "/dashboard", active: false },
    { name: "Create Will", icon: FileText, href: "/create" },
    { name: "Beneficiaries", icon: Users, href: "/beneficiaries" },
    { name: "Wallet", icon: Wallet, href: "/wallet", active: true },
    { name: "Messages", icon: MessageSquare, href: "/messages" },
    { name: "AI Assistant", icon: Bot, href: "/ai-assistant" },
  ]

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  const handleRefresh = async () => {
    if (userId) {
      setIsRefreshing(true)
      try {
        await refreshBalance(userId)
      } finally {
        setIsRefreshing(false)
      }
    }
  }

  // Use real balance for SUI, mock data for other tokens
  const suiBalance = parseFloat(balance)/1000000000 || 0
  console.log("Dashboard - Raw balance:", balance, "Parsed SUI balance:", suiBalance)
  const tokens = [
    {
      id: "sui",
      name: "SUI",
      symbol: "SUI",
      balance: suiBalance,
      usdValue: suiBalance * 2, // Assuming 1 SUI = $2 (you can make this dynamic)
      change24h: 12.5,
      logo: "🔵",
    },
    {
      id: "usdc",
      name: "USD Coin",
      symbol: "USDC",
      balance: 5000.0,
      usdValue: 5000.0,
      change24h: 0.1,
      logo: "💵",
    },
    {
      id: "eth",
      name: "Ethereum",
      symbol: "ETH",
      balance: 0.75,
      usdValue: 1875.0,
      change24h: -2.3,
      logo: "⟠",
    },
  ]

  const transactions = [
    {
      id: 1,
      type: "receive" as const,
      amount: 100,
      token: "SUI",
      from: "0xabc...def",
      hash: "0x123...789",
      timestamp: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      type: "send" as const,
      amount: 50,
      token: "USDC",
      to: "0x456...012",
      hash: "0x345...678",
      timestamp: "1 day ago",
      status: "completed",
    },
    {
      id: 3,
      type: "receive" as const,
      amount: 0.25,
      token: "ETH",
      from: "0x789...123",
      hash: "0x567...890",
      timestamp: "3 days ago",
      status: "completed",
    },
  ]

  const totalBalance = tokens.reduce((sum, token) => sum + token.usdValue, 0)

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
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-card shadow-sm border-b border-border">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-muted">
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Wallet</h1>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {address ? formatAddress(address) : "No wallet connected"}
                  </span>
                  {address && (
                    <button onClick={copyAddress} className="p-1 hover:bg-muted rounded transition-colors">
                      <Copy className="w-3 h-3 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-muted transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{userId?.charAt(0).toUpperCase()}</span>
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

              <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="p-6 space-y-6">
          {/* No Wallet Connected Notice */}
          {!isConnected && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 text-yellow-600">⚠️</div>
                <div>
                  <h3 className="font-medium text-yellow-800 dark:text-yellow-200">No Wallet Connected</h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Please create or connect a wallet to view your balance and manage your assets.
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Balance Overview */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-5 rounded-full -ml-12 -mb-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Total Balance</h2>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  {showBalance ? <EyeOff className="w-5 h-5 text-white" /> : <Eye className="w-5 h-5 text-white" />}
                </button>
              </div>

              <div className="flex items-baseline space-x-4 mb-6">
                <div className="flex items-center">
                  <p className="text-3xl font-bold text-white">
                    {isLoadingBalance ? (
                      <span className="flex items-center">
                        Loading...
                        <div className="ml-2 animate-spin rounded-full h-6 w-6 border-2 border-white/20 border-t-white"></div>
                      </span>
                    ) : showBalance ? (
                      `${formatNumber(suiBalance)} SUI`
                    ) : (
                      "•••••• SUI"
                    )}
                  </p>
                </div>

                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-white/70 mr-1" />
                  <span className="text-sm font-medium text-white/70">+12.5%</span>
                  <span className="text-white/50 text-sm ml-1">24h</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button 
                  onClick={() => setIsTransferModalOpen(true)}
                  className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm transition-all duration-200"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </Button>
                <Button className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm transition-all duration-200">
                  <Download className="w-4 h-4 mr-2" />
                  Receive
                </Button>
              </div>
            </div>
          </div>

          {/* Your Tokens */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Your Tokens</h2>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                All Tokens
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tokens.map((token) => (
                <Card key={token.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-lg">
                          {token.logo}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{token.symbol}</h3>
                          <p className="text-sm text-muted-foreground">{token.name}</p>
                        </div>
                      </div>
                      <button className="p-1 hover:bg-muted rounded">
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Balance</span>
                        <span className="font-semibold text-foreground">
                          {formatNumber(token.balance)} {token.symbol}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">USD Value</span>
                        <span className="font-semibold text-foreground">${formatNumber(token.usdValue)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">24h Change</span>
                        <div className="flex items-center">
                          {token.change24h > 0 ? (
                            <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                          )}
                          <span
                            className={`text-sm font-medium ${token.change24h > 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {token.change24h > 0 ? "+" : ""}
                            {token.change24h}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <Card>
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      className="pl-10 pr-4 py-2 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    All Types
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === "receive"
                            ? "bg-green-100 dark:bg-green-900/20"
                            : "bg-blue-100 dark:bg-blue-900/20"
                        }`}
                      >
                        {tx.type === "receive" ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground capitalize">{tx.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {tx.type === "receive" ? `From ${formatAddress(tx.from || "")}` : `To ${formatAddress(tx.to || "")}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          tx.type === "receive" ? "text-green-600" : "text-foreground"
                        }`}
                      >
                        {tx.type === "receive" ? "+" : "-"}
                        {formatNumber(tx.amount)} {tx.token}
                      </p>
                      <p className="text-sm text-muted-foreground">{tx.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline">Load More Transactions</Button>
              </div>
            </div>
          </Card>
        </main>
      </div>

      {/* Transfer Modal */}
      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onSuccess={() => {
          if (userId) {
            refreshBalance(userId)
          }
        }}
      />
    </div>
  )
}

export default ModernWalletDashboard
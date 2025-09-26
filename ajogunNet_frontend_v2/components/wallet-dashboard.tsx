"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/lib/wallet-context"
import { useApi } from "@/hooks/use-api"
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
  Calendar,
  ChevronDown,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react"

const WalletDashboard = () => {
  const [showBalance, setShowBalance] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d")
  const [filterType, setFilterType] = useState("all")
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { address, balance, refreshBalance } = useWallet()

  
  // const { getWalletBalance } = useApi()
  const [walletData, setWalletData] = useState({
    address: address || "",
    balance: {
      sui: parseFloat(balance) || 0,
      usd: parseFloat(balance) || 0, // Mock conversion rate
      change24h: 0,
    },
    tokens: [
      {
        id: "sui",
        name: "SUI",
        symbol: "SUI",
        balance: parseFloat(balance) || 0,
        usdValue: parseFloat(balance) || 0,
        change24h: 0,
        logo: "🔵",
      },
    ],
    nfts: [], // NFTs would need separate API endpoint
  })

  useEffect(() => {
    if (address && balance) {
      setWalletData(prev => ({
        ...prev,
        address,
        balance: {
          sui: parseFloat(balance) || 0,
          usd: parseFloat(balance) || 0,
          change24h: 0,
        },
        tokens: [
          {
            id: "sui",
            name: "SUI",
            symbol: "SUI",
            balance: parseFloat(balance) || 0,
            usdValue: parseFloat(balance) || 0,
            change24h: 0,
            logo: "🔵",
          },
        ],
      }))
    }
  }, [address, balance])

  const transactions = [
    {
      id: 1,
      type: "receive",
      amount: 100,
      token: "SUI",
      from: "0xabc...def",
      hash: "0x123...789",
      timestamp: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      type: "send",
      amount: 50,
      token: "USDC",
      to: "0x456...012",
      hash: "0x345...678",
      timestamp: "1 day ago",
      status: "completed",
    },
    {
      id: 3,
      type: "receive",
      amount: 0.25,
      token: "ETH",
      from: "0x789...123",
      hash: "0x567...890",
      timestamp: "3 days ago",
      status: "completed",
    },
    {
      id: 4,
      type: "send",
      amount: 200,
      token: "SUI",
      to: "0xcde...456",
      hash: "0x789...012",
      timestamp: "1 week ago",
      status: "pending",
    },
  ]

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  const handleRefresh = async () => {
    await refreshBalance()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - reuse from main dashboard */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border">
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">WillChain</span>
          </div>
        </div>
        <nav className="px-4 py-6 space-y-2">
          <a href="/dashboard" className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200">
            <Wallet className="w-5 h-5 mr-3" />
            Dashboard
          </a>
          <a href="/wallet" className="flex items-center px-4 py-3 text-sm font-medium rounded-xl bg-primary text-primary-foreground shadow-lg">
            <Wallet className="w-5 h-5 mr-3" />
            Wallet
          </a>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-card shadow-sm border-b border-border">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-foreground">Wallet</h1>
              <div className="text-sm text-muted-foreground">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "No wallet connected"}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                Connect Wallet
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">


        {/* Balance Overview */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-blue-100">Total Balance</h2>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-baseline space-x-4">
            <div>
              <p className="text-3xl font-bold">
                {showBalance ? `$${formatNumber(walletData.balance.sui)}` : "••••••"}
              </p>
              {/* <p className="text-blue-200 text-sm">
                {showBalance ? `${formatNumber(walletData.balance.sui)} SUI` : "•••• SUI"}
              </p> */}
            </div>

            <div className="flex items-center">
              {walletData.balance.change24h > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-300 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-300 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  walletData.balance.change24h > 0 ? "text-green-300" : "text-red-300"
                }`}
              >
                {walletData.balance.change24h > 0 ? "+" : ""}
                {walletData.balance.change24h}%
              </span>
              <span className="text-blue-200 text-sm ml-1">24h</span>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button 
              onClick={() => setIsTransferModalOpen(true)}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl transition-colors"
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </button>
            <button className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Receive
            </button>
          </div>
        </div>

        {/* Tokens Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Your Tokens</h2>
            <select className="px-3 py-2 bg-card border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary">
              <option value="all">All Tokens</option>
              <option value="crypto">Crypto</option>
              <option value="nft">NFTs</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {walletData.tokens.map((token) => (
              <div
                key={token.id}
                className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-lg">
                      {token.logo}
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">{token.symbol}</h3>
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
                    <span className="font-semibold text-card-foreground">
                      {formatNumber(token.balance)} {token.symbol}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">USD Value</span>
                    <span className="font-semibold text-card-foreground">${formatNumber(token.usdValue)}</span>
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
              </div>
            ))}
          </div>
        </div>

        {/* NFTs Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Your NFTs</h2>
            <button className="text-primary hover:text-primary/80 text-sm font-medium">View All</button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {walletData.nfts.map((nft) => (
              <div
                key={nft.id}
                className="bg-card rounded-xl p-4 border border-border hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-4xl mb-3">
                  {nft.image}
                </div>
                <h4 className="font-medium text-card-foreground text-sm truncate">{nft.name}</h4>
                <p className="text-xs text-muted-foreground truncate">{nft.collection}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-6 border-b border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <h2 className="text-lg font-semibold text-card-foreground">Recent Transactions</h2>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="pl-10 pr-4 py-2 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                  />
                </div>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 bg-card border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Types</option>
                  <option value="send">Sent</option>
                  <option value="receive">Received</option>
                </select>

                <button className="flex items-center px-3 py-2 bg-card border border-border rounded-xl hover:bg-muted transition-colors">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">7 days</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Hash
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            tx.type === "receive"
                              ? "bg-green-100 dark:bg-green-900/20"
                              : "bg-blue-100 dark:bg-blue-900/20"
                          }`}
                        >
                          {tx.type === "receive" ? (
                            <ArrowDownLeft
                              className={`w-4 h-4 ${tx.type === "receive" ? "text-green-600" : "text-blue-600"}`}
                            />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-card-foreground capitalize">{tx.type}</p>
                          <p className="text-xs text-muted-foreground">{tx.token}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-medium ${
                          tx.type === "receive" ? "text-green-600" : "text-card-foreground"
                        }`}
                      >
                        {tx.type === "receive" ? "+" : "-"}
                        {formatNumber(tx.amount)} {tx.token}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground">{formatAddress(tx.from || tx.to)}</span>
                        <button className="ml-2 p-1 hover:bg-muted rounded">
                          <Copy className="w-3 h-3 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{tx.timestamp}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {tx.status === "completed" ? (
                          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                        ) : tx.status === "pending" ? (
                          <Clock className="w-4 h-4 text-yellow-500 mr-1" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            tx.status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : tx.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground font-mono">{formatAddress(tx.hash)}</span>
                        <button className="ml-2 p-1 hover:bg-muted rounded">
                          <ExternalLink className="w-3 h-3 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-border">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Showing 4 of 127 transactions</p>
              <button className="text-primary hover:text-primary/80 text-sm font-medium">Load More</button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl p-6 border border-border text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ArrowDownLeft className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">$3,250</h3>
            <p className="text-sm text-muted-foreground">Total Received</p>
            <p className="text-xs text-green-600 mt-1">+15% this month</p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ArrowUpRight className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">$1,875</h3>
            <p className="text-sm text-muted-foreground">Total Sent</p>
            <p className="text-xs text-blue-600 mt-1">12 transactions</p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">5</h3>
            <p className="text-sm text-muted-foreground">Active Tokens</p>
            <p className="text-xs text-purple-600 mt-1">3 NFT collections</p>
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onSuccess={() => {
          // Refresh balance after successful transfer
          handleRefresh()
        }}
      />
    </div>
  )
}

export default WalletDashboard

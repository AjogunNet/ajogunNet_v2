"use client"

import { useEffect, useState } from "react"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Users,
  Clock,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Lock,
  Globe,
  TrendingUp,
  Coins,
  FileText,
  Key,
  Database,
} from "lucide-react"
import Link from "next/link"
import { formatAddress, formatSuiAmount, validateSuiAddress } from "@/lib/utils"

export default function HomePage() {
  const currentAccount = useCurrentAccount()
  const [mounted, setMounted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [walletInfo, setWalletInfo] = useState<{ address: string; balance: number } | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (currentAccount && !walletInfo) {
      if (validateSuiAddress(currentAccount.address)) {
        setWalletInfo({ address: currentAccount.address, balance: 0 })
      }
    }
  }, [currentAccount, walletInfo])

  const handleWalletCreated = (info: { address: string; balance: number } | null) => {
    if (info && validateSuiAddress(info.address)) {
      setWalletInfo(info)
    }
    setIsModalOpen(false)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading AjogunNet...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Zap className="h-4 w-4" />
                Powered by Sui Blockchain
              </div>
              {/* Main Heading with Roboto font */}
              <h1 className="font-roboto text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
                Secure Your
                <br />
                <span className="text-primary">Digital Legacy</span>
              </h1>
              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Effortlessly create secure digital wills for your crypto assets. Distribute your wealth with confidence
                using blockchain's unmatched transparency and security
              </p>
              {/* CTA Section */}
              <div className="space-y-4 lg:space-y-6">
                {/* Mobile "Create Wallet" Button */}
                {(!currentAccount || !walletInfo) && (
                  <div className="sui-wallet-kit flex justify-center w-full lg:hidden">
                    <Button
                      size="lg"
                      className="text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 rounded-xl shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                      onClick={() => setIsModalOpen(true)}
                      disabled={!!walletInfo}
                    >
                      {walletInfo
                        ? `${formatAddress(walletInfo.address)} (${formatSuiAmount(walletInfo.balance)} SUI)`
                        : "Create Wallet"}
                    </Button>
                  </div>
                )}
                {/* Desktop CTA */}
                <div className="hidden lg:block">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Button
                      asChild
                      size="lg"
                      className="text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <Link href="/create">
                        Create Your First Will
                        <ArrowRight className="ml-2 h-4 lg:h-5 w-4 lg:w-5" />
                      </Link>
                    </Button>
                    {currentAccount && walletInfo && (
                      <Button
                        variant="outline"
                        size="lg"
                        asChild
                        className="text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-6 rounded-xl bg-transparent"
                      >
                        <Link href="/dashboard">View Dashboard</Link>
                      </Button>
                    )}
                  </div>
                </div>
                {/* Common Features */}
                {(!currentAccount || !walletInfo) && (
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Secure & Decentralized</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>No Registration Required</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Right Visual - Enhanced Blockchain Security Illustration */}
            <div className="relative mt-8 lg:mt-0">
              <div className="relative w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl lg:rounded-3xl p-6 lg:p-8 overflow-hidden border border-blue-200/50 dark:border-blue-800/50">
                {/* Central Shield with enhanced design */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
                      <Shield className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-white" />
                    </div>
                    {/* Glowing effect */}
                    <div className="absolute inset-0 w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-xl lg:rounded-2xl blur-xl animate-pulse"></div>
                  </div>
                </div>
                {/* Enhanced Floating Icons with blockchain theme - Responsive sizing */}
                <div className="absolute top-4 left-4 lg:top-8 lg:left-8 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white dark:bg-gray-800 rounded-lg lg:rounded-xl shadow-lg flex items-center justify-center animate-bounce border border-yellow-200 dark:border-yellow-800">
                  <Coins className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-yellow-500" />
                </div>
                <div
                  className="absolute top-4 right-4 lg:top-8 lg:right-8 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white dark:bg-gray-800 rounded-lg lg:rounded-xl shadow-lg flex items-center justify-center animate-bounce border border-blue-200 dark:border-blue-800"
                  style={{ animationDelay: "0.5s" }}
                >
                  <Database className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-blue-500" />
                </div>
                <div
                  className="absolute bottom-4 left-4 lg:bottom-8 lg:left-8 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white dark:bg-gray-800 rounded-lg lg:rounded-xl shadow-lg flex items-center justify-center animate-bounce border border-green-200 dark:border-green-800"
                  style={{ animationDelay: "1s" }}
                >
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-green-500" />
                </div>
                <div
                  className="absolute bottom-4 right-4 lg:bottom-8 lg:right-8 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white dark:bg-gray-800 rounded-lg lg:rounded-xl shadow-lg flex items-center justify-center animate-bounce border border-purple-200 dark:border-purple-800"
                  style={{ animationDelay: "1.5s" }}
                >
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-purple-500" />
                </div>
                {/* Enhanced Connecting Lines with blockchain pattern - Responsive viewBox */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 400 400"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                      <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.4" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <path
                    d="M 80 80 Q 200 150 320 80"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    fill="none"
                    className="animate-pulse"
                    filter="url(#glow)"
                  />
                  <path
                    d="M 80 320 Q 200 250 320 320"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    fill="none"
                    className="animate-pulse"
                    filter="url(#glow)"
                  />
                  <path
                    d="M 80 80 Q 150 200 80 320"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    fill="none"
                    className="animate-pulse"
                    filter="url(#glow)"
                  />
                  <path
                    d="M 320 80 Q 250 200 320 320"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    fill="none"
                    className="animate-pulse"
                    filter="url(#glow)"
                  />
                  {/* Additional blockchain pattern */}
                  <circle cx="200" cy="100" r="2" fill="#3B82F6" opacity="0.6" className="animate-pulse" />
                  <circle cx="200" cy="200" r="3" fill="#8B5CF6" opacity="0.8" className="animate-pulse" />
                  <circle cx="200" cy="300" r="2" fill="#06B6D4" opacity="0.6" className="animate-pulse" />
                </svg>
              </div>
            </div>
          </div>
          {/* Enhanced Stats with blockchain theme - Mobile responsive grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8 pt-12 lg:pt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-primary font-roboto">100%</div>
              <div className="text-xs lg:text-sm text-muted-foreground">Decentralized</div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-primary font-roboto">0</div>
              <div className="text-xs lg:text-sm text-muted-foreground">Intermediaries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-primary font-roboto">24/7</div>
              <div className="text-xs lg:text-sm text-muted-foreground">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-primary font-roboto">∞</div>
              <div className="text-xs lg:text-sm text-muted-foreground">Immutable</div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 space-y-16 lg:space-y-24 py-16 lg:py-24">
          {/* Enhanced Features Section with blockchain visuals */}
          <div className="space-y-12 lg:space-y-16">
            <div className="text-center space-y-4">
              <h2 className="font-roboto text-3xl lg:text-4xl font-bold text-foreground">Why Choose AjogunNet?</h2>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
                Built on cutting-edge blockchain technology to provide unmatched security and reliability for your
                digital assets.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all"></div>
                <CardHeader className="relative p-6">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <Shield className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl lg:text-2xl font-roboto">Secure & Immutable</CardTitle>
                  <CardDescription className="text-sm lg:text-base">
                    Your wills are stored on the Sui blockchain, ensuring they cannot be tampered with, lost, or
                    corrupted. Cryptographic security protects your legacy.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all"></div>
                <CardHeader className="relative p-6">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <Users className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl lg:text-2xl font-roboto">Multiple Heirs</CardTitle>
                  <CardDescription className="text-sm lg:text-base">
                    Distribute your SUI tokens among up to 10 heirs with precise percentage allocations. Flexible
                    inheritance planning for complex family structures.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group md:col-span-2 lg:col-span-1">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 group-hover:from-green-500/10 group-hover:to-teal-500/10 transition-all"></div>
                <CardHeader className="relative p-6">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl lg:rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <Clock className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl lg:text-2xl font-roboto">Smart Execution</CardTitle>
                  <CardDescription className="text-sm lg:text-base">
                    Optional automatic execution based on customizable conditions. Your wishes are fulfilled exactly as
                    specified, without human intervention.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Enhanced Blockchain Security Showcase - Mobile optimized */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl lg:rounded-3xl p-6 lg:p-12 border border-gray-200/50 dark:border-gray-700/50">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-4 lg:space-y-6 text-center lg:text-left">
                <h2 className="font-roboto text-3xl lg:text-4xl font-bold text-foreground">
                  Blockchain-Powered Security
                </h2>
                <p className="text-lg lg:text-xl text-muted-foreground">
                  Your digital assets are protected by military-grade cryptography and distributed across the Sui
                  blockchain network.
                </p>
                <div className="space-y-3 lg:space-y-4">
                  {[
                    {
                      icon: <Lock className="h-5 w-5" />,
                      title: "Cryptographic Protection",
                      desc: "256-bit encryption secures your will",
                    },
                    {
                      icon: <Globe className="h-5 w-5" />,
                      title: "Distributed Network",
                      desc: "Stored across thousands of nodes",
                    },
                    {
                      icon: <Key className="h-5 w-5" />,
                      title: "Private Key Control",
                      desc: "Only you control your assets",
                    },
                    {
                      icon: <Database className="h-5 w-5" />,
                      title: "Immutable Records",
                      desc: "Permanent blockchain storage",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 lg:gap-4">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                        {item.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-foreground text-sm lg:text-base">{item.title}</h3>
                        <p className="text-xs lg:text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Enhanced Blockchain Visualization - Mobile optimized, removed shield icon */}
              <div className="relative mt-8 lg:mt-0">
                <div className="grid grid-cols-3 gap-2 lg:gap-4">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-200 dark:border-blue-800 flex items-center justify-center animate-pulse shadow-lg"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    >
                      <div className="w-4 h-4 lg:w-6 lg:h-6 bg-gradient-to-br from-primary to-blue-600 rounded-sm flex items-center justify-center">
                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Connecting lines for blockchain effect - Mobile optimized */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 200 200"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient id="blockchainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  {/* Grid connections */}
                  <line
                    x1="32"
                    y1="32"
                    x2="168"
                    y2="32"
                    stroke="url(#blockchainGradient)"
                    strokeWidth="1"
                    className="animate-pulse"
                  />
                  <line
                    x1="32"
                    y1="100"
                    x2="168"
                    y2="100"
                    stroke="url(#blockchainGradient)"
                    strokeWidth="1"
                    className="animate-pulse"
                  />
                  <line
                    x1="32"
                    y1="168"
                    x2="168"
                    y2="168"
                    stroke="url(#blockchainGradient)"
                    strokeWidth="1"
                    className="animate-pulse"
                  />
                  <line
                    x1="32"
                    y1="32"
                    x2="32"
                    y2="168"
                    stroke="url(#blockchainGradient)"
                    strokeWidth="1"
                    className="animate-pulse"
                  />
                  <line
                    x1="100"
                    y1="32"
                    x2="100"
                    y2="168"
                    stroke="url(#blockchainGradient)"
                    strokeWidth="1"
                    className="animate-pulse"
                  />
                  <line
                    x1="168"
                    y1="32"
                    x2="168"
                    y2="168"
                    stroke="url(#blockchainGradient)"
                    strokeWidth="1"
                    className="animate-pulse"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* How It Works with Enhanced Visuals - Mobile optimized */}
          <div className="space-y-12 lg:space-y-16">
            <div className="text-center space-y-4">
              <h2 className="font-roboto text-3xl lg:text-4xl font-bold text-foreground">How It Works</h2>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
                Creating your digital will is simple and secure. Follow these four easy steps to protect your digital
                legacy.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                {
                  step: "1",
                  title: "Connect Wallet",
                  description: "Connect your Sui wallet securely to the platform",
                  icon: <Globe className="h-5 w-5 lg:h-6 lg:w-6" />,
                  color: "from-blue-500 to-blue-600",
                },
                {
                  step: "2",
                  title: "Create Will",
                  description: "Specify SUI amount and configure heir details with our intuitive wizard",
                  icon: <Lock className="h-5 w-5 lg:h-6 lg:w-6" />,
                  color: "from-purple-500 to-purple-600",
                },
                {
                  step: "3",
                  title: "Lock Tokens",
                  description: "Your SUI tokens are securely locked in a smart contract on-chain",
                  icon: <Shield className="h-5 w-5 lg:h-6 lg:w-6" />,
                  color: "from-green-500 to-green-600",
                },
                {
                  step: "4",
                  title: "Auto Distribution",
                  description: "Heirs automatically receive tokens when execution conditions are met",
                  icon: <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6" />,
                  color: "from-orange-500 to-orange-600",
                },
              ].map((item, index) => (
                <div key={index} className="text-center space-y-4 lg:space-y-6 group">
                  <div className="relative">
                    <div
                      className={`w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${item.color} text-white rounded-full flex items-center justify-center font-bold text-xl lg:text-2xl mx-auto group-hover:scale-110 transition-transform shadow-lg font-roboto`}
                    >
                      {item.step}
                    </div>
                    <div className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 w-6 h-6 lg:w-8 lg:h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md border border-gray-200 dark:border-gray-700">
                      {item.icon}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-roboto text-lg lg:text-xl font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section - Mobile optimized */}
          {currentAccount && walletInfo && (
            <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white">
              <div className="absolute inset-0 bg-black/10"></div>
              <CardContent className="relative p-8 lg:p-12 text-center space-y-4 lg:space-y-6">
                <div className="space-y-3 lg:space-y-4">
                  <h3 className="font-roboto text-2xl sm:text-3xl lg:text-4xl font-bold">
                    Ready to Secure Your Legacy?
                  </h3>
                  <p className="text-lg lg:text-xl text-white/90 max-w-2xl mx-auto">
                    Join thousands of users who trust AjogunNet to protect their digital assets. Create your first
                    digital will in just a few minutes.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="secondary"
                    size="lg"
                    asChild
                    className="text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-6 rounded-xl shadow-lg"
                  >
                    <Link href="/create">Get Started Now</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-6 rounded-xl border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    <Link href="/faq">Learn More</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trust Indicators - Mobile optimized */}
          <div className="text-center space-y-6 lg:space-y-8">
            <h3 className="font-roboto text-xl lg:text-2xl font-semibold text-muted-foreground">
              Trusted by the Community
            </h3>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 lg:gap-8 opacity-60">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="text-xs lg:text-sm font-medium">Audited Smart Contracts</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="text-xs lg:text-sm font-medium">Open Source</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="text-xs lg:text-sm font-medium">Community Driven</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

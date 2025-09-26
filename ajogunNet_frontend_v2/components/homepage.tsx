"use client"

import { useEffect, useState } from "react"
import { useWallet } from "@/lib/wallet-context"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AuthModal from "@/components/auth-modal"
import { WalletConnectionModal } from "@/components/wallet-connection-modal"
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
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"

export default function Homepage() {
  const router = useRouter()
  const { isConnected, address, isConnecting } = useWallet()
  const { isAuthenticated, userId } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show wallet connection modal for authenticated users without wallets
  useEffect(() => {
    if (mounted && isAuthenticated && !isConnected && !isConnecting) {
      console.log("User is authenticated but no wallet - showing wallet modal")
      setIsWalletModalOpen(true)
    } else if (isConnected) {
      console.log("Wallet connected - closing wallet modal")
      setIsWalletModalOpen(false)
    }
  }, [mounted, isAuthenticated, isConnected, isConnecting])

  const handleWalletCreated = () => {
    setIsModalOpen(false)
    // Don't close wallet modal here - let the useEffect handle it when wallet is connected
  }

  const handleWalletConnectionSuccess = () => {
    console.log("Wallet connection successful")
    setIsWalletModalOpen(false)
    // Redirect to dashboard after wallet creation
    router.push("/dashboard")
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary animate-pulse" />
            </div>
          </div>
          <p className="text-muted-foreground animate-pulse">Initializing AjogunNet...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Shield className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" />
              </div>
              <span className="text-2xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                AjogunNet
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 relative group"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#how-it-works"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 relative group"
              >
                How it Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#security"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 relative group"
              >
                Security
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <Button
                  onClick={() => setIsWalletModalOpen(true)}
                  className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Get Started
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-muted transition-all duration-300 hover:scale-110"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden border-t border-border transition-all duration-300 overflow-hidden ${
              mobileMenuOpen ? "max-h-96 py-4 opacity-100" : "max-h-0 py-0 opacity-0"
            }`}
          >
            <nav className="flex flex-col space-y-4">
              <a
                href="#features"
                className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-2"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-2"
              >
                How it Works
              </a>
              <a
                href="#security"
                className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-2"
              >
                Security
              </a>
              <div className="pt-4 border-t border-border">
                {isAuthenticated ? (
                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
                  >
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsWalletModalOpen(true)}
                    className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
                  >
                    Get Started
                  </Button>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-20 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:bg-primary/20 animate-fade-in">
                <Zap className="h-4 w-4 animate-pulse" />
                Powered by Blockchain Technology
              </div>
              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight animate-fade-in-up">
                Secure Your
                <br />
                <span className="text-primary bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent animate-pulse">
                  Digital Legacy
                </span>
              </h1>
              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fade-in-up delay-200">
                Effortlessly create secure digital wills for your crypto assets. Distribute your wealth with confidence
                using blockchain's unmatched transparency and security
              </p>
              {/* CTA Section */}
              <div className="space-y-4 lg:space-y-6 animate-fade-in-up delay-300">
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  {isAuthenticated ? (
                    <>
                      <Button
                        asChild
                        size="lg"
                        className="text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-6 rounded-xl bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                      >
                        <Link href="/create">
                          Create Your First Will
                          <ArrowRight className="ml-2 h-4 lg:h-5 w-4 lg:w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        asChild
                        className="text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-6 rounded-xl bg-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      >
                        <Link href="/dashboard">View Dashboard</Link>
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="lg"
                      className="text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-6 rounded-xl bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                      onClick={() => setIsWalletModalOpen(true)}
                    >
                      Get Started Now
                      <ArrowRight className="ml-2 h-4 lg:h-5 w-4 lg:w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  )}
                </div>
                {/* Features */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 transition-all duration-300 hover:scale-105">
                    <CheckCircle className="h-4 w-4 text-green-500 animate-pulse" />
                    <span>Secure & Decentralized</span>
                  </div>
                  <div className="flex items-center gap-2 transition-all duration-300 hover:scale-105">
                    <CheckCircle className="h-4 w-4 text-green-500 animate-pulse delay-500" />
                    <span>No Registration Required</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Visual */}
            <div className="relative mt-8 lg:mt-0 animate-fade-in-up delay-400">
              <div className="relative w-full h-64 sm:h-80 lg:h-96 bg-card rounded-2xl lg:rounded-3xl p-6 lg:p-8 overflow-hidden border border-border transition-all duration-300 hover:shadow-2xl hover:scale-105">
                {/* Central Shield */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-primary rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-3 animate-pulse">
                    <Shield className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-white" />
                  </div>
                </div>
                {/* Floating Icons */}
                <div className="absolute top-4 left-4 lg:top-8 lg:left-8 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-card rounded-lg lg:rounded-xl shadow-lg flex items-center justify-center border border-border transition-all duration-300 hover:scale-110 animate-float">
                  <Coins className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-yellow-500" />
                </div>
                <div className="absolute top-4 right-4 lg:top-8 lg:right-8 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-card rounded-lg lg:rounded-xl shadow-lg flex items-center justify-center border border-border transition-all duration-300 hover:scale-110 animate-float delay-500">
                  <Database className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-blue-500" />
                </div>
                <div className="absolute bottom-4 left-4 lg:bottom-8 lg:left-8 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-card rounded-lg lg:rounded-xl shadow-lg flex items-center justify-center border border-border transition-all duration-300 hover:scale-110 animate-float delay-1000">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-green-500" />
                </div>
                <div className="absolute bottom-4 right-4 lg:bottom-8 lg:right-8 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-card rounded-lg lg:rounded-xl shadow-lg flex items-center justify-center border border-border transition-all duration-300 hover:scale-110 animate-float delay-1500">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8 pt-12 lg:pt-16 max-w-4xl mx-auto">
            {[
              { value: "100%", label: "Decentralized" },
              { value: "0", label: "Intermediaries" },
              { value: "24/7", label: "Available" },
              { value: "∞", label: "Immutable" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center transition-all duration-300 hover:scale-110 animate-fade-in-up"
                style={{ animationDelay: `${600 + index * 100}ms` }}
              >
                <div className="text-2xl lg:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs lg:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 space-y-12 lg:space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Why Choose AjogunNet?</h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
              Built on cutting-edge blockchain technology to provide unmatched security and reliability for your digital
              assets.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="p-6">
                <div className="w-14 h-14 lg:w-16 lg:h-16 bg-primary rounded-xl lg:rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Shield className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
                </div>
                <CardTitle className="text-xl lg:text-2xl">Secure & Immutable</CardTitle>
                <CardDescription className="text-sm lg:text-base">
                  Your wills are stored on the blockchain, ensuring they cannot be tampered with, lost, or corrupted.
                  Cryptographic security protects your legacy.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="p-6">
                <div className="w-14 h-14 lg:w-16 lg:h-16 bg-primary rounded-xl lg:rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Users className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
                </div>
                <CardTitle className="text-xl lg:text-2xl">Multiple Heirs</CardTitle>
                <CardDescription className="text-sm lg:text-base">
                  Distribute your crypto assets among up to 10 heirs with precise percentage allocations. Flexible
                  inheritance planning for complex family structures.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 md:col-span-2 lg:col-span-1">
              <CardHeader className="p-6">
                <div className="w-14 h-14 lg:w-16 lg:h-16 bg-primary rounded-xl lg:rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Clock className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
                </div>
                <CardTitle className="text-xl lg:text-2xl">Smart Execution</CardTitle>
                <CardDescription className="text-sm lg:text-base">
                  Optional automatic execution based on customizable conditions. Your wishes are fulfilled exactly as
                  specified, without human intervention.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-card rounded-2xl lg:rounded-3xl p-6 lg:p-12 border border-border">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-4 lg:space-y-6 text-center lg:text-left">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Blockchain-Powered Security</h2>
                <p className="text-lg lg:text-xl text-muted-foreground">
                  Your digital assets are protected by military-grade cryptography and distributed across the blockchain
                  network.
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
              {/* Blockchain Visualization */}
              <div className="relative mt-8 lg:mt-0">
                <div className="grid grid-cols-3 gap-2 lg:gap-4">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 lg:w-16 lg:h-16 bg-card rounded-lg border border-border flex items-center justify-center shadow-lg"
                    >
                      <div className="w-4 h-4 lg:w-6 lg:h-6 bg-primary rounded-sm flex items-center justify-center">
                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 space-y-12 lg:space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">How It Works</h2>
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
                description: "Connect your wallet securely to the platform",
                icon: <Globe className="h-5 w-5 lg:h-6 lg:w-6" />,
              },
              {
                step: "2",
                title: "Create Will",
                description: "Specify crypto amount and configure heir details with our intuitive wizard",
                icon: <Lock className="h-5 w-5 lg:h-6 lg:w-6" />,
              },
              {
                step: "3",
                title: "Lock Tokens",
                description: "Your crypto tokens are securely locked in a smart contract on-chain",
                icon: <Shield className="h-5 w-5 lg:h-6 lg:w-6" />,
              },
              {
                step: "4",
                title: "Auto Distribution",
                description: "Heirs automatically receive tokens when execution conditions are met",
                icon: <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6" />,
              },
            ].map((item, index) => (
              <div key={index} className="text-center space-y-4 lg:space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl lg:text-2xl mx-auto shadow-lg">
                    {item.step}
                  </div>
                  <div className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 w-6 h-6 lg:w-8 lg:h-8 bg-card rounded-full flex items-center justify-center shadow-md border border-border">
                    {item.icon}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg lg:text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {isAuthenticated && (
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4">
            <Card className="border-0 bg-primary text-white">
              <CardContent className="p-8 lg:p-12 text-center space-y-4 lg:space-y-6">
                <div className="space-y-3 lg:space-y-4">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Ready to Secure Your Legacy?</h3>
                  <p className="text-lg lg:text-xl text-white/90 max-w-2xl mx-auto">
                    Welcome back, {userId}! Create your first digital will in just a few minutes.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="secondary"
                    size="lg"
                    asChild
                    className="text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-6 rounded-xl"
                  >
                    <Link href="/create">Get Started Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Trust Indicators */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-6 lg:space-y-8">
          <h3 className="text-xl lg:text-2xl font-semibold text-muted-foreground">Trusted by the Community</h3>
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
      </section>

      {/* Auth Modal */}
      {/* <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleWalletCreated}
      /> */}

      {/* Wallet Connection Modal */}
      <WalletConnectionModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onWalletCreated={handleWalletConnectionSuccess}
      />
    </div>
  )
}

// "use client"

// import { useEffect, useState } from "react"
// import { useWallet } from "@/lib/wallet-context"
// import { useAuth } from "@/lib/auth-context"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import AuthModal from "@/components/auth-modal"
// import { WalletConnectionModal } from "@/components/wallet-connection-modal"
// import {
//   Shield,
//   Users,
//   Clock,
//   ArrowRight,
//   CheckCircle,
//   Star,
//   Zap,
//   Lock,
//   Globe,
//   TrendingUp,
//   Coins,
//   FileText,
//   Key,
//   Database,
//   Menu,
//   X,
// } from "lucide-react"
// import Link from "next/link"
// import { ThemeToggle } from "@/components/theme-toggle"

// export default function Homepage() {
//   const { isConnected, address, isConnecting } = useWallet()
//   const { isAuthenticated, userId } = useAuth()
//   const [mounted, setMounted] = useState(false)
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   // Show wallet connection modal for authenticated users without wallets
//   useEffect(() => {
//     if (mounted && isAuthenticated && !isConnected && !isConnecting) {
//       console.log("User is authenticated but no wallet - showing wallet modal")
//       setIsWalletModalOpen(true)
//     } else if (isConnected) {
//       console.log("Wallet connected - closing wallet modal")
//       setIsWalletModalOpen(false)
//     }
//   }, [mounted, isAuthenticated, isConnected, isConnecting])

//   const handleWalletCreated = () => {
//     setIsModalOpen(false)
//     // Don't close wallet modal here - let the useEffect handle it when wallet is connected
//   }

//   const handleWalletConnectionSuccess = () => {
//     console.log("Wallet connection successful")
//     setIsWalletModalOpen(false)
//     // Redirect to dashboard after wallet creation
//     window.location.href = "/dashboard"
//   }

//   if (!mounted) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <div className="text-center space-y-4">
//           <div className="relative">
//             <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <Shield className="h-6 w-6 text-primary animate-pulse" />
//             </div>
//           </div>
//           <p className="text-muted-foreground animate-pulse">Initializing AjogunNet...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             {/* Logo */}
//             <div className="flex items-center space-x-3 group">
//               <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
//                 <Shield className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" />
//               </div>
//               <span className="text-2xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
//                 AjogunNet
//               </span>
//             </div>

//             {/* Desktop Navigation */}
//             <nav className="hidden md:flex items-center space-x-8">
//               <a
//                 href="#features"
//                 className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 relative group"
//               >
//                 Features
//                 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
//               </a>
//               <a
//                 href="#how-it-works"
//                 className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 relative group"
//               >
//                 How it Works
//                 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
//               </a>
//               <a
//                 href="#security"
//                 className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 relative group"
//               >
//                 Security
//                 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
//               </a>
//             </nav>

//             {/* Desktop Actions */}
//             <div className="hidden md:flex items-center space-x-4">
//               <ThemeToggle />
//               {isAuthenticated ? (
//                 <Button
//                   asChild
//                   className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
//                 >
//                   <Link href="/dashboard">Go to Dashboard</Link>
//                 </Button>
//               ) : (
//                 <Button
//                   onClick={() => setIsWalletModalOpen(true)}
//                   className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
//                 >
//                   Get Started
//                 </Button>
//               )}
//             </div>

//             {/* Mobile Menu Button */}
//             <div className="md:hidden flex items-center space-x-2">
//               <ThemeToggle />
//               <button
//                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                 className="p-2 rounded-lg hover:bg-muted transition-all duration-300 hover:scale-110"
//               >
//                 {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//               </button>
//             </div>
//           </div>

//           {/* Mobile Menu */}
//           <div
//             className={`md:hidden border-t border-border transition-all duration-300 overflow-hidden ${
//               mobileMenuOpen ? "max-h-96 py-4 opacity-100" : "max-h-0 py-0 opacity-0"
//             }`}
//           >
//             <nav className="flex flex-col space-y-4">
//               <a
//                 href="#features"
//                 className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-2"
//               >
//                 Features
//               </a>
//               <a
//                 href="#how-it-works"
//                 className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-2"
//               >
//                 How it Works
//               </a>
//               <a
//                 href="#security"
//                 className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-2"
//               >
//                 Security
//               </a>
//               <div className="pt-4 border-t border-border">
//                 {isAuthenticated ? (
//                   <Button
//                     asChild
//                     className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
//                   >
//                     <Link href="/dashboard">Go to Dashboard</Link>
//                   </Button>
//                 ) : (
//                   <Button
//                     onClick={() => setIsWalletModalOpen(true)}
//                     className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
//                   >
//                     Get Started
//                   </Button>
//                 )}
//               </div>
//             </nav>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="relative overflow-hidden bg-background">
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
//           <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         </div>

//         <div className="max-w-7xl mx-auto px-4 py-12 sm:py-20 lg:py-32 relative">
//           <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
//             {/* Left Content */}
//             <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
//               {/* Badge */}
//               <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:bg-primary/20 animate-fade-in">
//                 <Zap className="h-4 w-4 animate-pulse" />
//                 Powered by Blockchain Technology
//               </div>
//               {/* Main Heading */}
//               <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight animate-fade-in-up">
//                 Secure Your
//                 <br />
//                 <span className="text-primary bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent animate-pulse">
//                   Digital Legacy
//                 </span>
//               </h1>
//               {/* Subtitle */}
//               <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fade-in-up delay-200">
//                 Effortlessly create secure digital wills for your crypto assets. Distribute your wealth with confidence
//                 using blockchain's unmatched transparency and security
//               </p>
//               {/* CTA Section */}
//               <div className="space-y-4 lg:space-y-6 animate-fade-in-up delay-300">
//                 <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
//                   {isAuthenticated ? (
//                     <>
//                       <Button
//                         asChild
//                         size="lg"
//                         className="text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-6 rounded-xl bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-xl"
//                       >
//                         <Link href="/create">
//                           Create Your First Will
//                           <ArrowRight className="ml-2 h-4 lg:h-5 w-4 lg:w-5 transition-transform duration-300 group-hover:translate-x-1" />
//                         </Link>
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="lg"
//                         asChild
//                         className="text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-6 rounded-xl bg-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg"
//                       >
//                         <Link href="/dashboard">View Dashboard</Link>
//                       </Button>
//                     </>
//                   ) : (
//                     <Button
//                       size="lg"
//                       className="text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-6 rounded-xl bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
//                       onClick={() => setIsWalletModalOpen(true)}
//                     >
//                       Get Started Now
//                       <ArrowRight className="ml-2 h-4 lg:h-5 w-4 lg:w-5 transition-transform duration-300 group-hover:translate-x-1" />
//                     </Button>
//                   )}
//                 </div>
//                 {/* Features */}
//                 <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
//                   <div className="flex items-center gap-2 transition-all duration-300 hover:scale-105">
//                     <CheckCircle className="h-4 w-4 text-green-500 animate-pulse" />
//                     <span>Secure & Decentralized</span>
//                   </div>
//                   <div className="flex items-center gap-2 transition-all duration-300 hover:scale-105">
//                     <CheckCircle className="h-4 w-4 text-green-500 animate-pulse delay-500" />
//                     <span>No Registration Required</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* Right Visual */}
//             <div className="relative mt-8 lg:mt-0 animate-fade-in-up delay-400">
//               <div className="relative w-full h-64 sm:h-80 lg:h-96 bg-card rounded-2xl lg:rounded-3xl p-6 lg:p-8 overflow-hidden border border-border transition-all duration-300 hover:shadow-2xl hover:scale-105">
//                 {/* Central Shield */}
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-primary rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-3 animate-pulse">
//                     <Shield className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-white" />
//                   </div>
//                 </div>
//                 {/* Floating Icons */}
//                 <div className="absolute top-4 left-4 lg:top-8 lg:left-8 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-card rounded-lg lg:rounded-xl shadow-lg flex items-center justify-center border border-border transition-all duration-300 hover:scale-110 animate-float">
//                   <Coins className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-yellow-500" />
//                 </div>
//                 <div className="absolute top-4 right-4 lg:top-8 lg:right-8 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-card rounded-lg lg:rounded-xl shadow-lg flex items-center justify-center border border-border transition-all duration-300 hover:scale-110 animate-float delay-500">
//                   <Database className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-blue-500" />
//                 </div>
//                 <div className="absolute bottom-4 left-4 lg:bottom-8 lg:left-8 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-card rounded-lg lg:rounded-xl shadow-lg flex items-center justify-center border border-border transition-all duration-300 hover:scale-110 animate-float delay-1000">
//                   <FileText className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-green-500" />
//                 </div>
//                 <div className="absolute bottom-4 right-4 lg:bottom-8 lg:right-8 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-card rounded-lg lg:rounded-xl shadow-lg flex items-center justify-center border border-border transition-all duration-300 hover:scale-110 animate-float delay-1500">
//                   <Users className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-purple-500" />
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* Stats */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8 pt-12 lg:pt-16 max-w-4xl mx-auto">
//             {[
//               { value: "100%", label: "Decentralized" },
//               { value: "0", label: "Intermediaries" },
//               { value: "24/7", label: "Available" },
//               { value: "∞", label: "Immutable" },
//             ].map((stat, index) => (
//               <div
//                 key={index}
//                 className="text-center transition-all duration-300 hover:scale-110 animate-fade-in-up"
//                 style={{ animationDelay: `${600 + index * 100}ms` }}
//               >
//                 <div className="text-2xl lg:text-3xl font-bold text-primary">{stat.value}</div>
//                 <div className="text-xs lg:text-sm text-muted-foreground">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="py-16 lg:py-24 bg-muted/30">
//         <div className="max-w-7xl mx-auto px-4 space-y-12 lg:space-y-16">
//           <div className="text-center space-y-4">
//             <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Why Choose AjogunNet?</h2>
//             <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
//               Built on cutting-edge blockchain technology to provide unmatched security and reliability for your digital
//               assets.
//             </p>
//           </div>
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
//             <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
//               <CardHeader className="p-6">
//                 <div className="w-14 h-14 lg:w-16 lg:h-16 bg-primary rounded-xl lg:rounded-2xl flex items-center justify-center mb-4 shadow-lg">
//                   <Shield className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
//                 </div>
//                 <CardTitle className="text-xl lg:text-2xl">Secure & Immutable</CardTitle>
//                 <CardDescription className="text-sm lg:text-base">
//                   Your wills are stored on the blockchain, ensuring they cannot be tampered with, lost, or corrupted.
//                   Cryptographic security protects your legacy.
//                 </CardDescription>
//               </CardHeader>
//             </Card>
//             <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
//               <CardHeader className="p-6">
//                 <div className="w-14 h-14 lg:w-16 lg:h-16 bg-primary rounded-xl lg:rounded-2xl flex items-center justify-center mb-4 shadow-lg">
//                   <Users className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
//                 </div>
//                 <CardTitle className="text-xl lg:text-2xl">Multiple Heirs</CardTitle>
//                 <CardDescription className="text-sm lg:text-base">
//                   Distribute your crypto assets among up to 10 heirs with precise percentage allocations. Flexible
//                   inheritance planning for complex family structures.
//                 </CardDescription>
//               </CardHeader>
//             </Card>
//             <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 md:col-span-2 lg:col-span-1">
//               <CardHeader className="p-6">
//                 <div className="w-14 h-14 lg:w-16 lg:h-16 bg-primary rounded-xl lg:rounded-2xl flex items-center justify-center mb-4 shadow-lg">
//                   <Clock className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
//                 </div>
//                 <CardTitle className="text-xl lg:text-2xl">Smart Execution</CardTitle>
//                 <CardDescription className="text-sm lg:text-base">
//                   Optional automatic execution based on customizable conditions. Your wishes are fulfilled exactly as
//                   specified, without human intervention.
//                 </CardDescription>
//               </CardHeader>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* Security Section */}
//       <section id="security" className="py-16 lg:py-24">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="bg-card rounded-2xl lg:rounded-3xl p-6 lg:p-12 border border-border">
//             <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
//               <div className="space-y-4 lg:space-y-6 text-center lg:text-left">
//                 <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Blockchain-Powered Security</h2>
//                 <p className="text-lg lg:text-xl text-muted-foreground">
//                   Your digital assets are protected by military-grade cryptography and distributed across the blockchain
//                   network.
//                 </p>
//                 <div className="space-y-3 lg:space-y-4">
//                   {[
//                     {
//                       icon: <Lock className="h-5 w-5" />,
//                       title: "Cryptographic Protection",
//                       desc: "256-bit encryption secures your will",
//                     },
//                     {
//                       icon: <Globe className="h-5 w-5" />,
//                       title: "Distributed Network",
//                       desc: "Stored across thousands of nodes",
//                     },
//                     {
//                       icon: <Key className="h-5 w-5" />,
//                       title: "Private Key Control",
//                       desc: "Only you control your assets",
//                     },
//                     {
//                       icon: <Database className="h-5 w-5" />,
//                       title: "Immutable Records",
//                       desc: "Permanent blockchain storage",
//                     },
//                   ].map((item, index) => (
//                     <div key={index} className="flex items-start gap-3 lg:gap-4">
//                       <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
//                         {item.icon}
//                       </div>
//                       <div className="text-left">
//                         <h3 className="font-semibold text-foreground text-sm lg:text-base">{item.title}</h3>
//                         <p className="text-xs lg:text-sm text-muted-foreground">{item.desc}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               {/* Blockchain Visualization */}
//               <div className="relative mt-8 lg:mt-0">
//                 <div className="grid grid-cols-3 gap-2 lg:gap-4">
//                   {Array.from({ length: 9 }).map((_, i) => (
//                     <div
//                       key={i}
//                       className="w-12 h-12 lg:w-16 lg:h-16 bg-card rounded-lg border border-border flex items-center justify-center shadow-lg"
//                     >
//                       <div className="w-4 h-4 lg:w-6 lg:h-6 bg-primary rounded-sm flex items-center justify-center">
//                         <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-white rounded-full"></div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section id="how-it-works" className="py-16 lg:py-24 bg-muted/30">
//         <div className="max-w-7xl mx-auto px-4 space-y-12 lg:space-y-16">
//           <div className="text-center space-y-4">
//             <h2 className="text-3xl lg:text-4xl font-bold text-foreground">How It Works</h2>
//             <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
//               Creating your digital will is simple and secure. Follow these four easy steps to protect your digital
//               legacy.
//             </p>
//           </div>
//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
//             {[
//               {
//                 step: "1",
//                 title: "Connect Wallet",
//                 description: "Connect your wallet securely to the platform",
//                 icon: <Globe className="h-5 w-5 lg:h-6 lg:w-6" />,
//               },
//               {
//                 step: "2",
//                 title: "Create Will",
//                 description: "Specify crypto amount and configure heir details with our intuitive wizard",
//                 icon: <Lock className="h-5 w-5 lg:h-6 lg:w-6" />,
//               },
//               {
//                 step: "3",
//                 title: "Lock Tokens",
//                 description: "Your crypto tokens are securely locked in a smart contract on-chain",
//                 icon: <Shield className="h-5 w-5 lg:h-6 lg:w-6" />,
//               },
//               {
//                 step: "4",
//                 title: "Auto Distribution",
//                 description: "Heirs automatically receive tokens when execution conditions are met",
//                 icon: <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6" />,
//               },
//             ].map((item, index) => (
//               <div key={index} className="text-center space-y-4 lg:space-y-6">
//                 <div className="relative">
//                   <div className="w-16 h-16 lg:w-20 lg:h-20 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl lg:text-2xl mx-auto shadow-lg">
//                     {item.step}
//                   </div>
//                   <div className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 w-6 h-6 lg:w-8 lg:h-8 bg-card rounded-full flex items-center justify-center shadow-md border border-border">
//                     {item.icon}
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <h3 className="text-lg lg:text-xl font-semibold text-foreground">{item.title}</h3>
//                   <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">{item.description}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       {isAuthenticated && (
//         <section className="py-16 lg:py-24">
//           <div className="max-w-7xl mx-auto px-4">
//             <Card className="border-0 bg-primary text-white">
//               <CardContent className="p-8 lg:p-12 text-center space-y-4 lg:space-y-6">
//                 <div className="space-y-3 lg:space-y-4">
//                   <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Ready to Secure Your Legacy?</h3>
//                   <p className="text-lg lg:text-xl text-white/90 max-w-2xl mx-auto">
//                     Welcome back, {userId}! Create your first digital will in just a few minutes.
//                   </p>
//                 </div>
//                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                   <Button
//                     variant="secondary"
//                     size="lg"
//                     asChild
//                     className="text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-6 rounded-xl"
//                   >
//                     <Link href="/create">Get Started Now</Link>
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </section>
//       )}

//       {/* Trust Indicators */}
//       <section className="py-16 lg:py-24">
//         <div className="max-w-7xl mx-auto px-4 text-center space-y-6 lg:space-y-8">
//           <h3 className="text-xl lg:text-2xl font-semibold text-muted-foreground">Trusted by the Community</h3>
//           <div className="flex flex-col sm:flex-row justify-center items-center gap-4 lg:gap-8 opacity-60">
//             <div className="flex items-center gap-2">
//               <Shield className="h-4 w-4 lg:h-5 lg:w-5" />
//               <span className="text-xs lg:text-sm font-medium">Audited Smart Contracts</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Lock className="h-4 w-4 lg:h-5 lg:w-5" />
//               <span className="text-xs lg:text-sm font-medium">Open Source</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Star className="h-4 w-4 lg:h-5 lg:w-5" />
//               <span className="text-xs lg:text-sm font-medium">Community Driven</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Auth Modal */}
//       {/* <AuthModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSuccess={handleWalletCreated}
//       /> */}

//       {/* Wallet Connection Modal */}
//       <WalletConnectionModal
//         isOpen={isWalletModalOpen}
//         onClose={() => setIsWalletModalOpen(false)}
//         onWalletCreated={handleWalletConnectionSuccess}
//       />
//     </div>
//   )
// }

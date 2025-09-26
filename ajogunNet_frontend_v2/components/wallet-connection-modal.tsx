"use client"

import React, { useState } from "react"
import { X, Wallet, Shield, AlertCircle, CheckCircle, Plus, Key, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/lib/wallet-context"
import { WalletCreationForm } from "@/components/wallet-creation-form"

interface WalletConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  onWalletCreated: () => void
}

export function WalletConnectionModal({ isOpen, onClose, onWalletCreated }: WalletConnectionModalProps) {
  const { isConnected, address, isConnecting, connectWallet, pendingWallet } = useWallet()
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [step, setStep] = useState<"choose" | "create" | "connecting">("choose")

  React.useEffect(() => {
    // Only auto-close if we're not in the middle of wallet creation
    console.log("Modal useEffect triggered:", { isConnected, address, step, pendingWallet })
    
    // Don't auto-close if there's a pending wallet (waiting for verification)
    if (isConnected && address && step !== "create" && !pendingWallet) {
      console.log("Auto-closing modal due to wallet connection")
      onWalletCreated()
    } else if (pendingWallet) {
      console.log("Pending wallet exists - NOT auto-closing")
    } else if (isConnected && address && step === "create") {
      console.log("Wallet connected but in create step - NOT auto-closing")
    }
  }, [isConnected, address, onWalletCreated, step, pendingWallet])

  if (!isOpen) return null

  const handleConnectWallet = async () => {
    setStep("connecting")
    setConnectionError(null)
    try {
      await connectWallet()
      setStep("choose")
    } catch (error) {
      setConnectionError("Failed to connect wallet. Please try again.")
      setStep("choose")
    }
  }

  const handleWalletCreated = () => {
    // Only close the modal after wallet is fully created and verified
    console.log("Wallet creation completed, closing modal")
    setStep("choose")
    onWalletCreated()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-card rounded-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto border border-border shadow-2xl animate-scale-in transform transition-all duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-card p-4 sm:p-6 border-b border-border rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-3">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-card-foreground">
                  {step === "create" ? "Create Wallet" : step === "connecting" ? "Connecting..." : "Wallet Setup"}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {step === "create"
                    ? "Set up your secure wallet"
                    : step === "connecting"
                      ? "Connecting to your wallet"
                      : "Create or connect your wallet"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-all duration-300 hover:scale-110"
              disabled={isConnecting}
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {step === "create" ? (
            <WalletCreationForm onSuccess={handleWalletCreated} onBack={() => setStep("choose")} />
          ) : (
            <>
              {/* Security Notice */}
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 sm:p-4 transition-all duration-300 hover:bg-primary/15">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h3 className="font-semibold text-primary mb-2 text-sm sm:text-base">Secure & Decentralized</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Your wallet is secured by blockchain technology. We never store your private keys.
                    </p>
                  </div>
                </div>
              </div>

              {/* Connection Status */}
              {isConnected && address ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 sm:p-4 animate-fade-in">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 animate-pulse" />
                    <div>
                      <h3 className="font-semibold text-green-800 dark:text-green-200 text-sm sm:text-base">
                        Wallet Connected
                      </h3>
                      <p className="text-xs sm:text-sm text-green-700 dark:text-green-300 font-mono break-all">
                        {address.slice(0, 8)}...{address.slice(-6)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Loading State */}
                  {step === "connecting" && (
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 sm:p-6 text-center animate-fade-in">
                      <div className="relative mx-auto w-12 h-12 sm:w-16 sm:h-16 mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Key className="w-5 h-5 sm:w-6 sm:h-6 text-primary animate-pulse" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-primary mb-2 text-sm sm:text-base">Connecting Wallet</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Establishing secure connection...</p>
                    </div>
                  )}

                  {/* Wallet Options */}
                  {step === "choose" && (
                    <div className="space-y-3 sm:space-y-4 animate-fade-in">
                      <h3 className="text-base sm:text-lg font-semibold text-card-foreground">Choose an Option</h3>

                      {/* Create New Wallet */}
                      <div className="border border-border rounded-xl p-3 sm:p-4 hover:bg-muted/50 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 flex-shrink-0">
                              <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-card-foreground text-sm sm:text-base">
                                Create New Wallet
                              </h4>
                              <p className="text-xs sm:text-sm text-muted-foreground">Generate a new secure wallet</p>
                            </div>
                          </div>
                          <Button
                            onClick={() => setStep("create")}
                            disabled={isConnecting}
                            className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 text-xs sm:text-sm px-3 sm:px-4 py-2 flex-shrink-0"
                          >
                            Create
                          </Button>
                        </div>
                      </div>

                      {/* Connect Existing Wallet */}
                      <div className="border border-border rounded-xl p-3 sm:p-4 hover:bg-muted/50 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30 transition-colors duration-300 flex-shrink-0">
                              <Key className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-card-foreground text-sm sm:text-base">
                                Connect Existing
                              </h4>
                              <p className="text-xs sm:text-sm text-muted-foreground">Connect your existing wallet</p>
                            </div>
                          </div>
                          <Button
                            onClick={handleConnectWallet}
                            disabled={isConnecting}
                            variant="outline"
                            className="transition-all duration-300 hover:scale-105 bg-transparent text-xs sm:text-sm px-3 sm:px-4 py-2 flex-shrink-0"
                          >
                            Connect
                          </Button>
                        </div>
                      </div>

                      {/* Coming Soon Options */}
                      <div className="border border-border rounded-xl p-3 sm:p-4 opacity-50">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-card-foreground text-sm sm:text-base">
                                Hardware Wallets
                              </h4>
                              <p className="text-xs sm:text-sm text-muted-foreground">Ledger, Trezor support</p>
                            </div>
                          </div>
                          <Button
                            disabled
                            variant="outline"
                            size="sm"
                            className="text-xs px-3 py-2 flex-shrink-0 bg-transparent"
                          >
                            Soon
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {connectionError && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 sm:p-4 animate-shake">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                        <p className="text-xs sm:text-sm text-red-700 dark:text-red-300">{connectionError}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Features */}
              {step === "choose" && (
                <div className="space-y-3 animate-fade-in delay-200">
                  <h3 className="text-sm font-semibold text-card-foreground">What you can do:</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {["Create digital wills", "Secure crypto assets", "Set up beneficiaries", "Track your legacy"].map(
                      (feature, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 transition-all duration-300 hover:translate-x-1"
                        >
                          <CheckCircle
                            className="w-4 h-4 text-green-500 animate-pulse flex-shrink-0"
                            style={{ animationDelay: `${index * 200}ms` }}
                          />
                          <span className="text-xs sm:text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {step !== "create" && (
          <div className="sticky bottom-0 bg-card p-4 sm:p-6 border-t border-border rounded-b-2xl">
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isConnecting}
                className="transition-all duration-300 hover:scale-105 bg-transparent text-sm"
              >
                Cancel
              </Button>
              {isConnected && address && (
                <Button
                  onClick={onClose}
                  className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 text-sm"
                >
                  Continue
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

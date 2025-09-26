"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Shield, User, Lock, CheckCircle, AlertCircle, Copy, Key } from "lucide-react"
import { useWallet } from "@/lib/wallet-context"

interface WalletCreationFormProps {
  onSuccess: () => void
  onBack: () => void
}

export function WalletCreationForm({ onSuccess, onBack }: WalletCreationFormProps) {
  const { createWallet, verifyAndActivateWallet, isCreating, isVerifying } = useWallet()
  const [step, setStep] = useState<'create' | 'verify'>('create')
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  })
  const [walletData, setWalletData] = useState<{
    address: string
    mnemonic: string
    userId: string
    password: string
  } | null>(null)
  const [userEnteredMnemonic, setUserEnteredMnemonic] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showMnemonic, setShowMnemonic] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [mnemonicCopied, setMnemonicCopied] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateWallet = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      console.log("Creating wallet with:", { username: formData.username, password: formData.password })
      const result = await createWallet(formData.username, formData.password)

      console.log("Wallet creation result:", result)

      if (result.success && result.mnemonic && result.address) {
        console.log("Wallet created successfully, switching to verify step")

        // Store wallet data for verification
        setWalletData({
          address: result.address,
          mnemonic: result.mnemonic,
          userId: formData.username,
          password: formData.password
        })

        // Switch to verification step
        setStep('verify')
        setErrors({})
        setUserEnteredMnemonic("")

        console.log("Switched to verify step with mnemonic:", result.mnemonic)
      } else {
        console.error("Wallet creation failed:", result)
        setErrors({ general: result.message || "Failed to create wallet. Please try again." })
      }
    } catch (error) {
      console.error("Failed to create wallet:", error)
      setErrors({ general: "Failed to create wallet. Please try again." })
    }
  }

  const handleVerifyWallet = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!walletData) {
      setErrors({ mnemonic: "No wallet data found. Please start over." })
      return
    }

    if (!userEnteredMnemonic.trim()) {
      setErrors({ mnemonic: "Please enter your mnemonic phrase" })
      return
    }

    if (userEnteredMnemonic.trim() !== walletData.mnemonic.trim()) {
      setErrors({ mnemonic: "Mnemonic phrase does not match. Please try again." })
      return
    }

    try {
      console.log("Verifying wallet with mnemonic:", userEnteredMnemonic)
      const result = await verifyAndActivateWallet(userEnteredMnemonic)

      console.log("Verification result:", result)

      if (result.success) {
        console.log("🎊 === WALLET VERIFICATION COMPLETE ===")
        console.log(`✅ User: ${walletData.userId}`)
        console.log(`✅ Address: ${walletData.address}`)
        console.log(`✅ Verification Time: ${new Date().toISOString()}`)
        console.log("======================================")

        // Store user credentials locally for reference
        // localStorage.setItem(
        //   "walletCredentials",
        //   JSON.stringify({
        //     username: walletData.userId,
        //     passwordHash: btoa(walletData.password),
        //     createdAt: new Date().toISOString(),
        //   }),
        // )

        // Call success callback to close modal and proceed
        onSuccess()
      } else {
        console.error("Wallet verification failed:", result.message)
        setErrors({ mnemonic: result.message || "Failed to verify wallet. Please try again." })
      }
    } catch (error) {
      console.error("Failed to verify wallet:", error)
      setErrors({ mnemonic: "Failed to verify wallet. Please try again." })
    }
  }

  const copyMnemonic = async () => {
    if (!walletData?.mnemonic) return

    try {
      await navigator.clipboard.writeText(walletData.mnemonic)
      setMnemonicCopied(true)
      setTimeout(() => setMnemonicCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy mnemonic:", error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const passwordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const getStrengthColor = (strength: number) => {
    if (strength < 2) return "bg-red-500"
    if (strength < 4) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStrengthText = (strength: number) => {
    if (strength < 2) return "Weak"
    if (strength < 4) return "Medium"
    return "Strong"
  }

  const strength = passwordStrength(formData.password)

  console.log("Current step:", step)
  console.log("Wallet data:", walletData)

  if (step === 'verify' && walletData) {
    console.log("Rendering verify step with mnemonic:", walletData.mnemonic)
    return (
      <div className="w-full max-w-md mx-auto animate-scale-in">
        <Card className="border-border bg-card text-card-foreground">
          <CardHeader className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-glow">
              <Key className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Verify Your Wallet</CardTitle>
            <CardDescription className="text-muted-foreground">
              Please save your mnemonic phrase and enter it below to activate your wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mnemonic Display */}
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800 text-sm">Important: Save Your Mnemonic</span>
                </div>
                <p className="text-yellow-700 text-xs mb-3">
                  This is your wallet recovery phrase. Store it safely and never share it with anyone.
                </p>
                <div className="bg-white border rounded-lg p-4 relative">
                  {showMnemonic ? (
                    <div className="space-y-3">
                      {/* Mnemonic words in a grid */}
                      <div className="grid grid-cols-3 gap-2">
                        {walletData.mnemonic.split(' ').map((word, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center cursor-pointer hover:bg-gray-100 transition-colors select-all"
                            onClick={() => {
                              // Select the word when clicked
                              const selection = window.getSelection()
                              const range = document.createRange()
                              range.selectNodeContents(document.getElementById(`word-${index}`)!)
                              selection?.removeAllRanges()
                              selection?.addRange(range)
                            }}
                          >
                            <span className="text-xs text-gray-500 block">{index + 1}</span>
                            <span
                              id={`word-${index}`}
                              className="font-mono text-sm text-gray-800 font-medium select-all"
                            >
                              {word}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Full mnemonic for easy copying */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Full phrase (click to select all):</div>
                        <div
                          className="font-mono text-sm text-gray-800 leading-relaxed cursor-pointer select-all hover:bg-gray-100 p-2 rounded transition-colors"
                          onClick={() => {
                            const selection = window.getSelection()
                            const range = document.createRange()
                            range.selectNodeContents(document.getElementById('full-mnemonic')!)
                            selection?.removeAllRanges()
                            selection?.addRange(range)
                          }}
                          id="full-mnemonic"
                        >
                          {walletData.mnemonic}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Hidden state with dots */}
                      <div className="grid grid-cols-3 gap-2">
                        {Array.from({ length: 12 }).map((_, index) => (
                          <div
                            key={index}
                            className="bg-gray-100 border border-gray-200 rounded-lg p-2 text-center"
                          >
                            <span className="text-xs text-gray-400 block">{index + 1}</span>
                            <span className="font-mono text-sm text-gray-400">•••••</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-gray-100 border border-gray-200 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Full phrase (hidden):</div>
                        <div className="font-mono text-sm text-gray-400 leading-relaxed">
                          ••••• ••••• ••••• ••••• ••••• ••••• ••••• ••••• ••••• ••••• ••••• •••••
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMnemonic(!showMnemonic)}
                      className="text-xs flex-1"
                    >
                      {showMnemonic ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                      {showMnemonic ? 'Hide Phrase' : 'Show Phrase'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyMnemonic}
                      className="text-xs flex-1"
                      disabled={!showMnemonic}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      {mnemonicCopied ? 'Copied!' : 'Copy All'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Verification Form */}
              <form onSubmit={handleVerifyWallet} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userMnemonic" className="text-foreground">
                    Enter Your Mnemonic Phrase
                  </Label>
                  <div className="space-y-2">
                    <textarea
                      id="userMnemonic"
                      placeholder="Enter the 12-word mnemonic phrase (separate words with spaces)"
                      value={userEnteredMnemonic}
                      onChange={(e) => {
                        setUserEnteredMnemonic(e.target.value)
                        // Clear error when user starts typing
                        if (errors.mnemonic) {
                          setErrors(prev => ({ ...prev, mnemonic: "" }))
                        }
                      }}
                      className={`w-full min-h-[100px] px-3 py-2 border rounded-lg bg-input text-foreground border-border resize-none font-mono text-sm ${errors.mnemonic ? "border-red-500" : ""}`}
                      rows={4}
                    />

                    {/* Word count and validation indicator */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">
                        Words entered: {userEnteredMnemonic.trim().split(/\s+/).filter(word => word.length > 0).length} / 12
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Validation status */}
                        {userEnteredMnemonic.trim() && (
                          <span className={`flex items-center gap-1 ${userEnteredMnemonic.trim() === walletData.mnemonic.trim()
                            ? 'text-green-600'
                            : 'text-gray-400'
                            }`}>
                            {userEnteredMnemonic.trim() === walletData.mnemonic.trim() ? (
                              <>
                                <CheckCircle className="h-3 w-3" />
                                Match!
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-3 w-3" />
                                Checking...
                              </>
                            )}
                          </span>
                        )}

                        {userEnteredMnemonic.trim() && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setUserEnteredMnemonic("")}
                            className="text-xs h-auto p-1 text-gray-500 hover:text-gray-700"
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Quick paste button */}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText()
                            setUserEnteredMnemonic(text)
                          } catch (error) {
                            console.error("Failed to paste:", error)
                          }
                        }}
                        className="text-xs"
                      >
                        Paste from Clipboard
                      </Button>

                      {/* Auto-fill button for testing (remove in production) */}
                      {process.env.NODE_ENV === 'development' && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setUserEnteredMnemonic(walletData.mnemonic)}
                          className="text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          Auto-fill (Dev)
                        </Button>
                      )}
                    </div>
                  </div>

                  {errors.mnemonic && (
                    <div className="flex items-center gap-2 text-red-500 text-sm animate-shake">
                      <AlertCircle className="h-4 w-4" />
                      {errors.mnemonic}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105"
                  >
                    {isVerifying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white mr-2" />
                        Verifying...
                      </>
                    ) : (
                      "Verify & Activate Wallet"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('create')}
                    disabled={isVerifying}
                    className="w-full border-border text-foreground hover:bg-muted transition-all duration-300 bg-transparent"
                  >
                    Back to Creation
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto animate-scale-in">
      <Card className="border-border bg-card text-card-foreground">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-glow">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Create Your Wallet</CardTitle>
          <CardDescription className="text-muted-foreground">
            Set up your secure digital wallet with username and password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleCreateWallet} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className={`pl-10 bg-input text-foreground border-border ${errors.username ? "border-red-500" : ""}`}
                />
              </div>
              {errors.username && (
                <div className="flex items-center gap-2 text-red-500 text-sm animate-shake">
                  <AlertCircle className="h-4 w-4" />
                  {errors.username}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`pl-10 pr-10 bg-input text-foreground border-border ${errors.password ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strength)}`}
                        style={{ width: `${(strength / 5) * 100}%` }}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium ${strength < 2 ? "text-red-500" : strength < 4 ? "text-yellow-500" : "text-green-500"}`}
                    >
                      {getStrengthText(strength)}
                    </span>
                  </div>
                </div>
              )}
              {errors.password && (
                <div className="flex items-center gap-2 text-red-500 text-sm animate-shake">
                  <AlertCircle className="h-4 w-4" />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={`pl-10 pr-10 bg-input text-foreground border-border ${errors.confirmPassword ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <div className="flex items-center gap-2 text-green-500 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  Passwords match
                </div>
              )}
              {errors.confirmPassword && (
                <div className="flex items-center gap-2 text-red-500 text-sm animate-shake">
                  <AlertCircle className="h-4 w-4" />
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="flex items-center gap-2 text-red-500 text-sm animate-shake">
                <AlertCircle className="h-4 w-4" />
                {errors.general}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                type="submit"
                disabled={isCreating}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white mr-2" />
                    Creating Wallet...
                  </>
                ) : (
                  "Create Wallet"
                )}
              </Button>

              {/* Debug button - remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    console.log("Debug: Forcing step to verify")
                    setWalletData({
                      address: "0x1234567890123456789012345678901234567890",
                      mnemonic: "flavor buffalo spot torch female warm curious truly close measure bid velvet",
                      userId: "test-user",
                      password: "test-password"
                    })
                    setStep('verify')
                  }}
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 transition-all duration-300 bg-transparent"
                >
                  Debug: Test Verify Step
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={isCreating}
                className="w-full border-border text-foreground hover:bg-muted transition-all duration-300 bg-transparent"
              >
                Back
              </Button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Security Notice</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your credentials are encrypted and stored securely. Make sure to remember your username and password as
              they cannot be recovered.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

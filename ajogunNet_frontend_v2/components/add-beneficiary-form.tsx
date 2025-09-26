"use client"

import type React from "react"

import { useState } from "react"
import {
  X,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Wallet,
  Percent,
  AlertTriangle,
  CheckCircle,
  Plus,
  Minus,
  Shield,
  Heart,
  Users,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface AddBeneficiaryFormProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (beneficiary: any) => void
  existingBeneficiaries: any[]
  remainingPercentage: number
}

const AddBeneficiaryForm = ({
  isOpen,
  onClose,
  onAdd,
  existingBeneficiaries,
  remainingPercentage,
}: AddBeneficiaryFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    email: "",
    phone: "",
    address: "",
    walletAddress: "",
    percentage: 0,
    type: "individual", // individual or organization
    priority: "medium", // high, medium, low
    notes: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isValidatingWallet, setIsValidatingWallet] = useState(false)
  const [walletValidation, setWalletValidation] = useState<{
    isValid: boolean
    message: string
  } | null>(null)
  const [step, setStep] = useState(1) // Multi-step form: 1=Basic Info, 2=Contact, 3=Allocation, 4=Review

  const relationshipOptions = [
    { value: "spouse", label: "Spouse/Partner", icon: Heart },
    { value: "child", label: "Child", icon: User },
    { value: "parent", label: "Parent", icon: User },
    { value: "sibling", label: "Sibling", icon: User },
    { value: "relative", label: "Other Relative", icon: Users },
    { value: "friend", label: "Friend", icon: User },
    { value: "charity", label: "Charity", icon: Building },
    { value: "organization", label: "Organization", icon: Building },
    { value: "other", label: "Other", icon: User },
  ]

  const priorityOptions = [
    { value: "high", label: "High Priority", color: "text-red-600", description: "Critical beneficiary" },
    { value: "medium", label: "Medium Priority", color: "text-yellow-600", description: "Important beneficiary" },
    { value: "low", label: "Low Priority", color: "text-green-600", description: "Secondary beneficiary" },
  ]

  const validateWalletAddress = async (address: string) => {
    if (!address) {
      setWalletValidation(null)
      return
    }

    setIsValidatingWallet(true)

    // Simulate wallet validation with Web3 feeling
    setTimeout(() => {
      const isValidFormat = /^0x[a-fA-F0-9]{40}$/.test(address)
      const isDuplicate = existingBeneficiaries.some((b) => b.walletAddress === address)

      if (!isValidFormat) {
        setWalletValidation({
          isValid: false,
          message: "Invalid wallet address format",
        })
      } else if (isDuplicate) {
        setWalletValidation({
          isValid: false,
          message: "This wallet address is already used by another beneficiary",
        })
      } else {
        setWalletValidation({
          isValid: true,
          message: "Valid wallet address",
        })
      }
      setIsValidatingWallet(false)
    }, 1500)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.relationship) newErrors.relationship = "Relationship is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format"
    if (!formData.walletAddress.trim()) newErrors.walletAddress = "Wallet address is required"
    else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.walletAddress))
      newErrors.walletAddress = "Invalid wallet address format"
    if (formData.percentage <= 0) newErrors.percentage = "Percentage must be greater than 0"
    if (formData.percentage > remainingPercentage)
      newErrors.percentage = `Cannot exceed remaining ${remainingPercentage}%`

    // Check for duplicate email
    if (existingBeneficiaries.some((b) => b.email === formData.email)) {
      newErrors.email = "This email is already used by another beneficiary"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const newBeneficiary = {
      id: Date.now().toString(),
      ...formData,
      status: "pending",
      dateAdded: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
      hasMessage: false,
      trustScore: Math.floor(Math.random() * 20) + 80, // Random score between 80-100
      estimatedValue: 0, // Will be calculated based on portfolio
    }

    onAdd(newBeneficiary)
    onClose()

    // Reset form
    setFormData({
      name: "",
      relationship: "",
      email: "",
      phone: "",
      address: "",
      walletAddress: "",
      percentage: 0,
      type: "individual",
      priority: "medium",
      notes: "",
    })
    setStep(1)
    setErrors({})
    setWalletValidation(null)
  }

  const generateRandomWallet = () => {
    const chars = "0123456789abcdef"
    let result = "0x"
    for (let i = 0; i < 40; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData({ ...formData, walletAddress: result })
    validateWalletAddress(result)
  }

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name.trim() || !formData.relationship) {
        setErrors({
          name: !formData.name.trim() ? "Name is required" : "",
          relationship: !formData.relationship ? "Relationship is required" : "",
        })
        return
      }
    }
    if (step < 4) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
          <div className="animate-fade-in-up">
            <h2 className="text-lg sm:text-xl font-semibold text-card-foreground">Add New Beneficiary</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Step {step} of 4 -{" "}
              {step === 1
                ? "Basic Information"
                : step === 2
                  ? "Contact Details"
                  : step === 3
                    ? "Allocation Settings"
                    : "Review & Confirm"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="transition-all duration-300 hover:scale-110 hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="px-4 sm:px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between sm:justify-center sm:space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-300 ${
                    i <= step
                      ? "bg-primary text-primary-foreground scale-110 web3-glow"
                      : "bg-muted text-muted-foreground hover:scale-105"
                  }`}
                >
                  {i <= step ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : i}
                </div>
                {i < 4 && (
                  <div
                    className={`w-8 sm:w-12 h-1 mx-1 sm:mx-2 rounded-full transition-all duration-500 ${
                      i < step ? "bg-primary animate-pulse-border" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in-up">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">Beneficiary Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: "individual" })}
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                        formData.type === "individual"
                          ? "border-primary bg-primary/10 web3-glow"
                          : "border-border hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      <User className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-primary animate-pulse" />
                      <div className="text-sm font-medium">Individual</div>
                      <div className="text-xs text-muted-foreground">Person</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: "organization" })}
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                        formData.type === "organization"
                          ? "border-primary bg-primary/10 web3-glow"
                          : "border-border hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      <Building className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-primary animate-pulse delay-200" />
                      <div className="text-sm font-medium">Organization</div>
                      <div className="text-xs text-muted-foreground">Company/Charity</div>
                    </button>
                  </div>
                </div>

                <div className="animate-fade-in-up delay-200">
                  <label className="block text-sm font-medium text-card-foreground mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:scale-105 ${
                      errors.name ? "border-red-500 animate-shake" : "border-border focus:border-primary"
                    } focus:ring-2 focus:ring-primary/20 focus:border-transparent bg-background`}
                    placeholder={formData.type === "individual" ? "John Doe" : "Red Cross Foundation"}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.name}</p>}
                </div>

                <div className="animate-fade-in-up delay-300">
                  <label className="block text-sm font-medium text-card-foreground mb-2">Relationship *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {relationshipOptions.map((option, index) => {
                      const Icon = option.icon
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, relationship: option.value })}
                          className={`p-3 rounded-lg border text-left transition-all duration-300 hover:scale-105 animate-fade-in-up ${
                            formData.relationship === option.value
                              ? "border-primary bg-primary/10 text-primary web3-glow"
                              : "border-border hover:border-primary/50 hover:bg-primary/5"
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4 animate-pulse" />
                            <span className="text-sm font-medium">{option.label}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  {errors.relationship && (
                    <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.relationship}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Contact Details */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in-up">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 animate-pulse" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 focus:scale-105 ${
                        errors.email ? "border-red-500 animate-shake" : "border-border focus:border-primary"
                      } focus:ring-2 focus:ring-primary/20 focus:border-transparent bg-background`}
                      placeholder="john.doe@email.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.email}</p>}
                </div>

                <div className="animate-fade-in-up delay-100">
                  <label className="block text-sm font-medium text-card-foreground mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 animate-pulse delay-200" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background transition-all duration-300 focus:scale-105"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="animate-fade-in-up delay-200">
                  <label className="block text-sm font-medium text-card-foreground mb-2">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-muted-foreground w-4 h-4 animate-pulse delay-300" />
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background resize-none transition-all duration-300 focus:scale-105"
                      placeholder="123 Main St, City, State, Country"
                    />
                  </div>
                </div>

                <div className="animate-fade-in-up delay-300">
                  <label className="block text-sm font-medium text-card-foreground mb-2">Wallet Address *</label>
                  <div className="space-y-2">
                    <div className="relative">
                      <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 animate-pulse" />
                      <input
                        type="text"
                        value={formData.walletAddress}
                        onChange={(e) => {
                          setFormData({ ...formData, walletAddress: e.target.value })
                          validateWalletAddress(e.target.value)
                        }}
                        className={`w-full pl-10 pr-20 py-3 rounded-xl border font-mono text-sm transition-all duration-300 focus:scale-105 ${
                          errors.walletAddress
                            ? "border-red-500 animate-shake"
                            : walletValidation?.isValid
                              ? "border-green-500 web3-glow"
                              : "border-border focus:border-primary"
                        } focus:ring-2 focus:ring-primary/20 focus:border-transparent bg-background`}
                        placeholder="0x742d35Cc9Bf8D5d7c7a7c8D9b1234567890abcde"
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={generateRandomWallet}
                          className="h-8 w-8 p-0 transition-all duration-300 hover:scale-110 hover:bg-primary/10"
                        >
                          <Zap className="w-4 h-4 text-primary animate-pulse" />
                        </Button>
                      </div>
                    </div>

                    {isValidatingWallet && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground animate-fade-in">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span>Validating wallet address...</span>
                      </div>
                    )}

                    {walletValidation && (
                      <div
                        className={`flex items-center space-x-2 text-sm animate-bounce-in ${
                          walletValidation.isValid ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {walletValidation.isValid ? (
                          <CheckCircle className="w-4 h-4 animate-pulse" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 animate-pulse" />
                        )}
                        <span>{walletValidation.message}</span>
                      </div>
                    )}

                    {errors.walletAddress && (
                      <p className="text-red-500 text-sm animate-fade-in">{errors.walletAddress}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Allocation Settings */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in-up">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Inheritance Percentage *
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData({ ...formData, percentage: Math.max(0, formData.percentage - 5) })}
                        disabled={formData.percentage <= 0}
                        className="transition-all duration-300 hover:scale-110 disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <div className="flex-1 relative">
                        <input
                          type="number"
                          min="0"
                          max={remainingPercentage}
                          step="0.1"
                          value={formData.percentage}
                          onChange={(e) =>
                            setFormData({ ...formData, percentage: Number.parseFloat(e.target.value) || 0 })
                          }
                          className={`w-full px-4 py-3 rounded-xl border text-center text-lg font-semibold transition-all duration-300 focus:scale-105 ${
                            errors.percentage ? "border-red-500 animate-shake" : "border-border focus:border-primary"
                          } focus:ring-2 focus:ring-primary/20 focus:border-transparent bg-background`}
                        />
                        <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 animate-pulse" />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            percentage: Math.min(remainingPercentage, formData.percentage + 5),
                          })
                        }
                        disabled={formData.percentage >= remainingPercentage}
                        className="transition-all duration-300 hover:scale-110 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="bg-muted rounded-lg p-3 animate-fade-in-up delay-100">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Available: {remainingPercentage}%</span>
                        <span>Selected: {formData.percentage}%</span>
                      </div>
                      <div className="w-full bg-background rounded-full h-2">
                        <div
                          className="crypto-gradient h-2 rounded-full transition-all duration-500 animate-gradient-shift"
                          style={{ width: `${Math.min((formData.percentage / remainingPercentage) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {errors.percentage && <p className="text-red-500 text-sm animate-fade-in">{errors.percentage}</p>}
                  </div>
                </div>

                <div className="animate-fade-in-up delay-200">
                  <label className="block text-sm font-medium text-card-foreground mb-2">Priority Level</label>
                  <div className="space-y-2">
                    {priorityOptions.map((option, index) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, priority: option.value })}
                        className={`w-full p-3 rounded-lg border text-left transition-all duration-300 hover:scale-105 animate-fade-in-up ${
                          formData.priority === option.value
                            ? "border-primary bg-primary/10 web3-glow"
                            : "border-border hover:border-primary/50 hover:bg-primary/5"
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`font-medium ${option.color}`}>{option.label}</div>
                            <div className="text-sm text-muted-foreground">{option.description}</div>
                          </div>
                          <Shield className={`w-5 h-5 ${option.color} animate-pulse`} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="animate-fade-in-up delay-300">
                  <label className="block text-sm font-medium text-card-foreground mb-2">Additional Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background resize-none transition-all duration-300 focus:scale-105"
                    placeholder="Any special instructions or notes about this beneficiary..."
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="bg-muted rounded-xl p-4 animate-scale-in">
                  <h3 className="font-semibold text-card-foreground mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 animate-pulse" />
                    Review Beneficiary Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {[
                      { label: "Name", value: formData.name },
                      { label: "Type", value: formData.type },
                      { label: "Relationship", value: formData.relationship },
                      { label: "Priority", value: formData.priority },
                      { label: "Email", value: formData.email },
                      { label: "Percentage", value: `${formData.percentage}%`, highlight: true },
                    ].map((item, index) => (
                      <div
                        key={item.label}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <span className="text-muted-foreground">{item.label}:</span>
                        <div className={`font-medium capitalize ${item.highlight ? "text-primary" : ""}`}>
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 animate-fade-in-up delay-300">
                    <span className="text-muted-foreground text-sm">Wallet Address:</span>
                    <div className="font-mono text-sm bg-background p-2 rounded mt-1 break-all border border-border">
                      {formData.walletAddress}
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 animate-bounce-in">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 animate-pulse" />
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">Ready to Add</p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        This beneficiary will be added with pending status and require verification.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-t border-border space-y-2 sm:space-y-0">
          <Button
            type="button"
            variant="outline"
            onClick={step === 1 ? onClose : prevStep}
            className="w-full sm:w-auto bg-transparent transition-all duration-300 hover:scale-105"
          >
            {step === 1 ? "Cancel" : "Previous"}
          </Button>

          <div className="flex space-x-2 w-full sm:w-auto">
            {step < 4 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 web3-glow"
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                onClick={handleSubmit}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 web3-glow"
              >
                Add Beneficiary
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddBeneficiaryForm

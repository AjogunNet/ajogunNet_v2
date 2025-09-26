"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useWallet } from "@/lib/wallet-context"
import { useApi } from "@/hooks/use-api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Send,
  Loader2,
  AlertTriangle,
} from "lucide-react"

interface TransferModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const TransferModal = ({ isOpen, onClose, onSuccess }: TransferModalProps) => {
  const { userId, password, isAuthenticated } = useAuth()
  const { address, balance, refreshBalance } = useWallet()
  const { transferTokens, transferState } = useApi()
  
  const [formData, setFormData] = useState({
    recipientAddress: "",
    amount: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.recipientAddress.trim()) {
      newErrors.recipientAddress = "Recipient address is required"
    } else if (!formData.recipientAddress.startsWith("0x")) {
      newErrors.recipientAddress = "Invalid address format"
    }

    if (!formData.amount.trim()) {
      newErrors.amount = "Amount is required"
    } else {
      const amount = parseFloat(formData.amount)
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = "Amount must be a positive number"
      } else if (amount > parseFloat(balance)) {
        newErrors.amount = "Insufficient balance"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated || !userId || !password) {
      setErrors({ general: "Please login first" })
      return
    }

    if (!validateForm()) return

    try {
      console.log('Transferring tokens:', {
        userId,
        recipientAddress: formData.recipientAddress,
        amount: formData.amount,
      })

      const result = await transferTokens({
        userId,
        password,
        recipientAddress: formData.recipientAddress,
        amount: formData.amount,
      })

      console.log('Transfer result:', result)

      if (result?.success) {
        // Refresh balance after successful transfer
        if (userId) {
          await refreshBalance(userId)
        }
        
        onSuccess?.()
        onClose()
        
        // Reset form
        setFormData({
          recipientAddress: "",
          amount: "",
        })
        setErrors({})
      } else {
        setErrors({ general: result?.message || "Transfer failed. Please try again." })
      }
    } catch (error) {
      console.error('Transfer error:', error)
      setErrors({ general: "Transfer failed. Please try again." })
    }
  }

  const resetForm = () => {
    setFormData({
      recipientAddress: "",
      amount: "",
    })
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Send className="w-5 h-5 text-primary" />
            <span>Send Tokens</span>
          </DialogTitle>
          <DialogDescription>
            Transfer tokens to another wallet address
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipientAddress">Recipient Address</Label>
            <Input
              id="recipientAddress"
              type="text"
              placeholder="0x..."
              value={formData.recipientAddress}
              onChange={(e) => handleInputChange("recipientAddress", e.target.value)}
            />
            {errors.recipientAddress && (
              <p className="text-sm text-red-600">{errors.recipientAddress}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                SUI
              </div>
            </div>
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Available balance: {balance} SUI
            </p>
          </div>

          {errors.general && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-800 dark:text-red-200">{errors.general}</p>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={transferState.loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={transferState.loading}
            >
              {transferState.loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Tokens
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default TransferModal
"use client"

import type React from "react"
import { useState } from "react"
import { X, AlertTriangle, Shield, FileText, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DisclaimerModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose, onAccept }) => {
  const [hasReadTerms, setHasReadTerms] = useState(false)
  const [hasReadPrivacy, setHasReadPrivacy] = useState(false)

  if (!isOpen) return null

  const canProceed = hasReadTerms && hasReadPrivacy

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-card-foreground">Important Legal Disclaimer</h2>
                <p className="text-sm text-muted-foreground">Please read carefully before proceeding</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Warning */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Beta Software Notice</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  WillChain is currently in beta. While we implement industry-standard security measures, please only
                  use test assets and small amounts during the beta period.
                </p>
              </div>
            </div>
          </div>

          {/* Key Points */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary" />
              Key Points to Understand
            </h3>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <strong>Legal Validity:</strong> Digital wills may have different legal recognition depending on your
                  jurisdiction. Consult with a qualified attorney for legal advice.
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <strong>Security Responsibility:</strong> You are responsible for securing your wallet private keys.
                  Lost keys cannot be recovered by WillChain.
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <strong>Smart Contract Risks:</strong> Blockchain transactions are irreversible. Please review all
                  details carefully before deployment.
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <strong>Beneficiary Verification:</strong> Ensure all beneficiary wallet addresses are correct.
                  Incorrect addresses may result in permanent loss of assets.
                </p>
              </div>
            </div>
          </div>

          {/* Terms and Privacy */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary" />
              Required Acknowledgments
            </h3>

            <div className="space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasReadTerms}
                  onChange={(e) => setHasReadTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">
                  I have read and agree to the{" "}
                  <a href="/terms" className="text-primary hover:underline" target="_blank" rel="noreferrer">
                    Terms of Service
                  </a>{" "}
                  and understand the risks associated with blockchain-based digital wills.
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasReadPrivacy}
                  onChange={(e) => setHasReadPrivacy(e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">
                  I have read and agree to the{" "}
                  <a href="/privacy" className="text-primary hover:underline" target="_blank" rel="noreferrer">
                    Privacy Policy
                  </a>{" "}
                  and consent to the processing of my data as described.
                </span>
              </label>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Need Legal Advice?</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              We recommend consulting with an estate planning attorney to ensure your digital will complements your
              traditional estate planning documents and complies with local laws.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onAccept} disabled={!canProceed} className="bg-primary hover:bg-primary/90">
              I Understand, Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DisclaimerModal

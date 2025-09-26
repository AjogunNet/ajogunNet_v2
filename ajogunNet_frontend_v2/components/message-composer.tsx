"use client"

import { useState } from "react"
import {
  Send,
  Sparkles,
  Edit3,
  Users,
  Heart,
  FileText,
  Wand2,
  RotateCcw,
  Save,
  Eye,
  User,
  MessageCircle,
} from "lucide-react"

const MessageComposer = () => {
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("")
  const [originalMessage, setOriginalMessage] = useState("")
  const [enhancedMessage, setEnhancedMessage] = useState("")
  const [messageType, setMessageType] = useState("personal")
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const beneficiaries = [
    { id: "1", name: "Sarah Johnson", relationship: "Daughter", email: "sarah@example.com" },
    { id: "2", name: "Michael Johnson", relationship: "Son", email: "michael@example.com" },
    { id: "3", name: "Red Cross Foundation", relationship: "Charity", email: "contact@redcross.org" },
  ]

  const enhancementOptions = [
    {
      id: "polish",
      label: "Polish",
      description: "Improve grammar and flow",
      icon: Sparkles,
      color: "bg-purple-100 text-purple-600 hover:bg-purple-200",
    },
    {
      id: "simplify",
      label: "Simplify",
      description: "Make more conversational",
      icon: MessageCircle,
      color: "bg-blue-100 text-blue-600 hover:bg-blue-200",
    },
    {
      id: "formal",
      label: "Make Formal",
      description: "Add professional tone",
      icon: FileText,
      color: "bg-gray-100 text-gray-600 hover:bg-gray-200",
    },
    {
      id: "heartfelt",
      label: "Add Warmth",
      description: "Make more emotional",
      icon: Heart,
      color: "bg-red-100 text-red-600 hover:bg-red-200",
    },
  ]

  const messageTemplates = {
    personal:
      "Dear [Name],\n\nI want you to know how much you mean to me. As you receive this inheritance, remember that my love for you goes far beyond any material possession...",
    financial:
      "Dear [Name],\n\nI'm leaving you these assets to help secure your future. Please use them wisely and remember the values we've shared...",
    guidance:
      "Dear [Name],\n\nAlong with this inheritance, I want to share some life guidance that I hope will serve you well...",
    gratitude:
      "Dear [Name],\n\nThank you for all the joy and love you've brought into my life. This inheritance is a small token of my appreciation...",
  }

  const handleEnhancement = async (type) => {
    if (!originalMessage.trim()) return

    setIsEnhancing(true)

    // Simulate AI enhancement
    setTimeout(() => {
      let enhanced = originalMessage

      switch (type) {
        case "polish":
          enhanced = `Dear ${selectedBeneficiary ? beneficiaries.find((b) => b.id === selectedBeneficiary)?.name : "[Beneficiary]"},\n\n${originalMessage.replace(/\n/g, "\n\n")}\n\nWith all my love and best wishes for your future.\n\nWarmest regards,\n[Your name]`
          break
        case "simplify":
          enhanced = `Hey ${selectedBeneficiary ? beneficiaries.find((b) => b.id === selectedBeneficiary)?.name : "[Beneficiary]"},\n\n${originalMessage}\n\nLove you always,\n[Your name]`
          break
        case "formal":
          enhanced = `To my esteemed ${selectedBeneficiary ? beneficiaries.find((b) => b.id === selectedBeneficiary)?.relationship.toLowerCase() : "beneficiary"},\n\n${originalMessage}\n\nI trust this inheritance will serve you well in your endeavors.\n\nSincerely,\n[Your name]`
          break
        case "heartfelt":
          enhanced = `My beloved ${selectedBeneficiary ? beneficiaries.find((b) => b.id === selectedBeneficiary)?.name : "[Beneficiary]"},\n\n${originalMessage}\n\nYou have been one of the greatest blessings in my life. Carry my love with you always.\n\nWith endless love,\n[Your name]`
          break
        default:
          enhanced = originalMessage
      }

      setEnhancedMessage(enhanced)
      setIsEnhancing(false)
    }, 1500)
  }

  const handleTemplateSelect = (template) => {
    setOriginalMessage(messageTemplates[template])
    setMessageType(template)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Beneficiary Message</h1>
          <p className="text-gray-600">Write a personal message that will be delivered with the inheritance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Composer */}
          <div className="lg:col-span-2 space-y-6">
            {/* Beneficiary Selection */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Select Beneficiary
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {beneficiaries.map((beneficiary) => (
                  <label key={beneficiary.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="beneficiary"
                      value={beneficiary.id}
                      checked={selectedBeneficiary === beneficiary.id}
                      onChange={(e) => setSelectedBeneficiary(e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`p-4 border-2 rounded-xl transition-all ${
                        selectedBeneficiary === beneficiary.id
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{beneficiary.name}</h3>
                          <p className="text-sm text-gray-600">{beneficiary.relationship}</p>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Message Templates */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Templates</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(messageTemplates).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => handleTemplateSelect(key)}
                    className={`p-3 text-center border-2 rounded-xl transition-all capitalize ${
                      messageType === key
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Your Message</h2>
                <div className="text-sm text-gray-500">{originalMessage.length}/2000 characters</div>
              </div>

              <textarea
                value={originalMessage}
                onChange={(e) => setOriginalMessage(e.target.value)}
                placeholder="Write your heartfelt message here... This will be delivered to your beneficiary along with their inheritance."
                className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                maxLength={2000}
              />

              {/* Enhancement Buttons */}
              <div className="flex flex-wrap gap-3 mt-4">
                {enhancementOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleEnhancement(option.id)}
                    disabled={!originalMessage.trim() || isEnhancing}
                    className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      !originalMessage.trim() || isEnhancing
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : option.color
                    }`}
                  >
                    {isEnhancing ? (
                      <div className="animate-spin w-4 h-4 mr-2">
                        <RotateCcw className="w-4 h-4" />
                      </div>
                    ) : (
                      <option.icon className="w-4 h-4 mr-2" />
                    )}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Message Display */}
            {enhancedMessage && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Wand2 className="w-5 h-5 mr-2 text-purple-600" />
                    AI Enhanced Message
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {showPreview ? "Edit" : "Preview"}
                    </button>
                    <button
                      onClick={() => setOriginalMessage(enhancedMessage)}
                      className="flex items-center px-3 py-1 text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Use This
                    </button>
                  </div>
                </div>

                {showPreview ? (
                  <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-indigo-500">
                    <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">{enhancedMessage}</div>
                  </div>
                ) : (
                  <textarea
                    value={enhancedMessage}
                    onChange={(e) => setEnhancedMessage(e.target.value)}
                    className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors">
                Save as Draft
              </button>
              <div className="flex space-x-3">
                <button className="flex items-center px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </button>
                <button
                  disabled={!selectedBeneficiary || !originalMessage.trim()}
                  className={`flex items-center px-6 py-2 rounded-xl font-medium transition-colors ${
                    !selectedBeneficiary || !originalMessage.trim()
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Attach to Will
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Writing Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Be authentic and speak from the heart</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Include specific memories or advice</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Consider your relationship with the beneficiary</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Keep it positive and forward-looking</p>
                </div>
              </div>
            </div>

            {/* AI Enhancement Info */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">AI Enhancement</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Our AI can help improve your message by:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Improving grammar and clarity</li>
                <li>• Adjusting tone and formality</li>
                <li>• Adding emotional warmth</li>
                <li>• Ensuring appropriate language</li>
              </ul>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-2">Privacy & Security</h3>
              <p className="text-sm text-gray-600">
                Your personal messages are encrypted and will only be accessible to the designated beneficiary when the
                will is executed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageComposer

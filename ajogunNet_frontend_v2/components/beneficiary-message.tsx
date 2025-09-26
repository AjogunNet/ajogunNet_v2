"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Home,
  FileText,
  Users,
  Wallet,
  MessageSquare,
  Bot,
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Send,
  User,
  Heart,
  Sparkles,
  Save,
  Plus,
} from "lucide-react"
import Link from "next/link"

const BeneficiaryMessage = () => {
  const { userId, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<string | null>(null)
  const [messageType, setMessageType] = useState("personal")
  const [message, setMessage] = useState("")

  const sidebarLinks = [
    { name: "Dashboard", icon: Home, href: "/dashboard" },
    { name: "Create Will", icon: FileText, href: "/create" },
    { name: "Beneficiaries", icon: Users, href: "/beneficiaries" },
    { name: "Wallet", icon: Wallet, href: "/wallet" },
    { name: "Messages", icon: MessageSquare, href: "/messages", active: true },
    { name: "AI Assistant", icon: Bot, href: "/ai-assistant" },
  ]

  const beneficiaries = [
    {
      id: "1",
      name: "Sarah Johnson",
      relationship: "Daughter",
      avatar: "SJ",
      status: "verified"
    },
    {
      id: "2", 
      name: "Michael Johnson",
      relationship: "Son",
      avatar: "MJ",
      status: "verified"
    },
    {
      id: "3",
      name: "Red Cross Foundation",
      relationship: "Charity",
      avatar: "RC",
      status: "pending"
    }
  ]

  const messageTemplates = [
    {
      type: "personal",
      title: "Personal",
      content: "My dear {name}, I want you to know how much you mean to me. This inheritance is my way of ensuring your future is secure and bright."
    },
    {
      type: "financial",
      title: "Financial",
      content: "Dear {name}, please use these assets wisely. I trust your judgment and hope this helps you achieve your dreams."
    },
    {
      type: "guidance",
      title: "Guidance", 
      content: "To {name}, remember the values we shared and the lessons we learned together. Let this be a foundation for your continued growth."
    },
    {
      type: "gratitude",
      title: "Gratitude",
      content: "Thank you, {name}, for all the joy and love you brought into my life. This is my final gift to show my appreciation."
    }
  ]

  const writingTips = [
    "Be authentic and speak from the heart",
    "Include specific memories or advice", 
    "Consider your relationship with the beneficiary",
    "Keep it positive and forward-looking"
  ]

  const handleTemplateSelect = (template: any) => {
    setMessage(template.content)
    setMessageType(template.type)
  }

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
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <link.icon className={`w-5 h-5 mr-3 ${link.active ? "text-white" : ""}`} />
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
                <h1 className="text-xl font-semibold text-foreground">Create Beneficiary Message</h1>
                <p className="text-sm text-muted-foreground">Write a personal message that will be delivered with the inheritance</p>
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
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
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
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Select Beneficiary */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Select Beneficiary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {beneficiaries.map((beneficiary) => (
                    <button
                      key={beneficiary.id}
                      onClick={() => setSelectedBeneficiary(beneficiary.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        selectedBeneficiary === beneficiary.id
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                          : "border-border hover:border-blue-300 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">{beneficiary.avatar}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{beneficiary.name}</p>
                          <p className="text-sm text-muted-foreground">{beneficiary.relationship}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Writing Tips */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Writing Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {writingTips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Message Composition */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Message</CardTitle>
                  <div className="text-sm text-muted-foreground">0/2000 characters</div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Quick Templates */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">Quick Templates</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {messageTemplates.map((template) => (
                        <button
                          key={template.type}
                          onClick={() => handleTemplateSelect(template)}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            messageType === template.type
                              ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                              : "border-border hover:border-blue-300 hover:bg-muted/50"
                          }`}
                        >
                          <span className="text-sm font-medium">{template.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message Input */}
                  <div>
                    <Label htmlFor="message" className="text-base font-medium">Your Message</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your personal message here..."
                      className="min-h-[200px] mt-2 resize-none"
                      maxLength={2000}
                    />
                  </div>

                  {/* Message Options */}
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-border" />
                      <span className="text-sm">Polish</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-border" />
                      <span className="text-sm">Simplify</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-border" />
                      <span className="text-sm">Make Formal</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-border" />
                      <span className="text-sm">Add Warmth</span>
                    </label>
                  </div>

                  {/* AI Enhancement */}
                  <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">AI Enhancement</h3>
                          <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
                            Our AI can help improve your message by:
                          </p>
                          <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                            <li>• Improving grammar and clarity</li>
                            <li>• Adjusting tone and formality</li>
                            <li>• Adding emotional warmth</li>
                            <li>• Ensuring appropriate language</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Privacy & Security */}
                  <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Privacy & Security</h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Your personal messages are encrypted and will only be accessible to the designated beneficiary when the will is executed.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-4">
                    <Button variant="outline">
                      Save as Draft
                    </Button>
                    <div className="flex space-x-3">
                      <Button variant="outline">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Attach to Will
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default BeneficiaryMessage
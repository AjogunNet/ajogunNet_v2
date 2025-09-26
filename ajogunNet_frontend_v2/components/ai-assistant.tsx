"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
  Sparkles,
  Lightbulb,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Brain,
  Target,
  BookOpen,
} from "lucide-react"
import Link from "next/link"

const AIAssistant = () => {
  const { userId, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const [chatMessage, setChatMessage] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState("")

  const sidebarLinks = [
    { name: "Dashboard", icon: Home, href: "/dashboard" },
    { name: "Create Will", icon: FileText, href: "/create" },
    { name: "Beneficiaries", icon: Users, href: "/beneficiaries" },
    { name: "Wallet", icon: Wallet, href: "/wallet" },
    { name: "Messages", icon: MessageSquare, href: "/messages" },
    { name: "AI Assistant", icon: Bot, href: "/ai-assistant", active: true },
  ]

  const aiFeatures = [
    {
      id: "will-drafting",
      title: "Will Drafting",
      description: "Natural language will creation",
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      features: ["Smart asset allocation", "Legal compliance check", "Beneficiary suggestions"]
    },
    {
      id: "risk-analysis", 
      title: "Risk Analysis",
      description: "Smart Risk Detection",
      icon: Shield,
      color: "from-red-500 to-red-600",
      features: ["Portfolio risk assessment", "Diversification analysis", "Security recommendations"]
    },
    {
      id: "message-enhancement",
      title: "Message Enhancement",
      description: "Polish beneficiary messages",
      icon: Sparkles,
      color: "from-purple-500 to-purple-600",
      features: ["Tone adjustment", "Grammar correction", "Emotional enhancement"]
    },
    {
      id: "executor-guidance",
      title: "Executor Guidance",
      description: "Guide Executors through claims",
      icon: Target,
      color: "from-green-500 to-green-600",
      features: ["Step-by-step guidance", "Document preparation", "Legal requirements"]
    }
  ]

  const aiInsights = [
    {
      type: "warning",
      title: "Distribution Imbalance Detected",
      description: "Your current allocation gives 70% to one beneficiary. Consider more balanced distribution.",
      action: "Review Distribution",
      icon: AlertTriangle,
      color: "text-yellow-600"
    },
    {
      type: "suggestion",
      title: "Add Backup Executor",
      description: "Adding a backup executor ensures your will can be executed even if the primary executor is unavailable.",
      action: "Add Backup Executor", 
      icon: Lightbulb,
      color: "text-blue-600"
    },
    {
      type: "optimization",
      title: "Enable SUI Staking",
      description: "Your SUI tokens could earn 4.2% APY through staking while remaining in your will.",
      action: "Enable Staking",
      icon: TrendingUp,
      color: "text-green-600"
    }
  ]

  const quickActions = [
    { title: "Draft a simple will", icon: FileText, action: () => openModal("draft-will") },
    { title: "Check my asset distribution", icon: TrendingUp, action: () => openModal("check-distribution") },
    { title: "Write a beneficiary message", icon: MessageSquare, action: () => openModal("write-message") },
    { title: "Enable SUI Staking", icon: Zap, action: () => openModal("enable-staking") }
  ]

  const chatHistory = [
    {
      type: "assistant",
      message: "Hello! I'm your AI Will Assistant. I can help you create a comprehensive digital will, analyze your asset distribution for potential risks, and guide you through the entire process. What would you like to start with?",
      time: "10:22 AM"
    },
    {
      type: "user", 
      message: "Help me create a new will",
      time: "10:23 AM"
    },
    {
      type: "assistant",
      message: "I'd be happy to help you create a new will! Let me guide you through this step by step. First, let's understand your current situation:\n\n1. What assets would you like to include?\n2. Who are your intended beneficiaries?\n3. Do you have any specific wishes or conditions?\n\nShall we start with reviewing your current assets?",
      time: "10:23 AM"
    }
  ]

  const openModal = (type: string) => {
    setModalType(type)
    setIsModalOpen(true)
  }

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Handle sending message
      setChatMessage("")
    }
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

        {/* Help Card */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-4 text-white">
            <h3 className="font-semibold text-sm">Need Help?</h3>
            <p className="text-xs opacity-90 mt-1">Our AI assistant can guide you through creating your digital will</p>
            <Button className="mt-2 bg-white/20 hover:bg-white/30 text-white border-0 text-xs font-medium h-8">
              Ask AI
            </Button>
          </div>
        </div>
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
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">AI Will Assistant</h1>
                  <p className="text-sm text-muted-foreground">Online • Ready to help with your digital will</p>
                </div>
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
            {/* AI Features */}
            <div className="lg:col-span-2 space-y-6">
              {/* AI Features Grid */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">AI Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiFeatures.map((feature) => (
                    <Card key={feature.id} className="hover:shadow-md transition-all duration-200 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                        <ul className="space-y-1">
                          {feature.features.map((item, index) => (
                            <li key={index} className="flex items-center text-xs text-muted-foreground">
                              <div className="w-1 h-1 bg-blue-600 rounded-full mr-2"></div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* AI Insights */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">AI Insights</h2>
                <div className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className={`w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0`}>
                            <insight.icon className={`w-5 h-5 ${insight.color}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground mb-1">{insight.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                            <Button size="sm" variant="outline" className="text-xs">
                              {insight.action}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="flex items-center p-4 bg-muted/50 hover:bg-muted rounded-xl transition-all duration-200 hover:scale-105"
                    >
                      <action.icon className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-sm font-medium text-foreground">{action.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-1">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b border-border">
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-600" />
                    AI Chat
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatHistory.map((chat, index) => (
                      <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-xl ${
                          chat.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-muted text-foreground'
                        }`}>
                          <p className="text-sm whitespace-pre-line">{chat.message}</p>
                          <p className={`text-xs mt-1 ${
                            chat.type === 'user' ? 'text-blue-100' : 'text-muted-foreground'
                          }`}>
                            {chat.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="border-t border-border p-4">
                    <div className="flex space-x-2">
                      <Input
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Ask me anything about creating your digital will..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Modal for AI Actions */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md animate-scale-in">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
              AI Assistant
            </DialogTitle>
            <DialogDescription>
              {modalType === "draft-will" && "Let me help you draft a simple will"}
              {modalType === "check-distribution" && "Analyzing your asset distribution"}
              {modalType === "write-message" && "Creating a personalized beneficiary message"}
              {modalType === "enable-staking" && "Setting up SUI staking for your assets"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {modalType === "draft-will" && (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-sm text-muted-foreground">Analyzing your assets and preparing a draft...</p>
                </div>
              </div>
            )}
            
            {modalType === "check-distribution" && (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Distribution Analysis Complete</h3>
                  <p className="text-sm text-muted-foreground">Your current allocation looks balanced across beneficiaries.</p>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AIAssistant
"use client"

import { useState, useRef, useEffect } from "react"
import {
  Send,
  Bot,
  User,
  Sparkles,
  FileText,
  Shield,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  Zap,
  ChevronDown,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Minimize2,
  Brain,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react"

const AIAssistantChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Hello! I'm your AI Will Assistant. I can help you create a comprehensive digital will, analyze your asset distribution for potential risks, and guide you through the entire process. What would you like to start with?",
      timestamp: new Date(),
      suggestions: [
        "Help me create a new will",
        "Analyze my current will for risks",
        "Explain blockchain inheritance",
        "Add a beneficiary message",
      ],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeFeature, setActiveFeature] = useState(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const aiFeatures = [
    {
      id: "will-drafting",
      title: "Will Drafting",
      description: "Natural language will creation",
      icon: FileText,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      examples: ["Draft a simple will", "Create will for crypto assets", "Add specific conditions"],
    },
    {
      id: "risk-analysis",
      title: "Risk Analysis",
      description: "Smart fraud detection",
      icon: Shield,
      color: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
      examples: ["Check distribution fairness", "Validate wallet addresses", "Detect suspicious patterns"],
    },
    {
      id: "message-enhancement",
      title: "Message Enhancement",
      description: "Polish beneficiary messages",
      icon: Sparkles,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
      examples: ["Make message more formal", "Add emotional warmth", "Simplify language"],
    },
    {
      id: "executor-guidance",
      title: "Executor Guidance",
      description: "Guide beneficiaries through claims",
      icon: Lightbulb,
      color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
      examples: ["Explain claim process", "Wallet setup guide", "Asset transfer help"],
    },
  ]

  const quickActions = [
    { text: "Draft a simple will", icon: FileText, category: "will-drafting" },
    { text: "Check my asset distribution", icon: Shield, category: "risk-analysis" },
    { text: "Write a message to my daughter", icon: MessageSquare, category: "message-enhancement" },
    { text: "Explain dead man's switch", icon: AlertTriangle, category: "executor-guidance" },
    { text: "Analyze beneficiary setup", icon: Users, category: "risk-analysis" },
    { text: "Help with wallet security", icon: Wallet, category: "executor-guidance" },
  ]

  const aiInsights = [
    {
      type: "warning",
      title: "Distribution Imbalance Detected",
      description: "Your current allocation gives 70% to one beneficiary. Consider more balanced distribution.",
      action: "Review Distribution",
      icon: AlertTriangle,
      color: "text-yellow-600",
    },
    {
      type: "suggestion",
      title: "Add Backup Executor",
      description: "Consider adding a backup executor in case your primary executor is unavailable.",
      action: "Add Backup",
      icon: Users,
      color: "text-blue-600",
    },
    {
      type: "security",
      title: "Enable Multi-Sig",
      description: "Multi-signature security can prevent unauthorized will execution.",
      action: "Enable Security",
      icon: Shield,
      color: "text-green-600",
    },
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
      suggestions: [],
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue)
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string) => {
    const responses = {
      will: {
        content: `I'd be happy to help you create a digital will! Let me guide you through this step by step.

**Will Creation Process:**

1. **Asset Inventory**: What digital assets do you want to include?
   - Cryptocurrencies (BTC, ETH, SUI, etc.)
   - NFTs and digital collectibles
   - DeFi positions and staked assets
   - Digital accounts and subscriptions

2. **Beneficiary Selection**: Who should receive your assets?
   - Family members with verified wallet addresses
   - Charitable organizations
   - Friends or business partners

3. **Distribution Strategy**: How should assets be divided?
   - Percentage-based allocation
   - Specific asset assignments
   - Conditional distributions

4. **Execution Conditions**: When should the will activate?
   - Dead man's switch (recommended: 365 days)
   - Multi-signature requirements
   - External verification methods

Would you like me to start with a template based on your current wallet contents, or do you have specific requirements?`,
        suggestions: [
          "Start with my current wallet",
          "I have specific crypto assets",
          "Help me choose beneficiaries",
          "Explain execution conditions",
        ],
      },
      risk: {
        content: `Excellent choice! I'll perform a comprehensive risk analysis of your will setup.

**AI Risk Assessment Areas:**

🔍 **Distribution Analysis**
- Checking allocation percentages for fairness
- Identifying potential family disputes
- Validating beneficiary relationships

⚠️ **Security Verification**
- Wallet address validation and checksums
- Multi-signature setup recommendations
- Dead man's switch configuration

🛡️ **Fraud Detection**
- Unusual beneficiary patterns
- Recently added addresses (potential coercion)
- Execution timing anomalies

⏰ **Legal Compliance**
- Jurisdiction-specific requirements
- Tax implications for beneficiaries
- Estate planning integration

**Current Analysis Results:**
- ✅ Wallet addresses validated
- ⚠️ Distribution imbalance detected (70% to one beneficiary)
- ✅ Dead man's switch properly configured
- ❌ No backup executor specified

Would you like me to provide detailed recommendations for the identified issues?`,
        suggestions: [
          "Fix distribution imbalance",
          "Add backup executor",
          "Explain fraud detection",
          "Review security settings",
        ],
      },
      message: {
        content: `I'll help you craft a meaningful message for your daughter. Personal messages provide comfort and guidance to loved ones during difficult times.

**Message Enhancement Options:**

✨ **Polish & Refine**
- Improve grammar and sentence flow
- Enhance clarity and readability
- Add professional structure

📝 **Tone Adjustment**
- Make more conversational and warm
- Add formal legal language
- Balance emotional and practical content

💝 **Personalization**
- Include specific memories
- Add life advice and wisdom
- Reference shared experiences

🎯 **Purpose-Driven**
- Financial guidance and responsibility
- Family values and traditions
- Future aspirations and hopes

**Sample Enhanced Message:**
"My dearest daughter, as you receive this inheritance, know that it represents more than financial assets—it's a foundation for your dreams and a testament to my unwavering love for you..."

What kind of message would you like to create? You can share your initial thoughts, and I'll help enhance and refine them.`,
        suggestions: [
          "Write a loving personal message",
          "Create financial guidance",
          "Add life advice and wisdom",
          "Include family memories",
        ],
      },
      default: {
        content: `I understand you're looking for help with your digital will. As your AI assistant, I can provide comprehensive support across multiple areas:

**Core Capabilities:**

📋 **Will Creation & Management**
- Draft wills from natural language descriptions
- Template-based will generation
- Asset allocation optimization
- Legal compliance checking

🔍 **Risk Analysis & Security**
- Fraud pattern detection
- Beneficiary verification
- Distribution fairness analysis
- Security recommendation engine

✍️ **Message & Communication**
- Beneficiary message enhancement
- Legal document drafting
- Multi-language support
- Tone and style adjustment

🎓 **Education & Guidance**
- Blockchain inheritance explanation
- Estate planning best practices
- Tax implication analysis
- Executor guidance and training

**Smart Insights:**
I've analyzed your current setup and identified 3 areas for improvement. Would you like me to walk through these recommendations?

What specific area would you like to focus on today?`,
        suggestions: [
          "Create a new will",
          "Review my current setup",
          "Learn about blockchain inheritance",
          "Get personalized recommendations",
        ],
      },
    }

    let responseKey = "default"
    const input = userInput.toLowerCase()

    if (input.includes("will") || input.includes("create") || input.includes("draft")) {
      responseKey = "will"
    } else if (input.includes("risk") || input.includes("analyze") || input.includes("check")) {
      responseKey = "risk"
    } else if (input.includes("message") || input.includes("write") || input.includes("daughter")) {
      responseKey = "message"
    }

    const response = responses[responseKey]

    return {
      id: Date.now(),
      type: "ai",
      content: response.content,
      timestamp: new Date(),
      suggestions: response.suggestions,
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const MessageBubble = ({ message }) => {
    const isAI = message.type === "ai"

    return (
      <div className={`flex ${isAI ? "justify-start" : "justify-end"} mb-4`}>
        <div className={`flex max-w-[85%] ${isAI ? "flex-row" : "flex-row-reverse"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              isAI ? "bg-primary mr-3" : "bg-muted-foreground ml-3"
            }`}
          >
            {isAI ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
          </div>

          <div
            className={`rounded-2xl px-4 py-3 ${
              isAI ? "bg-muted text-card-foreground" : "bg-primary text-primary-foreground"
            }`}
          >
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>

            {isAI && message.suggestions && (
              <div className="mt-3 flex flex-wrap gap-2">
                {message.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs px-3 py-1 bg-card border border-border rounded-full hover:bg-muted hover:border-primary transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-2">
              <span className="text-xs opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>

              {isAI && (
                <div className="flex items-center space-x-1 ml-4">
                  <button className="p-1 opacity-70 hover:opacity-100 hover:bg-card rounded transition-all">
                    <Copy className="w-3 h-3" />
                  </button>
                  <button className="p-1 opacity-70 hover:opacity-100 hover:bg-card rounded transition-all">
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button className="p-1 opacity-70 hover:opacity-100 hover:bg-card rounded transition-all">
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                  <button className="p-1 opacity-70 hover:opacity-100 hover:bg-card rounded transition-all">
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const TypingIndicator = () => (
    <div className="flex justify-start mb-4">
      <div className="flex flex-row">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mr-3">
          <Bot className="w-4 h-4 text-white" />
        </div>

        <div className="bg-muted rounded-2xl px-4 py-3">
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <span className="text-xs text-muted-foreground ml-2">AI is analyzing...</span>
          </div>
        </div>
      </div>
    </div>
  )

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-primary hover:bg-primary/90 text-white p-4 rounded-full shadow-lg transition-colors flex items-center space-x-2"
        >
          <Bot className="w-5 h-5" />
          <span className="text-sm font-medium">AI Assistant</span>
          {messages.filter((m) => m.type === "ai").length > 1 && (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              1
            </span>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-4 lg:gap-6 p-6">
      {/* AI Features Sidebar */}
      <div className="hidden lg:block space-y-6">
        {/* AI Features */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">AI Features</h2>
              <p className="text-sm text-muted-foreground">Powered by advanced AI</p>
            </div>
          </div>

          <div className="space-y-3">
            {aiFeatures.map((feature, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl hover:bg-muted transition-colors cursor-pointer ${
                  activeFeature === feature.id ? "bg-muted border border-primary" : "bg-muted/50"
                }`}
                onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${feature.color}`}>
                    <feature.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-card-foreground text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${
                      activeFeature === feature.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {activeFeature === feature.id && (
                  <div className="mt-3 space-y-1">
                    {feature.examples.map((example, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSuggestionClick(example)
                        }}
                        className="block w-full text-left text-xs text-muted-foreground hover:text-card-foreground p-2 rounded hover:bg-card transition-colors"
                      >
                        • {example}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="font-semibold text-card-foreground mb-4 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-primary" />
            AI Insights
          </h3>
          <div className="space-y-3">
            {aiInsights.map((insight, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <insight.icon className={`w-4 h-4 mt-0.5 ${insight.color}`} />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-card-foreground">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                    <button className="text-xs text-primary hover:text-primary/80 mt-2 font-medium">
                      {insight.action}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="font-semibold text-card-foreground mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(action.text)}
                className="w-full flex items-center p-3 text-left hover:bg-muted rounded-lg transition-colors"
              >
                <action.icon className="w-4 h-4 text-muted-foreground mr-3" />
                <span className="text-sm text-card-foreground">{action.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="lg:col-span-3">
        <div className="bg-card rounded-xl border border-border h-[calc(100vh-3rem)] flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-card-foreground">AI Will Assistant</h2>
                <p className="text-sm text-muted-foreground">
                  {isTyping ? (
                    <span className="flex items-center">
                      <span className="animate-pulse">Analyzing your request...</span>
                      <Zap className="w-3 h-3 ml-1 text-yellow-500" />
                    </span>
                  ) : (
                    "Online • Ready to help with your digital will"
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-lg transition-colors">
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-lg transition-colors lg:hidden"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about creating your digital will, analyzing risks, or enhancing messages..."
                  className="w-full px-4 py-3 border border-border rounded-xl resize-none focus:ring-2 focus:ring-primary focus:border-transparent max-h-32 bg-background"
                  rows={1}
                  disabled={isTyping}
                />
              </div>

              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className={`p-3 rounded-xl transition-colors ${
                  !inputValue.trim() || isTyping
                    ? "bg-muted cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 text-white"
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>Press Enter to send • Shift+Enter for new line</span>
              <span>{inputValue.length}/2000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIAssistantChat

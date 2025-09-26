"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Plus,
  Edit,
  Trash2,
  User,
  Building,
  Heart,
  Baby,
  UserCheck,
  UserX,
  MapPin,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

interface Beneficiary {
  id: string
  name: string
  type: 'individual' | 'organization'
  relationship: string
  email: string
  phone?: string
  address?: string
  walletAddress: string
  percentage: number
  status: 'verified' | 'pending' | 'unverified'
  trustScore: number
}

const BeneficiaryManagement = () => {
  const { userId, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [beneficiaryType, setBeneficiaryType] = useState<'individual' | 'organization'>('individual')
  const [selectedRelationship, setSelectedRelationship] = useState("")
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      type: "individual",
      relationship: "Daughter",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      address: "New York, NY",
      walletAddress: "0x742d35Cc9Bf8D5d7c7a7c8D9b1234567890abcde",
      percentage: 40,
      status: "verified",
      trustScore: 95
    },
    {
      id: "2",
      name: "Michael Johnson", 
      type: "individual",
      relationship: "Son",
      email: "michael.johnson@email.com",
      phone: "+1 (555) 987-6543",
      address: "Los Angeles, CA",
      walletAddress: "0x8f3a4b7c6d9e2f1a5b8c7d4e9f2a6b3c8d5e7f1a",
      percentage: 35,
      status: "verified",
      trustScore: 92
    },
    {
      id: "3",
      name: "Red Cross Foundation",
      type: "organization",
      relationship: "Charity",
      email: "donations@redcross.org",
      address: "Washington, DC",
      walletAddress: "0xa1b2c3d4e5f6789012345678901234567890abcd",
      percentage: 25,
      status: "pending",
      trustScore: 88
    }
  ])

  const [newBeneficiary, setNewBeneficiary] = useState({
    name: "",
    type: "individual" as 'individual' | 'organization',
    relationship: "",
    email: "",
    phone: "",
    address: "",
    walletAddress: "",
    percentage: 0
  })

  const sidebarLinks = [
    { name: "Dashboard", icon: Home, href: "/dashboard" },
    { name: "Create Will", icon: FileText, href: "/create" },
    { name: "Beneficiaries", icon: Users, href: "/beneficiaries", active: true },
    { name: "Wallet", icon: Wallet, href: "/wallet" },
    { name: "Messages", icon: MessageSquare, href: "/messages" },
    { name: "AI Assistant", icon: Bot, href: "/ai-assistant" },
  ]

  const relationshipOptions = {
    individual: [
      { value: "spouse", label: "Spouse/Partner", icon: Heart },
      { value: "child", label: "Child", icon: Baby },
      { value: "parent", label: "Parent", icon: User },
      { value: "sibling", label: "Sibling", icon: Users },
      { value: "relative", label: "Other Relative", icon: UserCheck },
      { value: "friend", label: "Friend", icon: UserX }
    ],
    organization: [
      { value: "charity", label: "Charity", icon: Heart },
      { value: "organization", label: "Organization", icon: Building }
    ]
  }

  const totalAllocation = beneficiaries.reduce((sum, b) => sum + b.percentage, 0)
  const verifiedCount = beneficiaries.filter(b => b.status === 'verified').length

  const handleAddBeneficiary = () => {
    setIsAddModalOpen(true)
    setCurrentStep(1)
    setNewBeneficiary({
      name: "",
      type: "individual",
      relationship: "",
      email: "",
      phone: "",
      address: "",
      walletAddress: "",
      percentage: 0
    })
  }

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'unverified':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
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
                <h1 className="text-xl font-semibold text-foreground">Beneficiary Management</h1>
                <p className="text-sm text-muted-foreground">Manage who will inherit your digital assets</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button onClick={handleAddBeneficiary} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Beneficiary
              </Button>

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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{totalAllocation}%</p>
                    <p className="text-sm text-muted-foreground">Total Allocation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">$125,000.00</p>
                    <p className="text-sm text-muted-foreground">Estimated Value</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{beneficiaries.length}</p>
                    <p className="text-sm text-muted-foreground">Beneficiaries</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{verifiedCount}</p>
                    <p className="text-sm text-muted-foreground">Verified</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Beneficiaries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beneficiaries.map((beneficiary) => (
              <Card key={beneficiary.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
                        {beneficiary.type === 'individual' ? (
                          <User className="w-6 h-6 text-white" />
                        ) : (
                          <Building className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{beneficiary.name}</h3>
                        <p className="text-sm text-muted-foreground">{beneficiary.relationship}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(beneficiary.status)}`}>
                        {beneficiary.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Inheritance Share</span>
                      <span className="font-semibold text-blue-600">{beneficiary.percentage}%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Trust Score</span>
                      <span className={`font-semibold ${getTrustScoreColor(beneficiary.trustScore)}`}>
                        {beneficiary.trustScore}
                      </span>
                    </div>

                    {beneficiary.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground truncate">{beneficiary.email}</span>
                      </div>
                    )}

                    {beneficiary.address && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{beneficiary.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>

      {/* Add Beneficiary Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-2xl animate-scale-in">
          <DialogHeader>
            <DialogTitle>Add New Beneficiary</DialogTitle>
            <DialogDescription>Step {currentStep} of 4 - Basic Information</DialogDescription>
          </DialogHeader>

          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step ? <CheckCircle className="w-4 h-4" /> : step}
                </div>
                {step < 4 && <div className={`w-8 h-0.5 ${currentStep > step ? "bg-blue-600" : "bg-muted"}`} />}
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium mb-3 block">Beneficiary Type</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setBeneficiaryType('individual')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        beneficiaryType === 'individual'
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                          : "border-border hover:border-blue-300"
                      }`}
                    >
                      <User className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <div className="font-medium">Individual</div>
                      <div className="text-sm text-muted-foreground">Person</div>
                    </button>
                    <button
                      onClick={() => setBeneficiaryType('organization')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        beneficiaryType === 'organization'
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                          : "border-border hover:border-blue-300"
                      }`}
                    >
                      <Building className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <div className="font-medium">Organization</div>
                      <div className="text-sm text-muted-foreground">Company/Charity</div>
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={newBeneficiary.name}
                    onChange={(e) => setNewBeneficiary({...newBeneficiary, name: e.target.value})}
                    placeholder="John Doe"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">Relationship *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {relationshipOptions[beneficiaryType].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedRelationship(option.value)}
                        className={`flex items-center p-3 rounded-xl border-2 transition-all ${
                          selectedRelationship === option.value
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                            : "border-border hover:border-blue-300"
                        }`}
                      >
                        <option.icon className="w-5 h-5 mr-3 text-blue-600" />
                        <span className="font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <div className="flex space-x-3">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={handlePreviousStep}>
                    Previous
                  </Button>
                )}
                <Button onClick={handleNextStep} className="bg-blue-600 hover:bg-blue-700">
                  {currentStep === 4 ? "Add Beneficiary" : "Next Step"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BeneficiaryManagement
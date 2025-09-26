"use client"

import { useState } from "react"
import {
  Menu,
  X,
  Home,
  FileText,
  Users,
  Wallet,
  Bot,
  Bell,
  Search,
  Settings,
  ChevronDown,
  LogOut,
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
} from "lucide-react"

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const sidebarLinks = [
    { name: "Dashboard", icon: Home, href: "/dashboard", active: true },
    { name: "My Will", icon: FileText, href: "/will/my-will" },
    { name: "Beneficiaries", icon: Users, href: "/beneficiaries" },
    { name: "Wallet", icon: Wallet, href: "/wallet" },
    { name: "AI Assistant", icon: Bot, href: "/ai-assistant" },
  ]

  const statsData = [
    { title: "Total Assets", value: "$124,580", icon: DollarSign, change: "+12%", trend: "up" },
    { title: "Will Status", value: "Active", icon: Shield, change: "Secured", trend: "neutral" },
    { title: "Beneficiaries", value: "3", icon: Users, change: "+1 this month", trend: "up" },
    { title: "Last Updated", value: "2 days ago", icon: Clock, change: "Recent", trend: "neutral" },
  ]

  const recentActivities = [
    { type: "will_update", message: "Will document updated", time: "2 hours ago", status: "success" },
    { type: "beneficiary_add", message: "New beneficiary added: Sarah Johnson", time: "1 day ago", status: "info" },
    { type: "wallet_connect", message: "Wallet connected successfully", time: "3 days ago", status: "success" },
    { type: "asset_change", message: "Portfolio balance increased", time: "1 week ago", status: "success" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">WillChain</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-md hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-2">
          {sidebarLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                link.active
                  ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <link.icon className={`w-5 h-5 mr-3 ${link.active ? "text-indigo-500" : "text-gray-400"}`} />
              {link.name}
            </a>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
            <h3 className="font-semibold text-sm">Need Help?</h3>
            <p className="text-xs opacity-90 mt-1">Our AI assistant can guide you through creating your digital will</p>
            <button className="mt-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-lg text-xs font-medium transition-colors">
              Ask AI
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-gray-100">
                <Menu className="w-5 h-5" />
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search assets, beneficiaries..."
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">JD</span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">John Doe</p>
                    <p className="text-xs text-gray-500">john@example.com</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                    <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Settings className="inline w-4 h-4 mr-2" />
                      Settings
                    </a>
                    <a href="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <LogOut className="inline w-4 h-4 mr-2" />
                      Sign out
                    </a>
                  </div>
                )}
              </div>

              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                Connect Wallet
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="p-6 space-y-6">
          {/* Welcome section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Welcome back, John!</h1>
            <p className="text-indigo-100 mb-4">Your digital estate is secured and up to date</p>
            <div className="flex space-x-3">
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Update Will
              </button>
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                View Assets
              </button>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  {stat.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500 mr-1" />}
                  <span className={`text-sm ${stat.trend === "up" ? "text-green-600" : "text-gray-500"}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">View All</button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === "success"
                          ? "bg-green-500"
                          : activity.status === "info"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-indigo-600 mr-3" />
                    <span className="font-medium text-gray-900">Create New Will</span>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="font-medium text-gray-900">Add Beneficiary</span>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <Wallet className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="font-medium text-gray-900">View Wallet</span>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                  <div className="flex items-center">
                    <Bot className="w-5 h-5 text-purple-600 mr-3" />
                    <span className="font-medium text-gray-900">AI Assistant</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout

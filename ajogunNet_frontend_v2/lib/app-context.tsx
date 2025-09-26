"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { apiService } from "@/lib/api-service"

interface Will {
  id: string
  title: string
  status: "draft" | "active" | "executed"
  beneficiaries: any[]
  assets: any[]
  messages: any[]
  executionConditions: any
  contractAddress?: string
  transactionHash?: string
  createdAt: string
  lastModified: string
}

interface AppContextType {
  // Will Management
  wills: Will[]
  currentWill: Will | null
  createWill: (willData: Partial<Will>) => string
  updateWill: (id: string, updates: Partial<Will>) => void
  deleteWill: (id: string) => void
  setCurrentWill: (will: Will | null) => void

  // Navigation
  currentPage: string
  setCurrentPage: (page: string) => void
  navigationHistory: string[]

  // UI State
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  notifications: any[]
  addNotification: (notification: any) => void
  removeNotification: (id: string) => void

  // User Preferences
  preferences: {
    theme: "light" | "dark" | "system"
    language: string
    currency: string
    notifications: boolean
  }
  updatePreferences: (updates: Partial<AppContextType["preferences"]>) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [wills, setWills] = useState<Will[]>([])
  const [currentWill, setCurrentWill] = useState<Will | null>(null)
  const [currentPage, setCurrentPage] = useState("")
  const [navigationHistory, setNavigationHistory] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [preferences, setPreferences] = useState({
    theme: "system" as const,
    language: "en",
    currency: "USD",
    notifications: true,
  })

  // Set initial page based on URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname
      const hash = window.location.hash.slice(1)
      let initialPage = "dashboard"
      if (path === "/") {
        initialPage = "homepage"
      } else if (path === "/dashboard") {
        initialPage = hash || "dashboard"
      }
      setCurrentPage(initialPage)
      setNavigationHistory([initialPage])
    }
  }, [])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedWills = localStorage.getItem("willchain-wills")
    const savedPreferences = localStorage.getItem("willchain-preferences")
    const savedCurrentWill = localStorage.getItem("willchain-current-will")

    if (savedWills) {
      try {
        setWills(JSON.parse(savedWills))
      } catch (error) {
        console.error("Failed to load wills from localStorage:", error)
      }
    }

    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences))
      } catch (error) {
        console.error("Failed to load preferences from localStorage:", error)
      }
    }

    if (savedCurrentWill) {
      try {
        setCurrentWill(JSON.parse(savedCurrentWill))
      } catch (error) {
        console.error("Failed to load current will from localStorage:", error)
      }
    }
  }, [])

  // Save data to localStorage when state changes
  useEffect(() => {
    localStorage.setItem("willchain-wills", JSON.stringify(wills))
  }, [wills])

  useEffect(() => {
    localStorage.setItem("willchain-preferences", JSON.stringify(preferences))
  }, [preferences])

  useEffect(() => {
    if (currentWill) {
      localStorage.setItem("willchain-current-will", JSON.stringify(currentWill))
    } else {
      localStorage.removeItem("willchain-current-will")
    }
  }, [currentWill])

  const createWill = (willData: Partial<Will>): string => {
    const newWill: Will = {
      id: Date.now().toString(),
      title: willData.title || "My Digital Will",
      status: "draft",
      beneficiaries: willData.beneficiaries || [],
      assets: willData.assets || [],
      messages: willData.messages || [],
      executionConditions: willData.executionConditions || {
        deadManSwitch: true,
        inactivityPeriod: 365,
        backupExecutors: [],
      },
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      ...willData,
    }

    setWills((prev) => [...prev, newWill])
    setCurrentWill(newWill)

    addNotification({
      id: Date.now().toString(),
      type: "success",
      title: "Will Created",
      message: "Your digital will has been created successfully.",
      timestamp: new Date().toISOString(),
    })

    return newWill.id
  }

  const updateWill = (id: string, updates: Partial<Will>) => {
    setWills((prev) =>
      prev.map((will) =>
        will.id === id
          ? {
              ...will,
              ...updates,
              lastModified: new Date().toISOString(),
            }
          : will,
      ),
    )

    if (currentWill?.id === id) {
      setCurrentWill((prev) =>
        prev
          ? {
              ...prev,
              ...updates,
              lastModified: new Date().toISOString(),
            }
          : null,
      )
    }
  }

  const deleteWill = (id: string) => {
    setWills((prev) => prev.filter((will) => will.id !== id))
    if (currentWill?.id === id) {
      setCurrentWill(null)
    }

    addNotification({
      id: Date.now().toString(),
      type: "info",
      title: "Will Deleted",
      message: "The will has been permanently deleted.",
      timestamp: new Date().toISOString(),
    })
  }

  const handleSetCurrentPage = (page: string) => {
    if (page !== currentPage) {
      setCurrentPage(page)
      setNavigationHistory((prev) => {
        const newHistory = [...prev.filter((p) => p !== page), page]
        return newHistory.slice(-10) // Keep only last 10 pages
      })

      if (typeof window !== "undefined") {
        let url = ""
        if (page === "homepage") {
          url = "/"
        } else {
          url = `/dashboard${page === "dashboard" ? "" : `#${page}`}`
        }
        window.history.pushState({ page }, "", url)
      }
    }
  }

  const addNotification = (notification: any) => {
    setNotifications((prev) => [notification, ...prev])
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(notification.id)
    }, 5000)
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const updatePreferences = (updates: Partial<AppContextType["preferences"]>) => {
    setPreferences((prev) => ({ ...prev, ...updates }))
  }

  return (
    <AppContext.Provider
      value={{
        wills,
        currentWill,
        createWill,
        updateWill,
        deleteWill,
        setCurrentWill,
        currentPage,
        setCurrentPage: handleSetCurrentPage,
        navigationHistory,
        sidebarOpen,
        setSidebarOpen,
        notifications,
        addNotification,
        removeNotification,
        preferences,
        updatePreferences,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}

// "use client"

// import type React from "react"
// import { createContext, useContext, useState, useEffect } from "react"
// import { apiService } from "@/lib/api-service"

// interface Will {
//   id: string
//   title: string
//   status: "draft" | "active" | "executed"
//   beneficiaries: any[]
//   assets: any[]
//   messages: any[]
//   executionConditions: any
//   contractAddress?: string
//   transactionHash?: string
//   createdAt: string
//   lastModified: string
// }

// interface AppContextType {
//   // Will Management
//   wills: Will[]
//   currentWill: Will | null
//   createWill: (willData: Partial<Will>) => string
//   updateWill: (id: string, updates: Partial<Will>) => void
//   deleteWill: (id: string) => void
//   setCurrentWill: (will: Will | null) => void

//   // Navigation
//   currentPage: string
//   setCurrentPage: (page: string) => void
//   navigationHistory: string[]

//   // UI State
//   sidebarOpen: boolean
//   setSidebarOpen: (open: boolean) => void
//   notifications: any[]
//   addNotification: (notification: any) => void
//   removeNotification: (id: string) => void

//   // User Preferences
//   preferences: {
//     theme: "light" | "dark" | "system"
//     language: string
//     currency: string
//     notifications: boolean
//   }
//   updatePreferences: (updates: Partial<AppContextType["preferences"]>) => void
// }

// const AppContext = createContext<AppContextType | undefined>(undefined)

// export function AppProvider({ children }: { children: React.ReactNode }) {
//   const [wills, setWills] = useState<Will[]>([])
//   const [currentWill, setCurrentWill] = useState<Will | null>(null)
//   const [currentPage, setCurrentPage] = useState("dashboard")
//   const [navigationHistory, setNavigationHistory] = useState<string[]>(["dashboard"])
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [notifications, setNotifications] = useState<any[]>([])
//   const [preferences, setPreferences] = useState({
//     theme: "system" as const,
//     language: "en",
//     currency: "USD",
//     notifications: true,
//   })

//   // Load data from localStorage on mount
//   useEffect(() => {
//     const savedWills = localStorage.getItem("willchain-wills")
//     const savedPreferences = localStorage.getItem("willchain-preferences")
//     const savedCurrentWill = localStorage.getItem("willchain-current-will")

//     if (savedWills) {
//       try {
//         setWills(JSON.parse(savedWills))
//       } catch (error) {
//         console.error("Failed to load wills from localStorage:", error)
//       }
//     }

//     if (savedPreferences) {
//       try {
//         setPreferences(JSON.parse(savedPreferences))
//       } catch (error) {
//         console.error("Failed to load preferences from localStorage:", error)
//       }
//     }

//     if (savedCurrentWill) {
//       try {
//         setCurrentWill(JSON.parse(savedCurrentWill))
//       } catch (error) {
//         console.error("Failed to load current will from localStorage:", error)
//       }
//     }
//   }, [])

//   // Save data to localStorage when state changes
//   useEffect(() => {
//     localStorage.setItem("willchain-wills", JSON.stringify(wills))
//   }, [wills])

//   useEffect(() => {
//     localStorage.setItem("willchain-preferences", JSON.stringify(preferences))
//   }, [preferences])

//   useEffect(() => {
//     if (currentWill) {
//       localStorage.setItem("willchain-current-will", JSON.stringify(currentWill))
//     } else {
//       localStorage.removeItem("willchain-current-will")
//     }
//   }, [currentWill])

//   const createWill = (willData: Partial<Will>): string => {
//     const newWill: Will = {
//       id: Date.now().toString(),
//       title: willData.title || "My Digital Will",
//       status: "draft",
//       beneficiaries: willData.beneficiaries || [],
//       assets: willData.assets || [],
//       messages: willData.messages || [],
//       executionConditions: willData.executionConditions || {
//         deadManSwitch: true,
//         inactivityPeriod: 365,
//         backupExecutors: [],
//       },
//       createdAt: new Date().toISOString(),
//       lastModified: new Date().toISOString(),
//       ...willData,
//     }

//     setWills((prev) => [...prev, newWill])
//     setCurrentWill(newWill)

//     addNotification({
//       id: Date.now().toString(),
//       type: "success",
//       title: "Will Created",
//       message: "Your digital will has been created successfully.",
//       timestamp: new Date().toISOString(),
//     })

//     return newWill.id
//   }

//   const updateWill = (id: string, updates: Partial<Will>) => {
//     setWills((prev) =>
//       prev.map((will) =>
//         will.id === id
//           ? {
//               ...will,
//               ...updates,
//               lastModified: new Date().toISOString(),
//             }
//           : will,
//       ),
//     )

//     if (currentWill?.id === id) {
//       setCurrentWill((prev) =>
//         prev
//           ? {
//               ...prev,
//               ...updates,
//               lastModified: new Date().toISOString(),
//             }
//           : null,
//       )
//     }
//   }

//   const deleteWill = (id: string) => {
//     setWills((prev) => prev.filter((will) => will.id !== id))
//     if (currentWill?.id === id) {
//       setCurrentWill(null)
//     }

//     addNotification({
//       id: Date.now().toString(),
//       type: "info",
//       title: "Will Deleted",
//       message: "The will has been permanently deleted.",
//       timestamp: new Date().toISOString(),
//     })
//   }

//   const handleSetCurrentPage = (page: string) => {
//     if (page !== currentPage) {
//       setCurrentPage(page)
//       setNavigationHistory((prev) => {
//         const newHistory = [...prev.filter((p) => p !== page), page]
//         return newHistory.slice(-10) // Keep only last 10 pages
//       })

//       if (typeof window !== "undefined") {
//         const url = page === "dashboard" ? "/dashboard" : `/dashboard#${page}`
//         window.history.pushState({ page }, "", url)
//       }
//     }
//   }

//   const addNotification = (notification: any) => {
//     setNotifications((prev) => [notification, ...prev])
//     // Auto-remove after 5 seconds
//     setTimeout(() => {
//       removeNotification(notification.id)
//     }, 5000)
//   }

//   const removeNotification = (id: string) => {
//     setNotifications((prev) => prev.filter((n) => n.id !== id))
//   }

//   const updatePreferences = (updates: Partial<AppContextType["preferences"]>) => {
//     setPreferences((prev) => ({ ...prev, ...updates }))
//   }

//   return (
//     <AppContext.Provider
//       value={{
//         wills,
//         currentWill,
//         createWill,
//         updateWill,
//         deleteWill,
//         setCurrentWill,
//         currentPage,
//         setCurrentPage: handleSetCurrentPage,
//         navigationHistory,
//         sidebarOpen,
//         setSidebarOpen,
//         notifications,
//         addNotification,
//         removeNotification,
//         preferences,
//         updatePreferences,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   )
// }

// export function useApp() {
//   const context = useContext(AppContext)
//   if (context === undefined) {
//     throw new Error("useApp must be used within an AppProvider")
//   }
//   return context
// }

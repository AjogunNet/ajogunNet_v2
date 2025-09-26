
"use client"

import type React from "react"

import { useApp } from "@/lib/app-context"
import { useWallet } from "@/lib/wallet-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface PageRouterProps {
  children: React.ReactNode
}

const PageRouter = ({ children }: PageRouterProps) => {
  const { isConnected } = useWallet()
  const { currentPage, setCurrentPage } = useApp()
  const router = useRouter()

  useEffect(() => {
    const path = window.location.pathname
    if (!isConnected && path !== "/") {
      router.push("/")
    } else if (isConnected && path !== "/dashboard") {
      router.push("/dashboard")
    }
  }, [isConnected, router])

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname
      const hash = window.location.hash.slice(1)
      if (path === "/") {
        setCurrentPage("homepage")
      } else if (path === "/dashboard") {
        setCurrentPage(hash || "dashboard")
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [setCurrentPage])

  return <>{children}</>
}

export default PageRouter


// "use client"

// import type React from "react"

// import { useApp } from "@/lib/app-context"
// import { useWallet } from "@/lib/wallet-context"
// import { useRouter } from "next/navigation"
// import { useEffect } from "react"

// interface PageRouterProps {
//   children: React.ReactNode
// }

// const PageRouter = ({ children }: PageRouterProps) => {
//   const { isConnected } = useWallet()
//   const { currentPage, setCurrentPage } = useApp()
//   const router = useRouter()

//   useEffect(() => {
//     if (!isConnected && currentPage !== "homepage") {
//       setCurrentPage("homepage")
//       router.push("/")
//     }
//   }, [isConnected, currentPage, setCurrentPage, router])

//   useEffect(() => {
//     const handlePopState = () => {
//       const path = window.location.pathname
//       if (path === "/" && currentPage !== "homepage") {
//         setCurrentPage("homepage")
//       } else if (path === "/dashboard" && currentPage === "homepage") {
//         setCurrentPage("dashboard")
//       }
//     }

//     window.addEventListener("popstate", handlePopState)
//     return () => window.removeEventListener("popstate", handlePopState)
//   }, [currentPage, setCurrentPage])

//   return <>{children}</>
// }

// export default PageRouter

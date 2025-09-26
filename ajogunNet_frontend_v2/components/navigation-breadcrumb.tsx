"use client"

import { ChevronRight, Home } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"

const NavigationBreadcrumb = () => {
  const { currentPage, setCurrentPage, navigationHistory } = useApp()

  const getPageDisplayName = (page: string) => {
    switch (page) {
      case "dashboard":
        return "Dashboard"
      case "create-will":
        return "Create Will"
      case "beneficiaries":
        return "Beneficiaries"
      case "wallet":
        return "Wallet"
      case "messages":
        return "Messages"
      case "ai-assistant":
        return "AI Assistant"
      default:
        return page.charAt(0).toUpperCase() + page.slice(1)
    }
  }

  const breadcrumbItems = navigationHistory.slice(-3).map((page, index, array) => ({
    page,
    displayName: getPageDisplayName(page),
    isLast: index === array.length - 1,
  }))

  if (breadcrumbItems.length <= 1) return null

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
      <Button variant="ghost" size="sm" onClick={() => setCurrentPage("dashboard")} className="p-1 h-auto">
        <Home className="w-4 h-4" />
      </Button>
      {breadcrumbItems.map((item, index) => (
        <div key={`${item.page}-${index}`} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4" />
          <button
            onClick={() => !item.isLast && setCurrentPage(item.page)}
            className={`hover:text-foreground transition-colors ${
              item.isLast ? "text-foreground font-medium cursor-default" : "cursor-pointer"
            }`}
          >
            {item.displayName}
          </button>
        </div>
      ))}
    </nav>
  )
}

export default NavigationBreadcrumb

// "use client"

// import { ChevronRight, Home } from "lucide-react"
// import { useApp } from "@/lib/app-context"
// import { Button } from "@/components/ui/button"

// const NavigationBreadcrumb = () => {
//   const { currentPage, setCurrentPage, navigationHistory } = useApp()

//   const getPageDisplayName = (page: string) => {
//     switch (page) {
//       case "dashboard":
//         return "Dashboard"
//       case "create-will":
//         return "Create Will"
//       case "beneficiaries":
//         return "Beneficiaries"
//       case "wallet":
//         return "Wallet"
//       case "messages":
//         return "Messages"
//       case "ai-assistant":
//         return "AI Assistant"
//       default:
//         return page.charAt(0).toUpperCase() + page.slice(1)
//     }
//   }

//   const breadcrumbItems = navigationHistory.slice(-3).map((page, index, array) => ({
//     page,
//     displayName: getPageDisplayName(page),
//     isLast: index === array.length - 1,
//   }))

//   if (breadcrumbItems.length <= 1) return null

//   return (
//     <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
//       <Button variant="ghost" size="sm" onClick={() => setCurrentPage("dashboard")} className="p-1 h-auto">
//         <Home className="w-4 h-4" />
//       </Button>
//       {breadcrumbItems.map((item, index) => (
//         <div key={`${item.page}-${index}`} className="flex items-center space-x-2">
//           <ChevronRight className="w-4 h-4" />
//           <button
//             onClick={() => !item.isLast && setCurrentPage(item.page)}
//             className={`hover:text-foreground transition-colors ${
//               item.isLast ? "text-foreground font-medium cursor-default" : "cursor-pointer"
//             }`}
//           >
//             {item.displayName}
//           </button>
//         </div>
//       ))}
//     </nav>
//   )
// }

// export default NavigationBreadcrumb

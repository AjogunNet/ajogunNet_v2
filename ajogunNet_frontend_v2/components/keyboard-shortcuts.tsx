"use client"

import { useEffect } from "react"
import { useApp } from "@/lib/app-context"
import { useWallet } from "@/lib/wallet-context"

const KeyboardShortcuts = () => {
  const { setCurrentPage, addNotification } = useApp()
  const { isConnected } = useWallet()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when connected and not typing in inputs
      if (!isConnected || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "1":
            event.preventDefault()
            setCurrentPage("dashboard")
            break
          case "2":
            event.preventDefault()
            setCurrentPage("create-will")
            break
          case "3":
            event.preventDefault()
            setCurrentPage("beneficiaries")
            break
          case "4":
            event.preventDefault()
            setCurrentPage("wallet")
            break
          case "5":
            event.preventDefault()
            setCurrentPage("ai-assistant")
            break
          case "/":
            event.preventDefault()
            addNotification({
              id: Date.now().toString(),
              type: "info",
              title: "Keyboard Shortcuts",
              message:
                "Ctrl+1: Dashboard, Ctrl+2: Create Will, Ctrl+3: Beneficiaries, Ctrl+4: Wallet, Ctrl+5: AI Assistant",
              timestamp: new Date().toISOString(),
            })
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isConnected, setCurrentPage, addNotification])

  return null
}

export default KeyboardShortcuts

// "use client"

// import { useEffect } from "react"
// import { useApp } from "@/lib/app-context"
// import { useWallet } from "@/lib/wallet-context"

// const KeyboardShortcuts = () => {
//   const { setCurrentPage, addNotification } = useApp()
//   const { isConnected } = useWallet()

//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       // Only handle shortcuts when connected and not typing in inputs
//       if (!isConnected || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
//         return
//       }

//       if (event.ctrlKey || event.metaKey) {
//         switch (event.key) {
//           case "1":
//             event.preventDefault()
//             setCurrentPage("dashboard")
//             break
//           case "2":
//             event.preventDefault()
//             setCurrentPage("create-will")
//             break
//           case "3":
//             event.preventDefault()
//             setCurrentPage("beneficiaries")
//             break
//           case "4":
//             event.preventDefault()
//             setCurrentPage("wallet")
//             break
//           case "5":
//             event.preventDefault()
//             setCurrentPage("ai-assistant")
//             break
//           case "/":
//             event.preventDefault()
//             addNotification({
//               id: Date.now().toString(),
//               type: "info",
//               title: "Keyboard Shortcuts",
//               message:
//                 "Ctrl+1: Dashboard, Ctrl+2: Create Will, Ctrl+3: Beneficiaries, Ctrl+4: Wallet, Ctrl+5: AI Assistant",
//               timestamp: new Date().toISOString(),
//             })
//             break
//         }
//       }
//     }

//     window.addEventListener("keydown", handleKeyDown)
//     return () => window.removeEventListener("keydown", handleKeyDown)
//   }, [isConnected, setCurrentPage, addNotification])

//   return null
// }

// export default KeyboardShortcuts

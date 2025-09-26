import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/lib/theme-context"
import { WalletProvider } from "@/lib/wallet-context"
import { AppProvider } from "@/lib/app-context"
import { AuthProvider } from "@/lib/auth-context"
import NotificationSystem from "@/components/notification-system"
import PageRouter from "@/components/page-router"
import { Suspense } from "react"
import KeyboardShortcuts from "@/components/keyboard-shortcuts"
import "./globals.css"

export const metadata: Metadata = {
  title: "AjogunNet - Secure Digital Will Platform",
  description: "Create and manage your digital will on the blockchain",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <WalletProvider>
              <AppProvider>
                <PageRouter>
                  <Suspense fallback={null}>
                    {children}
                    <NotificationSystem />
                    <KeyboardShortcuts />
                  </Suspense>
                </PageRouter>
              </AppProvider>
            </WalletProvider>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

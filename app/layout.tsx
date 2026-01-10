import type React from "react"
import type { Metadata } from "next"
import { ServiceWorkerProvider } from "@/components/service-worker-provider"
import { QueryProvider } from "@/providers/query-provider"
import { AuthProvider } from "@/lib/mobile/auth-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "SFT Brain - Mobile",
  description: "AI-powered spaced repetition learning system for iOS. Create QA pairs and practice with intelligent scoring.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-sans antialiased">
        <ServiceWorkerProvider />
        <AuthProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

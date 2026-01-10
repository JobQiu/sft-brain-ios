"use client"

import type React from "react"
import { useAuth } from "@/lib/mobile/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import MobileBottomNav from "@/components/mobile/bottom-nav"

export default function MobileAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Hide bottom nav on review page for better focus
  const isReviewPage = pathname === '/review'

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Use 100dvh for proper iOS safe area handling
  // The container fills the entire viewport including safe areas
  // Content area uses paddingBottom to account for both TabBar and safe-area-inset-bottom
  return (
    <div
      className="flex flex-col bg-background overflow-hidden"
      style={{
        height: '100dvh',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div
        className={`flex-1 overflow-y-auto overflow-x-hidden ${isReviewPage ? 'pb-0' : 'pb-16'}`}
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </div>
      {!isReviewPage && <MobileBottomNav />}
    </div>
  )
}
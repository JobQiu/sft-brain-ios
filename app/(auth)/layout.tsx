"use client"

import type React from "react"
import { useAuth } from "@/lib/mobile/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import MobileBottomNav from "@/components/mobile/bottom-nav"
import SafeAreaManager from "@/components/mobile/safe-area-manager"

export default function MobileAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [viewportHeight, setViewportHeight] = useState(0)

  // Hide bottom nav on review page for better focus
  const isReviewPage = pathname === '/mobile/review'

  // Fix iOS 100vh issue
  useEffect(() => {
    const setHeight = () => {
      setViewportHeight(window.innerHeight)
    }

    setHeight()
    window.addEventListener('resize', setHeight)

    return () => window.removeEventListener('resize', setHeight)
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/mobile/login")
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

  return (
    <>
      <SafeAreaManager />
      <div className="flex flex-col bg-background min-h-screen">
        <div
          className={`flex-1 overflow-y-auto overflow-x-hidden ${isReviewPage ? 'pb-0' : 'pb-20'}`}
          style={{
            minHeight: '100dvh',
            WebkitOverflowScrolling: 'touch' as any,
          }}
        >
          {children}
        </div>
        {!isReviewPage && <MobileBottomNav />}
      </div>
    </>
  )
}
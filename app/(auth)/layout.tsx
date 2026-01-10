"use client"

import type React from "react"
import { useAuth } from "@/lib/mobile/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import MobileBottomNav from "@/components/mobile/bottom-nav"

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
  const isReviewPage = pathname === '/review'

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

  return (
    <div
      className="flex flex-col bg-background overflow-hidden"
      style={{
        height: viewportHeight > 0 ? `${viewportHeight}px` : '100vh',
      }}
    >
      <div
        className={`flex-1 overflow-y-auto overflow-x-hidden ${isReviewPage ? 'pb-0' : 'pb-20'}`}
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          WebkitOverflowScrolling: 'touch' as any,
        }}
      >
        {children}
      </div>
      {!isReviewPage && <MobileBottomNav />}
    </div>
  )
}
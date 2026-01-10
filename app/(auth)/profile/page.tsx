"use client"

import { useAuth } from "@/lib/mobile/auth-context"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Settings, HelpCircle, Shield, BookOpen, Brain, Trophy, ChevronRight } from "lucide-react"
import LevelBadge from "@/components/mobile/level-badge"
import { getQAPairs, getDashboardStats } from "@/lib/mobile/qa-store"
import { useEffect, useState } from "react"
import type { DashboardStats } from "@/lib/mobile/types"

export default function MobileProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalQAPairs: 0,
    totalReviewsCompleted: 0,
    dayStreak: 0,
    reviewsDueToday: 0,
    averageAccuracy: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true)
      try {
        const dashboardStats = await getDashboardStats()
        setStats(dashboardStats)
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const handleLogout = async () => {
    await logout()
    // Small delay to ensure state is cleared
    setTimeout(() => {
      router.push("/login")
    }, 100)
  }

  const menuItems = [
    {
      icon: Settings,
      label: "Settings",
      onClick: () => {
        // TODO: Navigate to settings page when implemented
        console.log("Settings clicked")
      },
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      onClick: () => {
        // Navigate to help page or open external help
        window.open("https://github.com/sft-brain/docs", "_blank")
      },
    },
    {
      icon: Shield,
      label: "Privacy Policy",
      onClick: () => {
        router.push("/privacy")
      },
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="bg-background">
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="px-4 py-3">
          <h1 className="text-xl font-semibold">Profile</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-4">
        {/* User Info Card */}
        <Card className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar className="w-24 h-24 ring-4 ring-primary/10">
              {user?.avatar && user.avatar.trim() !== "" ? (
                <AvatarImage
                  src={user.avatar}
                  alt={user?.name || "User"}
                  onError={(e) => {
                    // Hide the broken image element to show fallback
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : null}
              <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{user?.name || "User"}</h2>
              <p className="text-sm text-muted-foreground mt-1">{user?.email || "user@example.com"}</p>
            </div>
            <LevelBadge />
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <BookOpen className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{stats.totalQAPairs}</div>
            <div className="text-xs text-muted-foreground mt-1">QA Pairs</div>
          </Card>

          <Card className="p-4 text-center">
            <Brain className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{stats.totalReviewsCompleted}</div>
            <div className="text-xs text-muted-foreground mt-1">Reviews</div>
          </Card>

          <Card className="p-4 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{stats.dayStreak}</div>
            <div className="text-xs text-muted-foreground mt-1">Day Streak</div>
          </Card>
        </div>

        {/* Accuracy Card */}
        {stats.averageAccuracy !== undefined && stats.averageAccuracy > 0 && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Average Accuracy</h3>
                <div className="text-3xl font-bold">{stats.averageAccuracy.toFixed(1)}%</div>
              </div>
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-primary"
                    strokeDasharray={`${(stats.averageAccuracy / 100) * 220} 220`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">{Math.round(stats.averageAccuracy)}%</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Menu Items */}
        <Card className="divide-y divide-border">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="w-full flex items-center gap-3 p-4 hover:bg-accent transition-colors active:bg-accent/80"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="flex-1 text-left font-medium">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            )
          })}
        </Card>

        {/* Logout Button */}
        <Button onClick={handleLogout} variant="destructive" className="w-full h-12" size="lg">
          <LogOut className="w-5 h-5 mr-2" />
          Log Out
        </Button>

        {/* App Info */}
        <div className="text-center text-xs text-muted-foreground space-y-1 pt-4">
          <p>SFT Brain Project</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </div>
  )
}
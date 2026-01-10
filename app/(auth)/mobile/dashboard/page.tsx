"use client"

import { useState, useEffect } from "react"
import { getQAPairs, getDashboardStats } from "@/lib/mobile/qa-store"
import { Card } from "@/components/ui/card"
import { BookOpen, CheckCircle2, Clock, TrendingUp } from "lucide-react"
import { ActivityHeatmap } from "@/components/mobile/activity-heatmap"
import type { QAPair, DashboardStats } from "@/lib/mobile/types"

export default function MobileDashboardPage() {
  const [qaPairs, setQAPairs] = useState<QAPair[]>([])
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalQAPairs: 0,
    reviewsDueToday: 0,
    totalReviewsCompleted: 0,
    averageAccuracy: 0,
    dayStreak: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [pairs, stats] = await Promise.all([getQAPairs(), getDashboardStats()])
        setQAPairs(pairs)
        setDashboardStats(stats)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const stats = [
    {
      label: "Total QAs",
      value: dashboardStats.totalQAPairs,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Total Reviews",
      value: dashboardStats.totalReviewsCompleted,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Due Today",
      value: dashboardStats.reviewsDueToday,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      label: "Day Streak",
      value: dashboardStats.dayStreak,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
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
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your learning progress at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          )
        })}
      </div>

      {/* Accuracy Card - Full Width */}
      {dashboardStats.averageAccuracy !== undefined && dashboardStats.averageAccuracy > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Average Accuracy</div>
              <div className="text-2xl font-bold">{dashboardStats.averageAccuracy.toFixed(1)}%</div>
            </div>
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-primary"
                  strokeDasharray={`${(dashboardStats.averageAccuracy / 100) * 176} 176`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold">{Math.round(dashboardStats.averageAccuracy)}%</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Activity Heatmap */}
      <div className="overflow-x-auto">
        <ActivityHeatmap qaPairs={qaPairs} />
      </div>

      {/* Motivation Card */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Keep Going!</h3>
        <div className="space-y-3">
          {dashboardStats.dayStreak > 0 && (
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <p className="text-sm text-muted-foreground">
                You're on a <span className="font-medium text-foreground">{dashboardStats.dayStreak} day</span> streak!
              </p>
            </div>
          )}
          {dashboardStats.reviewsDueToday > 0 && (
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{dashboardStats.reviewsDueToday}</span> QA pairs due for review
              </p>
            </div>
          )}
          {dashboardStats.totalReviewsCompleted > 0 && (
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <p className="text-sm text-muted-foreground">
                You've completed <span className="font-medium text-foreground">{dashboardStats.totalReviewsCompleted}</span> reviews
              </p>
            </div>
          )}
          {dashboardStats.totalQAPairs === 0 && (
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <p className="text-sm text-muted-foreground">
                Start by <span className="font-medium text-foreground">adding your first QA pair</span>
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
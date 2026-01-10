"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { QAPair } from "@/lib/mobile/types"

interface ActivityHeatmapProps {
  qaPairs: QAPair[]
}

export function ActivityHeatmap({ qaPairs }: ActivityHeatmapProps) {
  // Generate data for the last 52 weeks (1 year)
  const weeks = 52
  const daysInWeek = 7
  const totalDays = weeks * daysInWeek

  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - totalDays + 1)

  // Calculate activity count for each day
  const activityMap = new Map<string, number>()

  qaPairs.forEach((qa) => {
    // Count QA creations
    const createDate = new Date(qa.createdAt).toISOString().split("T")[0]
    activityMap.set(createDate, (activityMap.get(createDate) || 0) + 1)

    // Count reviews
    qa.reviewHistory.forEach((review) => {
      const reviewDate = new Date(review.reviewedAt).toISOString().split("T")[0]
      activityMap.set(reviewDate, (activityMap.get(reviewDate) || 0) + 1)
    })
  })

  // Generate grid data
  const gridData: Array<{ date: Date; count: number; dateStr: string }> = []
  for (let i = 0; i < totalDays; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    const dateStr = date.toISOString().split("T")[0]
    gridData.push({
      date,
      count: activityMap.get(dateStr) || 0,
      dateStr,
    })
  }

  // Get color intensity based on count
  const getColor = (count: number) => {
    if (count === 0) return "bg-muted"
    if (count <= 2) return "bg-indigo-200 dark:bg-indigo-900/40"
    if (count <= 4) return "bg-indigo-400 dark:bg-indigo-700/60"
    if (count <= 6) return "bg-indigo-600 dark:bg-indigo-600/80"
    return "bg-indigo-800 dark:bg-indigo-500"
  }

  // Group by weeks
  const weekData: Array<Array<{ date: Date; count: number; dateStr: string }>> = []
  for (let i = 0; i < weeks; i++) {
    weekData.push(gridData.slice(i * daysInWeek, (i + 1) * daysInWeek))
  }

  const monthLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const totalActivity = Array.from(activityMap.values()).reduce((sum, count) => sum + count, 0)

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Activity Overview</CardTitle>
        <p className="text-sm text-muted-foreground">{totalActivity} activities in the last year</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 text-xs text-muted-foreground pt-5">
              {monthLabels.map((label, i) => (
                <div key={i} className="h-3 flex items-center" style={{ lineHeight: "12px" }}>
                  {i % 2 === 1 ? label : ""}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            {weekData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {/* Month label for first day of month */}
                <div className="h-4 text-xs text-muted-foreground">
                  {week[0].date.getDate() <= 7 ? week[0].date.toLocaleDateString("en-US", { month: "short" }) : ""}
                </div>
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`w-3 h-3 rounded-sm ${getColor(day.count)} transition-colors hover:ring-2 hover:ring-indigo-500 cursor-pointer`}
                    title={`${day.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}: ${day.count} ${day.count === 1 ? "activity" : "activities"}`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-muted" />
              <div className="w-3 h-3 rounded-sm bg-indigo-200 dark:bg-indigo-900/40" />
              <div className="w-3 h-3 rounded-sm bg-indigo-400 dark:bg-indigo-700/60" />
              <div className="w-3 h-3 rounded-sm bg-indigo-600 dark:bg-indigo-600/80" />
              <div className="w-3 h-3 rounded-sm bg-indigo-800 dark:bg-indigo-500" />
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
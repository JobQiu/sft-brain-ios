"use client"

import { Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LevelInfo } from "@/lib/mobile/level-system"
import { calculateLevel } from "@/lib/mobile/level-system"
import { getQAPairs } from "@/lib/mobile/qa-store"
import { useEffect, useState } from "react"

interface LevelBadgeProps {
  levelInfo?: LevelInfo
  compact?: boolean
  className?: string
}

export function LevelBadge({ levelInfo, compact = false, className }: LevelBadgeProps) {
  const [computedLevelInfo, setComputedLevelInfo] = useState<LevelInfo | null>(null)

  useEffect(() => {
    const calculateLevelInfo = async () => {
      if (!levelInfo) {
        const qaPairs = await getQAPairs()
        const totalAdded = qaPairs.length
        const totalCorrectReviews = qaPairs.reduce((total, pair) => {
          return total + pair.reviewHistory.filter((r) => r.correct).length
        }, 0)

        const info = calculateLevel(totalAdded, totalCorrectReviews)
        setComputedLevelInfo(info)
      }
    }

    calculateLevelInfo()
  }, [levelInfo])

  const displayLevelInfo = levelInfo || computedLevelInfo || {
    level: 1,
    title: "Beginner",
    currentXP: 0,
    nextLevelXP: 100,
    progress: 0,
  }

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm",
          className,
        )}
      >
        <Trophy className="h-3.5 w-3.5" />
        <span className="text-xs font-bold">Lv {displayLevelInfo.level}</span>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md">
          <Trophy className="h-4 w-4" />
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold">Lv {displayLevelInfo.level}</span>
            <span className="text-xs opacity-90">{displayLevelInfo.title}</span>
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {displayLevelInfo.currentXP} / {displayLevelInfo.nextLevelXP} XP
          </span>
          <span>{Math.round(displayLevelInfo.progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
            style={{ width: `${Math.min(displayLevelInfo.progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default LevelBadge
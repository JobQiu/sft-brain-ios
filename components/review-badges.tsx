"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ReviewBadgesProps {
  className?: string
  reviewCount?: number
  correctCount?: number
  incorrectCount?: number
  milestones?: any[]
  progressPercentage?: number
  intervals?: any[]
}

export function ReviewBadges({
  className,
  reviewCount = 0,
  correctCount = 0,
  incorrectCount = 0,
  milestones,
  progressPercentage,
  intervals
}: ReviewBadgesProps) {
  // If milestone data is provided, render badge progress
  if (milestones && progressPercentage !== undefined) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex gap-2 flex-wrap">
          {milestones.map((milestone: any, index: number) => (
            <Badge key={index} variant={milestone.achieved ? "default" : "secondary"}>
              {milestone.name}
            </Badge>
          ))}
        </div>
        {progressPercentage > 0 && (
          <div className="text-xs text-muted-foreground">
            Progress: {progressPercentage}%
          </div>
        )}
      </div>
    )
  }

  // Otherwise render review stats
  return (
    <div className={cn("flex gap-2 flex-wrap", className)}>
      {reviewCount > 0 && (
        <Badge variant="secondary">
          {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
        </Badge>
      )}
      {correctCount > 0 && (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          {correctCount} correct
        </Badge>
      )}
      {incorrectCount > 0 && (
        <Badge variant="destructive">
          {incorrectCount} incorrect
        </Badge>
      )}
    </div>
  )
}

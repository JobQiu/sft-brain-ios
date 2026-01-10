export interface QAPair {
  id: string
  question: string
  answer: string
  tags: string[]
  createdAt: Date
  updatedAt?: Date
  nextReviewAt: Date
  reviewCount: number
  reviewIndex?: number  // Position in spaced repetition schedule (0 = 1st review, etc.)
  reviewHistory: ReviewRecord[]
  source?: string
  sourceUrl?: string | null
  imageUrl?: string | null
  userId?: string
}

// Default spaced repetition intervals
export const SPACED_REPETITION_INTERVALS = [1, 3, 7, 14, 30]

// Helper to get review status label
export function getReviewStatusLabel(reviewIndex: number, totalIntervals: number = SPACED_REPETITION_INTERVALS.length): string {
  if (reviewIndex >= totalIntervals) {
    return "✅ Mastered"
  }
  const ordinals = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"]
  return `${ordinals[reviewIndex] || `${reviewIndex + 1}th`} Review`
}

// Check if card is mastered
export function isMastered(reviewIndex: number, totalIntervals: number = SPACED_REPETITION_INTERVALS.length): boolean {
  return reviewIndex >= totalIntervals
}

export interface ReviewRecord {
  id: string
  reviewedAt: Date
  userAnswer?: string
  correct: boolean
  nextReviewAt?: Date
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  level?: number
  totalQAPairs?: number
  totalReviews?: number
  dayStreak?: number
}

export interface DashboardStats {
  totalQAPairs: number
  reviewsDueToday: number
  totalReviewsCompleted: number
  averageAccuracy?: number
  dayStreak: number
  activityData?: ActivityData[]
}

export interface ActivityData {
  date: string
  count: number
}
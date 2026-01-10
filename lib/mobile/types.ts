export interface QAPair {
  id: string
  question: string
  answer: string
  tags: string[]
  createdAt: Date
  updatedAt?: Date
  nextReviewAt: Date
  reviewCount: number
  reviewHistory: ReviewRecord[]
  source?: string
  sourceUrl?: string
  imageUrl?: string
  userId?: string
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
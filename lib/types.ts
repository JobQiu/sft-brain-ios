// Backend API response types
export interface BackendQAPair {
  id: number
  question: string
  answer: string
  image?: string | null
  source?: string
  source_url?: string | null
  source_text?: string | null
  memory_level: number
  interval_days: number
  next_review: string | null
  review_count: number
  created_at: string | null
  tags?: Array<{ id: number; name: string }>
}

export interface BackendReview {
  id: number
  qa_pair_id: number
  user_answer: string
  is_correct: boolean
  reviewed_at: string
}

// Frontend types (matching existing UI)
export interface QAPair {
  id: string
  question: string
  answer: string
  image?: string | null
  source?: string
  sourceUrl?: string | null
  sourceText?: string | null
  tags: string[]
  createdAt: Date
  nextReviewAt: Date
  reviewCount: number
  reviewHistory: ReviewRecord[]
  memoryLevel?: number
  intervalDays?: number
}

export interface ReviewRecord {
  id: string
  reviewedAt: Date
  userAnswer: string
  correct: boolean
}

// Type conversion utilities
export function backendToFrontendQAPair(backend: BackendQAPair, reviews?: BackendReview[]): QAPair {
  return {
    id: backend.id.toString(),
    question: backend.question,
    answer: backend.answer,
    image: backend.image,
    source: backend.source,
    sourceUrl: backend.source_url,
    sourceText: backend.source_text,
    tags: Array.isArray(backend.tags) ? backend.tags.map((t) => (typeof t === 'string' ? t : t.name)) : [],
    createdAt: backend.created_at ? new Date(backend.created_at) : new Date(),
    nextReviewAt: backend.next_review ? new Date(backend.next_review) : new Date(),
    reviewCount: backend.review_count,
    memoryLevel: backend.memory_level,
    intervalDays: backend.interval_days,
    reviewHistory: reviews?.map((r) => ({
      id: r.id.toString(),
      reviewedAt: new Date(r.reviewed_at),
      userAnswer: r.user_answer,
      correct: r.is_correct,
    })) || [],
  }
}

export function frontendToBackendQAPair(frontend: Partial<QAPair>): Partial<BackendQAPair> {
  return {
    question: frontend.question,
    answer: frontend.answer,
    // Tags will be handled separately via tags API
  }
}

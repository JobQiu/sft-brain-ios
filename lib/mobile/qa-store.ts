"use client"

import type { QAPair, ReviewRecord, DashboardStats } from "./types"
import { getAuthToken as getApiAuthToken } from "@/lib/api-client"

// Use relative URL when in browser (works with Nginx proxy in monolithic container)
// In monolithic container, Nginx routes /api/* to Flask backend on port 3000
const API_BASE_URL = typeof window !== "undefined" ? "" : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000")

// Helper function to get auth token from storage (synchronous version for compatibility)
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null

  // Try new format first (standard keys)
  let tokenInfoStr = localStorage.getItem('auth_token_info')

  // Fallback to Capacitor-prefixed keys (even in web mode, Capacitor storage adapter may add prefix)
  if (!tokenInfoStr) {
    tokenInfoStr = localStorage.getItem('CapacitorStorage.auth_token_info')
  }

  if (tokenInfoStr) {
    try {
      const tokenInfo = JSON.parse(tokenInfoStr)
      // Check if token is expired
      if (Date.now() >= tokenInfo.expiresAt) {
        return null
      }
      return tokenInfo.token
    } catch {
      return null
    }
  }

  // Fallback to legacy format (try both standard and prefixed)
  const legacyToken = localStorage.getItem('auth_token') || localStorage.getItem('CapacitorStorage.auth_token')
  if (legacyToken) {
    console.log('[getAuthToken] Found legacy token')
    return legacyToken
  }

  console.log('[getAuthToken] No token found in any storage location')
  console.log('[getAuthToken] Available localStorage keys:', Object.keys(localStorage))
  return null
}

// Helper function for authenticated requests
async function authenticatedFetch(url: string, options: RequestInit = {}) {
  // Try async API client token first (more reliable)
  let token = await getApiAuthToken()
  
  // Fallback to sync method if async returns null
  if (!token) {
    token = getAuthToken()
  }
  
  console.log(`[authenticatedFetch] Token found: ${token ? 'YES (length: ' + token.length + ')' : 'NO'}`)
  if (!token) {
    console.error('[authenticatedFetch] No token available! User may need to log in again.')
  }

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  console.log(`[authenticatedFetch] Making request to: ${url}`)
  console.log(`[authenticatedFetch] Has Authorization header: ${!!headers.Authorization}`)

  return fetch(url, {
    ...options,
    headers,
  })
}

// Get all QA pairs for the current user
export async function getQAPairs(): Promise<QAPair[]> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/qa-pairs`)

    if (response.ok) {
      const data = await response.json()
      // Convert date strings to Date objects
      // Handle both API response formats (data.qa_pairs and data.data)
      const pairs = data.qa_pairs || data.data || []
      return pairs.map((pair: any) => ({
        id: pair.id,
        question: pair.question,
        answer: pair.answer,
        tags: Array.isArray(pair.tags)
          ? pair.tags.map((t: any) => typeof t === 'string' ? t : t.name || String(t))
          : [],
        createdAt: new Date(pair.created_at),
        updatedAt: pair.updated_at ? new Date(pair.updated_at) : undefined,
        nextReviewAt: pair.next_review_at ? new Date(pair.next_review_at) : new Date(),
        reviewCount: pair.review_count || 0,
        reviewHistory: pair.review_history || [],
        source: pair.source,
        sourceUrl: pair.source_url,
        imageUrl: pair.image,
        userId: pair.user_id,
      }))
    }

    // Fallback to localStorage for offline/development
    return getLocalQAPairs()
  } catch (error) {
    console.error("Error fetching QA pairs:", error)
    return getLocalQAPairs()
  }
}

// Get single QA pair
export async function getQAPair(id: string): Promise<QAPair | null> {
  console.log(`[qa-store] getQAPair called for ID: ${id}`)
  try {
    const url = `${API_BASE_URL}/api/qa-pairs/${id}`
    console.log(`[qa-store] Fetching from URL: ${url}`)

    const response = await authenticatedFetch(url)
    console.log(`[qa-store] Response status: ${response.status}`)

    if (response.ok) {
      const result = await response.json()
      console.log(`[qa-store] Received response:`, result)

      // Handle API response format: {success: true, data: {...}}
      const pair = result.data || result
      
      if (!pair) {
        console.log(`[qa-store] No data in response, returning null`)
        return null
      }

      // Fetch reviews separately (API doesn't include review_history in get_qa_pair response)
      let reviewHistory: any[] = []
      try {
        const reviewsUrl = `${API_BASE_URL}/api/reviews?qa_pair_id=${id}`
        const reviewsResponse = await authenticatedFetch(reviewsUrl)
        if (reviewsResponse.ok) {
          const reviewsResult = await reviewsResponse.json()
          reviewHistory = reviewsResult.data || reviewsResult.reviews || []
        }
      } catch (reviewError) {
        console.warn("[qa-store] Failed to fetch reviews, using empty array:", reviewError)
        reviewHistory = []
      }

      // Parse UTC timestamps - ensure strings ending with Z are treated as UTC
      // If no Z suffix, assume UTC and add it
      const parseUtcDate = (dateStr: string | null | undefined): Date | undefined => {
        if (!dateStr) return undefined
        // If string doesn't end with Z, assume it's UTC and add Z
        const utcString = dateStr.endsWith('Z') ? dateStr : dateStr + 'Z'
        return new Date(utcString)
      }

      return {
        id: pair.id,
        question: pair.question,
        answer: pair.answer,
        tags: Array.isArray(pair.tags)
          ? pair.tags.map((t: any) => typeof t === 'string' ? t : t.name || String(t))
          : [],
        createdAt: parseUtcDate(pair.created_at) || new Date(),
        updatedAt: parseUtcDate(pair.updated_at),
        nextReviewAt: parseUtcDate(pair.next_review_at || pair.next_review) || new Date(),
        reviewCount: pair.review_count || 0,
        reviewHistory: reviewHistory.map((r: any) => ({
          id: r.id || crypto.randomUUID(),
          reviewedAt: parseUtcDate(r.reviewed_at || r.reviewedAt || r.created_at) || new Date(),
          userAnswer: r.user_answer || r.userAnswer,
          correct: r.is_correct !== undefined ? r.is_correct : (r.correct !== undefined ? r.correct : true),
        })),
        source: pair.source || pair.source_text,
        sourceUrl: pair.source_url,
        imageUrl: pair.image,
        userId: pair.user_id,
      }
    }

    console.log(`[qa-store] Response not OK, returning null`)
    const errorData = await response.json().catch(() => ({}))
    console.log(`[qa-store] Error response:`, errorData)
    return null
  } catch (error) {
    console.error("[qa-store] Error fetching QA pair:", error)
    console.log(`[qa-store] Falling back to local storage`)
    return getLocalQAPair(id)
  }
}

// Add a new QA pair
export async function addQAPair(
  pair: Omit<QAPair, "id" | "createdAt" | "reviewCount" | "reviewHistory" | "nextReviewAt">
): Promise<QAPair> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/qa-pairs`, {
      method: "POST",
      body: JSON.stringify({
        question: pair.question,
        answer: pair.answer,
        tags: pair.tags,
        source: pair.source,
        source_url: pair.sourceUrl,
        image: pair.imageUrl,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      return {
        id: data.id,
        question: data.question,
        answer: data.answer,
        tags: Array.isArray(data.tags)
          ? data.tags.map((t: any) => typeof t === 'string' ? t : t.name || String(t))
          : [],
        createdAt: new Date(data.created_at),
        updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
        nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        reviewCount: 0,
        reviewHistory: [],
        source: data.source,
        sourceUrl: data.source_url,
        imageUrl: data.image,
        userId: data.user_id,
      }
    }

    // Fallback to local storage
    return addLocalQAPair(pair)
  } catch (error) {
    console.error("Error adding QA pair:", error)
    return addLocalQAPair(pair)
  }
}

// Update an existing QA pair
export async function updateQAPair(id: string, updates: Partial<QAPair>): Promise<QAPair | null> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/qa-pairs/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        question: updates.question,
        answer: updates.answer,
        tags: updates.tags,
        source: updates.source,
        source_url: updates.sourceUrl,
        image: updates.imageUrl,
      }),
    })

    if (response.ok) {
      const result = await response.json()
      console.log(`[qa-store] Update response:`, result)

      // Handle API response format: {success: true, data: {...}}
      const data = result.data || result

      if (!data) {
        console.log(`[qa-store] No data in update response, returning null`)
        return null
      }

      return {
        id: data.id,
        question: data.question,
        answer: data.answer,
        tags: Array.isArray(data.tags)
          ? data.tags.map((t: any) => typeof t === 'string' ? t : t.name || String(t))
          : [],
        createdAt: new Date(data.created_at),
        updatedAt: data.updated_at ? new Date(data.updated_at) : new Date(),
        nextReviewAt: updates.nextReviewAt || (data.next_review_at || data.next_review ? new Date(data.next_review_at || data.next_review) : new Date()),
        reviewCount: data.review_count || 0,
        reviewHistory: data.review_history || [],
        source: data.source || data.source_text,
        sourceUrl: data.source_url,
        imageUrl: data.image,
        userId: data.user_id,
      }
    }

    console.log(`[qa-store] Update response not OK`)
    const errorData = await response.json().catch(() => ({}))
    console.log(`[qa-store] Error response:`, errorData)
    
    // Fallback to local storage
    return updateLocalQAPair(id, updates)
  } catch (error) {
    console.error("Error updating QA pair:", error)
    return updateLocalQAPair(id, updates)
  }
}

// Delete a QA pair
export async function deleteQAPair(id: string): Promise<boolean> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/qa-pairs/${id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      return true
    }

    // Fallback to local storage
    deleteLocalQAPair(id)
    return true
  } catch (error) {
    console.error("Error deleting QA pair:", error)
    deleteLocalQAPair(id)
    return true
  }
}

// Record a review
export async function recordReview(id: string, correct: boolean, userAnswer?: string): Promise<QAPair | null> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/qa-pairs/${id}/review`, {
      method: "POST",
      body: JSON.stringify({
        correct,
        user_answer: userAnswer,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      return getQAPair(id) // Fetch updated QA pair
    }

    // Fallback to local storage
    return recordLocalReview(id, correct, userAnswer)
  } catch (error) {
    console.error("Error recording review:", error)
    return recordLocalReview(id, correct, userAnswer)
  }
}

// Get dashboard statistics
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/stats/overview`)

    if (response.ok) {
      const data = await response.json()
      return {
        totalQAPairs: data.total_qa_pairs || 0,
        reviewsDueToday: data.reviews_due_today || 0,
        totalReviewsCompleted: data.total_reviews || 0,
        averageAccuracy: data.average_accuracy || 0,
        dayStreak: data.current_streak || 0,
        activityData: data.activity_data || [],
      }
    }

    // Fallback to calculating from local data
    return getLocalDashboardStats()
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return getLocalDashboardStats()
  }
}

// Local storage fallback functions
const STORAGE_KEY = "qa_pairs"

function getLocalQAPairs(): QAPair[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []

  const pairs = JSON.parse(stored)
  return pairs.map((pair: any) => ({
    ...pair,
    createdAt: new Date(pair.createdAt),
    updatedAt: pair.updatedAt ? new Date(pair.updatedAt) : undefined,
    nextReviewAt: new Date(pair.nextReviewAt),
    reviewHistory: pair.reviewHistory.map((record: any) => ({
      ...record,
      reviewedAt: new Date(record.reviewedAt),
    })),
  }))
}

function getLocalQAPair(id: string): QAPair | null {
  const pairs = getLocalQAPairs()
  return pairs.find(p => p.id === id) || null
}

function saveLocalQAPairs(pairs: QAPair[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pairs))
}

function addLocalQAPair(
  pair: Omit<QAPair, "id" | "createdAt" | "reviewCount" | "reviewHistory" | "nextReviewAt">
): QAPair {
  const pairs = getLocalQAPairs()
  const newPair: QAPair = {
    ...pair,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    reviewCount: 0,
    reviewHistory: [],
  }
  pairs.push(newPair)
  saveLocalQAPairs(pairs)
  return newPair
}

function updateLocalQAPair(id: string, updates: Partial<QAPair>): QAPair | null {
  const pairs = getLocalQAPairs()
  const index = pairs.findIndex((p) => p.id === id)
  if (index !== -1) {
    pairs[index] = {
      ...pairs[index],
      ...updates,
      updatedAt: new Date(),
    }
    saveLocalQAPairs(pairs)
    return pairs[index]
  }
  return null
}

function deleteLocalQAPair(id: string) {
  const pairs = getLocalQAPairs()
  const filtered = pairs.filter((p) => p.id !== id)
  saveLocalQAPairs(filtered)
}

function recordLocalReview(id: string, correct: boolean, userAnswer?: string): QAPair | null {
  const pairs = getLocalQAPairs()
  const pair = pairs.find((p) => p.id === id)

  if (!pair) return null

  // Add to review history
  pair.reviewHistory.push({
    id: crypto.randomUUID(),
    reviewedAt: new Date(),
    userAnswer,
    correct,
  })

  // Increment review count
  pair.reviewCount++

  // Calculate next review date using spaced repetition
  let daysUntilNext: number
  if (correct) {
    // Increase interval based on review count
    daysUntilNext = Math.min(2 ** pair.reviewCount, 90) // Max 90 days
  } else {
    // Reset to 1 day if incorrect
    daysUntilNext = 1
  }

  pair.nextReviewAt = new Date(Date.now() + daysUntilNext * 24 * 60 * 60 * 1000)
  pair.updatedAt = new Date()

  saveLocalQAPairs(pairs)
  return pair
}

function getLocalDashboardStats(): DashboardStats {
  const pairs = getLocalQAPairs()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const reviewsDueToday = pairs.filter(p => {
    const reviewDate = new Date(p.nextReviewAt)
    reviewDate.setHours(0, 0, 0, 0)
    return reviewDate <= today
  }).length

  let totalReviews = 0
  let correctReviews = 0

  pairs.forEach(pair => {
    totalReviews += pair.reviewHistory.length
    correctReviews += pair.reviewHistory.filter(r => r.correct).length
  })

  const averageAccuracy = totalReviews > 0 ? (correctReviews / totalReviews) * 100 : 0

  // Calculate activity data for the last 30 days
  const activityData: { [key: string]: number } = {}
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  pairs.forEach(pair => {
    pair.reviewHistory.forEach(review => {
      if (review.reviewedAt >= thirtyDaysAgo) {
        const dateKey = new Date(review.reviewedAt).toISOString().split('T')[0]
        activityData[dateKey] = (activityData[dateKey] || 0) + 1
      }
    })
  })

  return {
    totalQAPairs: pairs.length,
    reviewsDueToday,
    totalReviewsCompleted: totalReviews,
    averageAccuracy,
    dayStreak: calculateDayStreak(pairs),
    activityData: Object.entries(activityData).map(([date, count]) => ({ date, count })),
  }
}

function calculateDayStreak(pairs: QAPair[]): number {
  const reviewDates = new Set<string>()

  pairs.forEach(pair => {
    pair.reviewHistory.forEach(review => {
      const dateStr = new Date(review.reviewedAt).toISOString().split('T')[0]
      reviewDates.add(dateStr)
    })
  })

  if (reviewDates.size === 0) return 0

  const sortedDates = Array.from(reviewDates).sort()
  const today = new Date().toISOString().split('T')[0]

  // Check if user reviewed today or yesterday
  const lastReviewDate = sortedDates[sortedDates.length - 1]
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  if (lastReviewDate !== today && lastReviewDate !== yesterdayStr) {
    return 0 // Streak is broken
  }

  // Count consecutive days backward from today/yesterday
  let streak = 0
  let currentDate = new Date()

  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0]
    if (reviewDates.has(dateStr)) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}
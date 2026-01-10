"use client"

import type { QAPair, BackendQAPair, BackendReview } from "./types"
import { backendToFrontendQAPair } from "./types"
import { apiClient } from "./api-client"

/**
 * Get all QA pairs from the API
 */
export async function getQAPairs(params?: { limit?: number; dueOnly?: boolean; offset?: number }): Promise<QAPair[]> {
  try {
    const response = await apiClient.getQAPairs(params)

    if (!response.success || !response.data) {
      // Don't log authentication errors as they're expected when not logged in
      if (response.error?.code !== 'AUTH_REQUIRED' && response.error?.code !== 'MISSING_TOKEN') {
        console.error("Failed to fetch QA pairs:", response.error)
      }
      return []
    }

    // Silently convert backend format to frontend format
    const converted = response.data.map((pair: BackendQAPair) => {
      try {
        return backendToFrontendQAPair(pair)
      } catch (error) {
        console.error("Error converting QA pair:", pair, error)
        throw error
      }
    })
    return converted
  } catch (error) {
    console.error("Error fetching QA pairs:", error)
    return []
  }
}

/**
 * Get a single QA pair by ID
 */
export async function getQAPair(id: number): Promise<QAPair | null> {
  try {
    const response = await apiClient.getQAPair(id)

    if (!response.success || !response.data) {
      console.error("Failed to fetch QA pair:", response.error)
      return null
    }

    // Optionally fetch reviews for this QA pair
    const reviewsResponse = await apiClient.getReviews(id)
    const reviews = reviewsResponse.success ? reviewsResponse.data : []

    return backendToFrontendQAPair(response.data, reviews)
  } catch (error) {
    console.error("Error fetching QA pair:", error)
    return null
  }
}

/**
 * Add a new QA pair
 */
export async function addQAPair(
  pair: Omit<QAPair, "id" | "createdAt" | "reviewCount" | "reviewHistory" | "nextReviewAt">
): Promise<QAPair | null> {
  try {
    const response = await apiClient.createQAPair({
      question: pair.question,
      answer: pair.answer,
      tags: pair.tags,
    })

    console.log("[addQAPair] API response:", response)

    if (!response) {
      console.error("[addQAPair] No response received")
      throw new Error("No response from server")
    }

    if (!response.success) {
      const errorMessage = response.error?.message || "Failed to save QA pair"
      console.error("[addQAPair] API returned error:", response.error)
      throw new Error(errorMessage)
    }

    if (!response.data) {
      console.error("[addQAPair] API returned success but no data:", response)
      throw new Error("Server returned success but no data")
    }

    const converted = backendToFrontendQAPair(response.data)
    console.log("[addQAPair] Successfully created QA pair:", converted)
    return converted
  } catch (error) {
    console.error("[addQAPair] Error creating QA pair:", error)
    throw error
  }
}

/**
 * Update an existing QA pair
 */
export async function updateQAPair(
  id: string,
  updates: Partial<QAPair>
): Promise<QAPair | null> {
  try {
    const numericId = parseInt(id, 10)

    const response = await apiClient.updateQAPair(numericId, {
      question: updates.question,
      answer: updates.answer,
      tags: updates.tags,
    })

    if (!response.success || !response.data) {
      console.error("Failed to update QA pair:", response.error)
      return null
    }

    return backendToFrontendQAPair(response.data)
  } catch (error) {
    console.error("Error updating QA pair:", error)
    return null
  }
}

/**
 * Delete a QA pair
 */
export async function deleteQAPair(id: string): Promise<boolean> {
  try {
    const numericId = parseInt(id, 10)
    console.log('[qa-store] Calling deleteQAPair API with ID:', numericId)
    const response = await apiClient.deleteQAPair(numericId)
    console.log('[qa-store] Delete API response:', response)

    if (!response.success) {
      console.error("[qa-store] Failed to delete QA pair:", response.error)
      return false
    }

    console.log('[qa-store] Delete successful')
    return true
  } catch (error) {
    console.error("[qa-store] Error deleting QA pair:", error)
    return false
  }
}

/**
 * Submit a review for a QA pair
 */
export async function submitReview(
  qaPairId: string,
  userAnswer: string,
  isCorrect: boolean
): Promise<boolean> {
  try {
    const numericId = parseInt(qaPairId, 10)

    const response = await apiClient.createReview({
      qa_pair_id: numericId,
      user_answer: userAnswer,
      is_correct: isCorrect,
    })

    if (!response.success) {
      console.error("Failed to submit review:", response.error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error submitting review:", error)
    return false
  }
}

/**
 * Initialize with mock data (for development/demo)
 * This is now a no-op since data comes from the backend
 */
export function initializeMockData() {
  // Mock data initialization skipped - using backend API
}

/**
 * Legacy localStorage functions (kept for backward compatibility)
 * These now just call the API equivalents
 */
export function saveQAPairs(pairs: QAPair[]) {
  console.warn("saveQAPairs is deprecated - data is automatically saved to the backend")
}

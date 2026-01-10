/**
 * Token counting utilities
 */

const TOKEN_STORAGE_KEY = 'user_token_count'

/**
 * Estimate token count from text
 * Rough estimation: ~4 characters per token
 */
export function estimateTokens(text: string): number {
  if (!text) return 0
  // Remove extra whitespace
  const cleaned = text.trim()
  // Estimate: 1 token ≈ 4 characters (this is a rough approximation)
  return Math.ceil(cleaned.length / 4)
}

/**
 * Get total token count from localStorage
 */
export function getTotalTokens(): number {
  if (typeof window === 'undefined') return 0
  const stored = localStorage.getItem(TOKEN_STORAGE_KEY)
  return stored ? parseInt(stored, 10) : 0
}

/**
 * Add tokens to the total count
 */
export function addTokens(tokens: number): void {
  if (typeof window === 'undefined') return
  const current = getTotalTokens()
  const newTotal = current + tokens
  localStorage.setItem(TOKEN_STORAGE_KEY, newTotal.toString())

  // Dispatch event to notify components
  window.dispatchEvent(new CustomEvent('tokenCountUpdated', { detail: { total: newTotal } }))
}

/**
 * Reset token count (useful for testing or user reset)
 */
export function resetTokenCount(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_STORAGE_KEY, '0')
  window.dispatchEvent(new CustomEvent('tokenCountUpdated', { detail: { total: 0 } }))
}

/**
 * Format token count for display
 */
export function formatTokenCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

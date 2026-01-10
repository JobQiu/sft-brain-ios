/**
 * API Client for communicating with Flask backend
 */

// Check if running in Capacitor environment
function isCapacitor(): boolean {
  return typeof window !== 'undefined' && !!(window as any).Capacitor
}

// Get the appropriate API base URL
function getApiBaseUrl(): string {
  // In Capacitor, always use the full URL from environment variable
  if (isCapacitor()) {
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'
  }
  // In web, use relative paths to leverage Next.js rewrites (no CORS issues)
  return '/api'
}

const API_BASE_URL = getApiBaseUrl()

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
  }
}

interface TokenInfo {
  token: string
  expiresAt: number
}

/**
 * Storage abstraction for web (localStorage) and Capacitor (Preferences API)
 */
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (typeof window === 'undefined') return null

    if (isCapacitor()) {
      try {
        const { Preferences } = await import('@capacitor/preferences')
        const { value } = await Preferences.get({ key })
        return value
      } catch {
        return null
      }
    }

    return localStorage.getItem(key)
  },

  async setItem(key: string, value: string): Promise<void> {
    if (typeof window === 'undefined') return

    if (isCapacitor()) {
      try {
        const { Preferences } = await import('@capacitor/preferences')
        await Preferences.set({ key, value })
      } catch {
        // Fallback to localStorage if Preferences API fails
        localStorage.setItem(key, value)
      }
    } else {
      localStorage.setItem(key, value)
    }
  },

  async removeItem(key: string): Promise<void> {
    if (typeof window === 'undefined') return

    if (isCapacitor()) {
      try {
        const { Preferences } = await import('@capacitor/preferences')
        await Preferences.remove({ key })
      } catch {
        // Fallback to localStorage if Preferences API fails
        localStorage.removeItem(key)
      }
    } else {
      localStorage.removeItem(key)
    }
  }
}

/**
 * Get authentication token from storage
 * Returns null if token is expired
 */
export async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null

  const tokenInfoStr = await storage.getItem('auth_token_info')
  if (!tokenInfoStr) {
    // Check for legacy token without expiration
    const legacyToken = await storage.getItem('auth_token')
    if (legacyToken) {
      // Migrate to new format with 24h expiration
      await saveAuthToken(legacyToken)
      return legacyToken
    }
    return null
  }

  try {
    const tokenInfo: TokenInfo = JSON.parse(tokenInfoStr)

    // Check if token is expired
    if (Date.now() >= tokenInfo.expiresAt) {
      await removeAuthToken()
      return null
    }

    return tokenInfo.token
  } catch {
    // Invalid token info, remove it
    await removeAuthToken()
    return null
  }
}

/**
 * Save authentication token to storage with expiration
 * Default expiration: 24 hours
 */
export async function saveAuthToken(token: string, expiresInMs: number = 24 * 60 * 60 * 1000): Promise<void> {
  if (typeof window === 'undefined') return

  const tokenInfo: TokenInfo = {
    token,
    expiresAt: Date.now() + expiresInMs
  }

  await storage.setItem('auth_token_info', JSON.stringify(tokenInfo))
  // Keep legacy token for backward compatibility
  await storage.setItem('auth_token', token)
}

/**
 * Remove authentication token from storage
 */
export async function removeAuthToken(): Promise<void> {
  if (typeof window === 'undefined') return
  await storage.removeItem('auth_token_info')
  await storage.removeItem('auth_token')
}

/**
 * Check if user is authenticated and token is valid
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken()
  return !!token
}

/**
 * Get time remaining until token expires (in milliseconds)
 * Returns 0 if token is expired or doesn't exist
 */
export async function getTokenExpiresIn(): Promise<number> {
  if (typeof window === 'undefined') return 0

  const tokenInfoStr = await storage.getItem('auth_token_info')
  if (!tokenInfoStr) return 0

  try {
    const tokenInfo: TokenInfo = JSON.parse(tokenInfoStr)
    const remaining = tokenInfo.expiresAt - Date.now()
    return remaining > 0 ? remaining : 0
  } catch {
    return 0
  }
}

/**
 * Retry configuration
 */
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 5000,  // 5 seconds
  retryableStatuses: [500, 502, 503, 504], // Server errors worth retrying
}

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Calculate exponential backoff delay
 */
function getRetryDelay(attemptNumber: number): number {
  const delay = RETRY_CONFIG.baseDelay * Math.pow(2, attemptNumber)
  return Math.min(delay, RETRY_CONFIG.maxDelay)
}

/**
 * Check if an error is retryable
 */
function isRetryableError(error: any, response?: Response): boolean {
  // Network errors are retryable (server down, connection issues)
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true
  }

  // Server errors (5xx) are retryable
  if (response && RETRY_CONFIG.retryableStatuses.includes(response.status)) {
    return true
  }

  return false
}

/**
 * Make an API request with authentication and retry logic
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = await getAuthToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Retry loop
  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle 401 Unauthorized - token expired or missing (don't retry)
        if (response.status === 401) {
          await removeAuthToken()
          return {
            success: false,
            error: {
              message: data.error?.message || 'Authentication required',
              code: 'AUTH_REQUIRED',
            },
          }
        }

        // Check if we should retry server errors
        if (isRetryableError(null, response) && attempt < RETRY_CONFIG.maxRetries) {
          const delay = getRetryDelay(attempt)
          console.log(`API request failed with ${response.status}, retrying in ${delay}ms (attempt ${attempt + 1}/${RETRY_CONFIG.maxRetries})`)
          await sleep(delay)
          continue
        }

        // Other errors (don't retry)
        return {
          success: false,
          error: {
            message: data.error?.message || `HTTP error ${response.status}`,
            code: `HTTP_${response.status}`,
          },
        }
      }

      return data
    } catch (error) {
      // Network errors - retry if attempts remaining
      if (isRetryableError(error) && attempt < RETRY_CONFIG.maxRetries) {
        const delay = getRetryDelay(attempt)
        console.log(`Network error, retrying in ${delay}ms (attempt ${attempt + 1}/${RETRY_CONFIG.maxRetries})`)
        await sleep(delay)
        continue
      }

      // Final attempt failed or non-retryable error
      console.error('API request failed:', error)
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Network error',
          code: 'NETWORK_ERROR',
        },
      }
    }
  }

  // Should never reach here, but TypeScript needs it
  return {
    success: false,
    error: {
      message: 'Maximum retries exceeded',
      code: 'MAX_RETRIES',
    },
  }
}

/**
 * API Client methods
 */
export const apiClient = {
  // Authentication
  async login(email: string, password: string) {
    return apiRequest<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  async register(email: string, password: string) {
    return apiRequest<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  async logout() {
    await removeAuthToken()
    return { success: true }
  },

  // QA Pairs
  async fetchQAPairs() {
    const response = await apiRequest<any[]>('/qa-pairs', {
      method: 'GET',
    })
    return response.data || []
  },

  async getQAPairs(params?: { limit?: number; dueOnly?: boolean; offset?: number }) {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.dueOnly) queryParams.append('due_only', 'true')
    if (params?.offset) queryParams.append('offset', params.offset.toString())

    const url = queryParams.toString() ? `/qa-pairs?${queryParams.toString()}` : '/qa-pairs'
    return apiRequest<any[]>(url, {
      method: 'GET',
    })
  },

  async getQAPair(id: number) {
    return apiRequest<any>(`/qa-pairs/${id}`, {
      method: 'GET',
    })
  },

  async createQAPair(data: {
    question: string;
    answer: string;
    tags?: string[];
    image?: string | null;
    sourceUrl?: string | null;
  }) {
    return apiRequest<any>('/qa-pairs', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateQAPair(id: number | string, data: Partial<{
    question: string;
    answer: string;
    tags: string[];
    image?: string | null;
  }>) {
    return apiRequest<any>(`/qa-pairs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async deleteQAPair(id: number) {
    return apiRequest<void>(`/qa-pairs/${id}`, {
      method: 'DELETE',
    })
  },

  // Reviews
  async getReviews(qaPairId?: number) {
    const endpoint = qaPairId ? `/reviews?qa_pair_id=${qaPairId}` : '/reviews'
    return apiRequest<any[]>(endpoint, {
      method: 'GET',
    })
  },

  async createReview(data: {
    qa_pair_id: number
    user_answer: string
    is_correct: boolean
  }) {
    return apiRequest<any>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Tags
  async getTags() {
    return apiRequest<any[]>('/tags', {
      method: 'GET',
    })
  },

  async createTag(name: string) {
    return apiRequest<any>('/tags', {
      method: 'POST',
      body: JSON.stringify({ name }),
    })
  },
}

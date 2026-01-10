import { NextRequest, NextResponse } from 'next/server'
import { mockAPI } from '@/lib/mock'

export const dynamic = 'force-static'

// Helper to get user ID from auth header or default to demo user
function getUserId(request: NextRequest): string {
  try {
    // In a real app, decode JWT from Authorization header
    // For mock, we'll map common test users to their IDs
    const authHeader = request.headers.get('authorization')

    // Default to demo user (user-2) for development
    return 'user-2'
  } catch (error) {
    return 'user-2' // Default to demo user
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user ID from auth
    const userId = getUserId(request)

    // Fetch dashboard stats from mock API
    const stats = await mockAPI.getDashboardStats(userId)

    return NextResponse.json(stats, { status: 200 })
  } catch (error) {
    console.error('Error in /api/stats/overview:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}

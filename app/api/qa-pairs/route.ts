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
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const dueOnly = searchParams.get('due_only') === 'true'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined

    // Get user ID from auth
    const userId = getUserId(request)

    // Fetch QA pairs from mock API
    const qaPairs = await mockAPI.getQAPairs(userId, {
      due_only: dueOnly,
      limit,
      offset,
    })

    return NextResponse.json(qaPairs, { status: 200 })
  } catch (error) {
    console.error('Error in /api/qa-pairs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch QA pairs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Get user ID from auth
    const userId = getUserId(request)

    // Create new QA pair
    const newQAPair = await mockAPI.createQAPair({
      ...body,
      userId,
    })

    return NextResponse.json(newQAPair, { status: 201 })
  } catch (error) {
    console.error('Error creating QA pair:', error)
    return NextResponse.json(
      { error: 'Failed to create QA pair' },
      { status: 500 }
    )
  }
}

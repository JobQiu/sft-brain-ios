import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-static'

export async function GET(request: NextRequest) {
  try {
    // Return mock settings data
    const settings = {
      ai_scoring_prompt: `You are an AI assistant helping to score answers in a spaced repetition learning system.

Compare the user's answer with the correct answer and provide:
1. A score: "correct", "partial", or "incorrect"
2. Brief feedback explaining the score

Be lenient with minor wording differences but ensure key concepts are covered.`,
      daily_review_goal: 20,
      enable_notifications: true,
      theme: 'system',
    }

    return NextResponse.json(
      {
        success: true,
        data: settings,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in /api/settings:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch settings'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // In a real app, this would save to database
    // For mock, just return success
    return NextResponse.json(
      {
        success: true,
        data: body,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update settings'
      },
      { status: 500 }
    )
  }
}

"use client"

import { useState, useEffect, useRef } from "react"
import { getQAPairs, recordReview } from "@/lib/mobile/qa-store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, MessageSquare, Mic, MicOff, Brain, History } from "lucide-react"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { ReviewBadges } from "@/components/review-badges"
import { useRouter } from "next/navigation"
import type { QAPair } from "@/lib/mobile/types"

// Helper function to format review date from UTC to local timezone
// Shows only date if reviews are on the same day, otherwise shows date and time
function formatReviewDate(isoString: string, allReviews: ReviewHistory[]): string {
  // Ensure the ISO string is treated as UTC if it doesn't have timezone info
  const dateStr = isoString.endsWith('Z') || isoString.includes('+') || isoString.includes('-', 19)
    ? isoString
    : isoString + 'Z'
  const date = new Date(dateStr)
  
  // Check if all reviews are on the same day
  const allSameDay = allReviews.length > 0 && allReviews.every(r => {
    if (!r.reviewed_at) return false
    const rDateStr = r.reviewed_at.endsWith('Z') || r.reviewed_at.includes('+') || r.reviewed_at.includes('-', 19)
      ? r.reviewed_at
      : r.reviewed_at + 'Z'
    const rDate = new Date(rDateStr)
    return rDate.toDateString() === date.toDateString()
  })
  
  // If all reviews are on the same day, show only date
  if (allSameDay) {
    return date.toLocaleDateString()
  }
  
  // Otherwise show date and time
  return date.toLocaleString()
}

interface ReviewHistory {
  id: string
  reviewed_at: string
  user_answer?: string
  ai_feedback?: string
  score?: number
}

export default function MobileReviewPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [reviewQueue, setReviewQueue] = useState<QAPair[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [spokenAnswer, setSpokenAnswer] = useState("")
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [aiScoringPrompt, setAiScoringPrompt] = useState<string | null>(null)
  const [reviewHistory, setReviewHistory] = useState<ReviewHistory[]>([])
  const [isLoadingReviews, setIsLoadingReviews] = useState(false)
  const [badgeProgress, setBadgeProgress] = useState<any>(null)
  const [isLoadingBadges, setIsLoadingBadges] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Add waveform animation styles
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes waveform {
        0%, 100% { transform: scaleY(1); }
        50% { transform: scaleY(1.8); }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    const loadReviewQueue = async () => {
      setLoading(true)
      try {
        // Fetch AI scoring prompt from settings
        try {
          const token = localStorage.getItem('auth_token')
          const settingsResponse = await fetch('/api/settings', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          const settingsData = await settingsResponse.json()
          if (settingsData.success && settingsData.data) {
            setAiScoringPrompt(settingsData.data.ai_scoring_prompt)
          }
        } catch (error) {
          console.error('Failed to load settings:', error)
        }

        const pairs = await getQAPairs()
        const now = new Date()
        const dueQAs = pairs.filter((qa) => {
          if (!qa.nextReviewAt) return true
          return new Date(qa.nextReviewAt) <= now
        })

        // If no QAs are due, show recently created QAs for practice
        const queueToReview = dueQAs.length > 0 ? dueQAs : pairs.slice(0, 10)
        setReviewQueue(queueToReview)
      } catch (error) {
        console.error("Error loading review queue:", error)
      } finally {
        setLoading(false)
      }
    }

    loadReviewQueue()
  }, [])

  // Cleanup: stop recording when component unmounts
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const currentQA = reviewQueue[currentIndex]

  // Load review history and badge progress when current QA changes
  useEffect(() => {
    const abortController = new AbortController()
    
    const loadReviewData = async () => {
      if (!currentQA) {
        setReviewHistory([])
        setBadgeProgress(null)
        return
      }

      // Load review history
      setIsLoadingReviews(true)
      try {
        const token = localStorage.getItem('auth_token')
        const response = await fetch(`/api/reviews?qa_pair_id=${currentQA.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: abortController.signal,
        })
        const data = await response.json()
        console.log('[Mobile Review] Review history response:', data)

        if (data.status === 'success' && data.reviews) {
          // Deduplicate reviews by ID
          const uniqueReviews = data.reviews.filter((review: ReviewHistory, index: number, self: ReviewHistory[]) => 
            index === self.findIndex((r: ReviewHistory) => r.id === review.id)
          )
          // Show all reviews (including low scores and same-day reviews)
          // Badge calculation will only count one review per day
          setReviewHistory(uniqueReviews)
          console.log('[Mobile Review] Loaded', uniqueReviews.length, 'unique reviews (all reviews shown, badge counts one per day)')
        } else {
          setReviewHistory([])
        }
      } catch (error: any) {
        // Ignore abort errors
        if (error.name === 'AbortError') {
          console.log('[Mobile Review] Request aborted')
          return
        }
        console.error('[Mobile Review] Failed to load review history:', error)
        setReviewHistory([])
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoadingReviews(false)
        }
      }

      // Load badge progress
      setIsLoadingBadges(true)
      try {
        const token = localStorage.getItem('auth_token')
        const response = await fetch(`/api/review/qa/${currentQA.id}/badge-progress`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: abortController.signal,
        })
        const data = await response.json()
        console.log('[Mobile Review] Badge progress response:', data)
        console.log('[Mobile Review] Response status:', response.status)
        console.log('[Mobile Review] Data success:', data.success)
        console.log('[Mobile Review] Data.data:', data.data)

        if (!response.ok) {
          console.error('[Mobile Review] Badge progress API error:', response.status, data)
          if (data.error) {
            console.error('[Mobile Review] Error details:', data.error)
          }
          setBadgeProgress(null)
          return
        }

        if (data.success && data.data) {
          console.log('[Mobile Review] Setting badge progress:', data.data)
          setBadgeProgress(data.data)
        } else {
          console.log('[Mobile Review] No badge progress data, setting to null')
          setBadgeProgress(null)
        }
      } catch (error: any) {
        // Ignore abort errors
        if (error.name === 'AbortError') {
          console.log('[Mobile Review] Badge progress request aborted')
          return
        }
        console.error('[Mobile Review] Failed to load badge progress:', error)
        setBadgeProgress(null)
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoadingBadges(false)
        }
      }
    }

    loadReviewData()

    // Cleanup: abort requests if component unmounts or dependency changes
    return () => {
      abortController.abort()
    }
  }, [currentQA?.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading review queue...</p>
        </div>
      </div>
    )
  }

  if (reviewQueue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] p-4 text-center">
        <Brain className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Reviews Due</h2>
        <p className="text-muted-foreground mb-6">
          Great job! All your QA pairs are up to date.
          <br />
          Add more QA pairs to keep learning.
        </p>
        <div className="space-y-2 w-full max-w-xs">
          <Button onClick={() => router.push("/mobile/add")} className="w-full">
            Add QA Pair
          </Button>
          <Button onClick={() => router.push("/mobile")} variant="outline" className="w-full">
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  const handleResponse = async (correct: boolean) => {
    setSaving(true)
    try {
      await recordReview(currentQA.id, correct)

      // Stop recording if active
      if (isRecording && mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
        setIsRecording(false)
      }

      if (currentIndex < reviewQueue.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setShowAnswer(false)
        setSpokenAnswer("")
      } else {
        // Review session complete - return to QA tab
        router.push("/mobile/qa")
      }
    } catch (error) {
      console.error("Error recording review:", error)
      alert("Failed to save review. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const toggleVoiceInput = async () => {
    if (isRecording) {
      // Stop recording and transcribe
      setIsRecording(false)
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
      }
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

        audioChunksRef.current = []
        const mediaRecorder = new MediaRecorder(stream)

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data)
          }
        }

        mediaRecorder.onstop = async () => {
          setIsTranscribing(true)

          try {
            // Create audio blob
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
            console.log('[Voice] Audio blob created, size:', audioBlob.size, 'bytes')

            // Send to backend for transcription
            const formData = new FormData()
            formData.append('audio', audioBlob, 'recording.webm')
            formData.append('language', 'en')

            const authToken = localStorage.getItem('auth_token')
            console.log('[Voice] Sending transcription request to /api/transcribe/audio')

            const response = await fetch('/api/transcribe/audio', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${authToken}`
              },
              body: formData
            })

            console.log('[Voice] Response status:', response.status)

            if (!response.ok) {
              throw new Error('Transcription failed')
            }

            const data = await response.json()
            console.log('[Voice] Transcription response:', data)

            if (data.success) {
              console.log('[Voice] Transcribed text:', data.data.text)
              setSpokenAnswer((prev) => prev + data.data.text + ' ')
            } else {
              console.error('[Voice] Transcription failed:', data.error)
              alert('Failed to transcribe audio. Please try again.')
            }
          } catch (error) {
            console.error('Transcription error:', error)
            alert('Failed to transcribe audio. Please try again.')
          } finally {
            setIsTranscribing(false)

            // Stop all tracks
            stream.getTracks().forEach(track => track.stop())
          }
        }

        mediaRecorderRef.current = mediaRecorder
        mediaRecorder.start()
        setIsRecording(true)

      } catch (error) {
        console.error('Error accessing microphone:', error)
        alert('Microphone access denied. Please enable microphone permissions.')
      }
    }
  }

  const handleChatGPT = () => {
    if (!currentQA) return

    // Build the full prompt using the AI scoring prompt template
    const promptTemplate = aiScoringPrompt || `You are an expert tutor evaluating a student's answer.

Compare the student's answer with the reference answer and provide:
1. A score from 0-100 (60+ is passing)
2. Specific feedback on accuracy, completeness, and clarity
3. Suggestions for improvement

Be constructive but maintain high standards.`

    // Format the complete prompt with flashcard ID, question, answer, and user answer
    const fullPrompt = `${promptTemplate}

---
Flashcard ID: ${currentQA.id}

Question: ${currentQA.question}

Reference Answer: ${currentQA.answer}

Student's Answer: ${spokenAnswer || "(No answer provided yet)"}

---
INSTRUCTIONS FOR CHATGPT:
After evaluating the student's answer, please use the "rate_flashcard_response" tool to save the review.

Required parameters:
- flashcard_id: "${currentQA.id}" (use this exact ID)
- user_answer: The student's answer shown above
- score: Your evaluation score (0-100)
- feedback: Your detailed feedback explaining the score

This will automatically:
✓ Save the review to the database
✓ Update the spaced repetition schedule
✓ Track learning progress

Do NOT use "add_flashcard" - that would create a duplicate. Always use "rate_flashcard_response" to record reviews.`

    const query = encodeURIComponent(fullPrompt)
    window.open(`https://chat.openai.com/?q=${query}`, "_blank")
  }

  const progress = ((currentIndex + 1) / reviewQueue.length) * 100

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="sticky top-0 bg-background border-b border-border z-10">
        <div className="h-1 bg-accent">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-medium">
            Question {currentIndex + 1} of {reviewQueue.length}
          </span>
          <Button variant="ghost" size="sm" onClick={() => router.push("/mobile/qa")}>
            Exit
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <Card className="p-6 mb-4">
          <div className="mb-4">
            {currentQA.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {currentQA.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h2 className="text-xl font-bold">
              {currentQA.question.split("\n")[0].replace(/^#+\s*/, "")}
            </h2>
            {currentQA.question.split("\n").length > 1 && (
              <p className="mt-2 text-muted-foreground text-sm">
                {currentQA.question.split("\n").slice(1).join("\n")}
              </p>
            )}
          </div>

          {/* Voice Input Section - Always visible */}
          <div className="space-y-4 py-4 border-t">
            <div className="space-y-3">
              <Button
                onClick={toggleVoiceInput}
                variant={isRecording ? "destructive" : "outline"}
                size="lg"
                className="w-full"
                disabled={isTranscribing}
              >
                {isTranscribing ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Converting to text...
                  </>
                ) : (
                  <>
                    <Mic className={`w-5 h-5 mr-2 ${isRecording ? 'animate-pulse' : ''}`} />
                    Record Answer
                  </>
                )}
              </Button>

              {/* Recording Indicator - Animated Waveform */}
              {isRecording && (
                <div className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 rounded-lg border-2 border-red-200 dark:border-red-800">
                  <div className="flex items-end gap-1 h-10">
                    {[
                      { height: 16, delay: 0 },
                      { height: 24, delay: 0.1 },
                      { height: 12, delay: 0.2 },
                      { height: 28, delay: 0.3 },
                      { height: 20, delay: 0.4 },
                      { height: 32, delay: 0.5 },
                      { height: 18, delay: 0.6 },
                      { height: 26, delay: 0.7 },
                      { height: 14, delay: 0.8 },
                      { height: 30, delay: 0.9 },
                      { height: 22, delay: 1.0 },
                      { height: 16, delay: 1.1 },
                    ].map((bar, index) => (
                      <div
                        key={index}
                        className="w-1 bg-gradient-to-t from-red-500 to-red-600 dark:from-red-600 dark:to-red-500 rounded-full"
                        style={{
                          height: `${bar.height}px`,
                          animation: `waveform 1.2s ease-in-out infinite`,
                          animationDelay: `${bar.delay}s`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    Recording...
                  </span>
                </div>
              )}
            </div>

            {/* Show spoken answer if any */}
            {spokenAnswer && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Your Answer:</h3>
                  <button
                    onClick={() => setSpokenAnswer("")}
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    Clear
                  </button>
                </div>
                <p className="text-sm">{spokenAnswer}</p>
              </div>
            )}
          </div>

          {/* Action Buttons Section */}
          <div className="space-y-3 py-4">
            <Button
              onClick={handleChatGPT}
              size="lg"
              className="w-full gap-2 h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <svg className="h-5 w-5" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z" fill="currentColor"/>
              </svg>
              Discuss with ChatGPT
            </Button>

            {!showAnswer && (
              <Button onClick={() => setShowAnswer(true)} size="lg" className="w-full">
                Show Answer
              </Button>
            )}
          </div>

          {/* Answer Section */}
          {showAnswer && (
            <div className="space-y-4 py-4 border-t">

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Correct Answer:</h3>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <MarkdownRenderer content={currentQA.answer} />
                </div>
              </div>

              {/* Next Question Button */}
              <div className="pt-4">
                <Button
                  onClick={() => {
                    if (currentIndex < reviewQueue.length - 1) {
                      setCurrentIndex(currentIndex + 1)
                      setShowAnswer(false)
                      setSpokenAnswer("")
                    } else {
                      router.push("/mobile/qa")
                    }
                  }}
                  size="lg"
                  className="w-full"
                >
                  {currentIndex < reviewQueue.length - 1 ? "Next Question" : "Finish Review"}
                </Button>
              </div>
            </div>
          )}
        </Card>

        {showAnswer && currentIndex === reviewQueue.length - 1 && (
          <Card className="p-4 bg-muted/50">
            <p className="text-sm text-center text-muted-foreground">
              This is the last question in your review session!
            </p>
          </Card>
        )}

        {/* Review History Section */}
        {currentQA && (
          <Card className="mt-4 border-blue-200 dark:border-blue-800">
            <div className="p-4">
              <div className="mb-3 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <History className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Previous Reviews
                    {isLoadingReviews && (
                      <span className="text-xs text-muted-foreground ml-2">(Loading...)</span>
                    )}
                    {!isLoadingReviews && (
                      <span className="text-xs text-muted-foreground ml-2">
                        ({reviewHistory.length} {reviewHistory.length === 1 ? 'attempt' : 'attempts'})
                      </span>
                    )}
                  </h3>
                </div>
                {/* Badge Progress */}
                {isLoadingBadges && (
                  <div className="text-xs text-muted-foreground">Loading badges...</div>
                )}
                {!isLoadingBadges && badgeProgress && (
                  <div className="w-full">
                    <ReviewBadges
                      milestones={badgeProgress.milestones || []}
                      progressPercentage={badgeProgress.progress_percentage || 0}
                      intervals={badgeProgress.intervals || []}
                    />
                  </div>
                )}
                {!isLoadingBadges && !badgeProgress && (
                  <div className="text-xs text-muted-foreground">No badge data available</div>
                )}
              </div>

              {reviewHistory.length > 0 ? (
                <div className="space-y-3">
                  {reviewHistory.map((review) => (
                    <div
                      key={review.id}
                      className="border border-border rounded-lg p-3 bg-card/50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatReviewDate(review.reviewed_at, reviewHistory)}
                        </span>
                        {review.score !== null && review.score > 0 && (
                          <Badge
                            variant={review.score >= 0.6 ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {Math.round(review.score * 100)}/100
                          </Badge>
                        )}
                        {review.score === 0 && (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            No score
                          </Badge>
                        )}
                      </div>
                      {review.user_answer && (
                        <div className="text-sm">
                          <p className="text-muted-foreground text-xs mb-1">Your answer:</p>
                          <p className="text-foreground">{review.user_answer}</p>
                        </div>
                      )}
                      {review.ai_feedback && (
                        <div className="text-sm">
                          <p className="text-muted-foreground text-xs mb-1">AI Feedback:</p>
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <MarkdownRenderer content={review.ai_feedback} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : !isLoadingReviews ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No previous reviews yet. This is your first attempt!
                </p>
              ) : null}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
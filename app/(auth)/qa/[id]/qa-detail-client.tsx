"use client"

import { useParams, useRouter } from "next/navigation"
import { getQAPair, deleteQAPair, updateQAPair } from "@/lib/mobile/qa-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Edit, Trash2, Calendar, Brain, Clock, Link as LinkIcon, Package } from "lucide-react"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { useEffect, useState } from "react"
import type { QAPair } from "@/lib/mobile/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function QADetailClient() {
  const params = useParams()
  const router = useRouter()
  const [qa, setQa] = useState<QAPair | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const loadQA = async () => {
      console.log(`[QA Detail] Starting to load QA pair with ID: ${params.id}`)
      setLoading(true)
      try {
        const foundQa = await getQAPair(params.id as string)
        console.log(`[QA Detail] Received QA data:`, foundQa)

        if (foundQa) {
          console.log(`[QA Detail] QA found - ID: ${foundQa.id}, has question: ${!!foundQa.question}, has answer: ${!!foundQa.answer}`)
          setQa(foundQa)
        } else {
          console.log(`[QA Detail] QA is null or undefined`)
          setQa(null)
        }
      } catch (error) {
        console.error("[QA Detail] Error loading QA:", error)
        setQa(null)
      } finally {
        setLoading(false)
      }
    }

    loadQA()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!qa || !qa.question || !qa.answer) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] p-4">
        <p className="text-muted-foreground mb-4">QA not found or incomplete data</p>
        <Button onClick={() => router.push("/mobile/qa")}>Back to QA List</Button>
      </div>
    )
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteQAPair(qa.id)
      router.push("/mobile")
    } catch (error) {
      console.error("Error deleting QA:", error)
      alert("Failed to delete QA pair. Please try again.")
      setDeleting(false)
    }
  }

  const handleEdit = () => {
    router.push(`/mobile/qa/${params.id}/edit`)
  }

  const formatDate = (date: Date | string) => {
    // Ensure we parse as UTC if it's a string
    // If it's already a Date object, it's already parsed correctly
    let utcDate: Date
    if (typeof date === 'string') {
      // If string ends with Z, it's UTC; otherwise assume UTC
      const utcString = date.endsWith('Z') ? date : date + 'Z'
      utcDate = new Date(utcString)
    } else {
      utcDate = date
    }
    
    // toLocaleDateString automatically converts UTC to user's local timezone
    return utcDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (date: Date | string) => {
    // Ensure we parse as UTC if it's a string
    // If it's already a Date object, it's already parsed correctly
    let utcDate: Date
    if (typeof date === 'string') {
      // If string ends with Z, it's UTC; otherwise assume UTC
      const utcString = date.endsWith('Z') ? date : date + 'Z'
      utcDate = new Date(utcString)
    } else {
      utcDate = date
    }
    
    // toLocaleTimeString automatically converts UTC to user's local timezone
    return utcDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="sticky top-0 bg-background border-b border-border z-10">
          <div className="flex items-center justify-between px-4 h-14">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={handleEdit}>
                <Edit className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="w-5 h-5 text-destructive" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
          {/* Question Section */}
          <div>
            <h1 className="text-2xl font-bold mb-4">{qa.question.split("\n")[0].replace(/^#+\s*/, "")}</h1>
            {qa.question.split("\n").length > 1 && (
              <p className="text-muted-foreground mb-4">{qa.question.split("\n").slice(1).join("\n")}</p>
            )}
            {qa.tags && Array.isArray(qa.tags) && qa.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {qa.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Answer Card */}
          <Card className="p-4">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">ANSWER</h2>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <MarkdownRenderer content={qa.answer} />
            </div>
          </Card>

          {/* Source Information */}
          {(qa.source || qa.sourceUrl) && (
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-muted-foreground">SOURCE</h3>
                {qa.source && (
                  <div className="flex items-center gap-1.5">
                    {qa.source.toLowerCase() === 'extension' ? (
                      <>
                        <Package className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Chrome Extension</span>
                      </>
                    ) : (
                      <span className="text-sm font-medium">{qa.source}</span>
                    )}
                  </div>
                )}
                {qa.sourceUrl && (
                  <a
                    href={qa.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline ml-auto"
                  >
                    <LinkIcon className="w-3 h-3" />
                    Source Link
                  </a>
                )}
              </div>
            </Card>
          )}

          {/* Statistics Card */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">STATISTICS</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">Created</span>
                </div>
                <div className="font-medium text-sm">{formatDate(qa.createdAt)}</div>
                <div className="text-xs text-muted-foreground">{formatTime(qa.createdAt)}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Brain className="w-4 h-4" />
                  <span className="text-xs">Reviews</span>
                </div>
                <div className="font-medium text-sm">{qa.reviewCount}</div>
                <div className="text-xs text-muted-foreground">
                  {qa.reviewHistory.filter((r) => r.correct).length} correct
                </div>
              </div>
              <div className="col-span-2 space-y-1 pt-2 border-t">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs">Next Review</span>
                </div>
                <div className="font-medium text-sm">{formatDate(qa.nextReviewAt)}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(qa.nextReviewAt) > new Date() ? "Scheduled" : "Due for review"}
                </div>
              </div>
            </div>
          </Card>

          {/* Review History */}
          {qa.reviewHistory.length > 0 && (
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                RECENT REVIEWS ({qa.reviewHistory.length} total)
              </h3>
              <div className="space-y-2">
                {qa.reviewHistory
                  .slice(-5)
                  .reverse()
                  .map((review, idx) => (
                    <div key={review.id || idx} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="text-sm">
                        <div className="font-medium">{formatDate(review.reviewedAt)}</div>
                        <div className="text-xs text-muted-foreground">{formatTime(review.reviewedAt)}</div>
                      </div>
                      <Badge variant={review.correct ? "default" : "destructive"} className="text-xs">
                        {review.correct ? "Correct" : "Incorrect"}
                      </Badge>
                    </div>
                  ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this QA pair and all its review history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-destructive-foreground">
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

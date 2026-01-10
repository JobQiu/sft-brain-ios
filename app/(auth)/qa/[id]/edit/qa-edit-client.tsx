"use client"

import { useParams, useRouter } from "next/navigation"
import { getQAPair, updateQAPair } from "@/lib/mobile/qa-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, X } from "lucide-react"
import { MarkdownEditor } from "@/components/markdown-editor"
import { useEffect, useState } from "react"
import type { QAPair } from "@/lib/mobile/types"

export function QAEditClient() {
  const params = useParams()
  const router = useRouter()
  const [qa, setQa] = useState<QAPair | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  useEffect(() => {
    const loadQA = async () => {
      setLoading(true)
      try {
        const foundQa = await getQAPair(params.id as string)
        if (foundQa) {
          setQa(foundQa)
          setQuestion(foundQa.question)
          setAnswer(foundQa.answer)
          setTags(foundQa.tags || [])
        } else {
          setError("QA pair not found")
        }
      } catch (error) {
        console.error("[QA Edit] Error loading QA:", error)
        setError("Failed to load QA pair")
      } finally {
        setLoading(false)
      }
    }

    loadQA()
  }, [params.id])

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSave = async () => {
    if (!question.trim() || !answer.trim()) {
      setError("Question and answer are required")
      return
    }

    setSaving(true)
    setError(null)

    try {
      const result = await updateQAPair(params.id as string, {
        question,
        answer,
        tags,
      })

      if (result) {
        // Navigate back to detail page
        router.push(`/qa/${params.id}`)
      } else {
        setError("Failed to save changes. Please try again.")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      console.error("Error updating QA pair:", err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error && !qa) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] p-4">
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => router.push("/qa")}>Back to QA List</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 bg-background border-b border-border z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Edit QA</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="question">Question (Markdown supported)</Label>
          <MarkdownEditor value={question} onChange={setQuestion} placeholder="Enter your question..." hideTip />
        </div>

        <div className="space-y-2">
          <Label htmlFor="answer">Answer (Markdown supported)</Label>
          <MarkdownEditor value={answer} onChange={setAnswer} placeholder="Enter the answer..." hideTip />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
              placeholder="Add a tag..."
            />
            <Button type="button" onClick={handleAddTag} variant="outline" disabled={saving}>
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:bg-muted rounded-full"
                    disabled={saving}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 bg-background border-t border-border p-4">
        <div className="flex gap-2">
          <Button onClick={() => router.back()} variant="outline" disabled={saving} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !question.trim() || !answer.trim()} className="flex-1">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}

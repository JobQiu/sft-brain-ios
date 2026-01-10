"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, Plus, Image as ImageIcon, Mic, MicOff, Sparkles, Link as LinkIcon, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { addQAPair } from "@/lib/mobile/qa-store"
import { Card } from "@/components/ui/card"
import { MarkdownRenderer } from "@/components/markdown-renderer"

export default function MobileAddQAPage() {
  const router = useRouter()
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [saving, setSaving] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTarget, setRecordingTarget] = useState<'question' | 'answer' | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showImportSection, setShowImportSection] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const questionTextareaRef = useRef<HTMLTextAreaElement>(null)
  const answerTextareaRef = useRef<HTMLTextAreaElement>(null)

  // Cleanup: stop recording when component unmounts
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSave = async () => {
    if (question.trim() && answer.trim()) {
      setSaving(true)
      try {
        await addQAPair({
          question: question.trim(),
          answer: answer.trim(),
          tags,
        })
        router.push("/mobile")
      } catch (error) {
        console.error("Error saving QA pair:", error)
        alert("Failed to save QA pair. Please try again.")
      } finally {
        setSaving(false)
      }
    }
  }

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success && data.data) {
        const imageUrl = data.data.url
        const imageMarkdown = `![${file.name}](${imageUrl})`
        
        // Insert into question field if focused, otherwise answer
        const targetTextarea = document.activeElement === questionTextareaRef.current 
          ? questionTextareaRef.current 
          : answerTextareaRef.current || questionTextareaRef.current
        
        if (targetTextarea) {
          const start = targetTextarea.selectionStart
          const end = targetTextarea.selectionEnd
          const currentValue = targetTextarea === questionTextareaRef.current ? question : answer
          const newValue = currentValue.substring(0, start) + imageMarkdown + currentValue.substring(end)
          
          if (targetTextarea === questionTextareaRef.current) {
            setQuestion(newValue)
          } else {
            setAnswer(newValue)
          }
          
          setTimeout(() => {
            targetTextarea.focus()
            targetTextarea.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length)
          }, 0)
        }
      } else {
        alert('Failed to upload image: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Handle paste image
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]

      if (item.type.indexOf('image') !== -1) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) {
          const fakeEvent = {
            target: { files: [file] }
          } as React.ChangeEvent<HTMLInputElement>
          await handleImageUpload(fakeEvent)
        }
        break
      }
    }
  }

  // Handle voice input
  const toggleVoiceInput = async (target: 'question' | 'answer') => {
    if (isRecording) {
      // Stop recording only if it's for the same target
      if (recordingTarget === target) {
        setIsRecording(false)
        setRecordingTarget(null)
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop()
        }
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
          const currentTarget = recordingTarget
          try {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
            const formData = new FormData()
            formData.append('audio', audioBlob, 'recording.webm')
            formData.append('language', 'en')

            const authToken = localStorage.getItem('auth_token')
            const response = await fetch('/api/transcribe/audio', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${authToken}`
              },
              body: formData
            })

            if (!response.ok) {
              throw new Error('Transcription failed')
            }

            const data = await response.json()
            if (data.success) {
              const transcribedText = data.data.text
              if (currentTarget === 'question') {
                setQuestion((prev) => prev + (prev ? ' ' : '') + transcribedText)
              } else if (currentTarget === 'answer') {
                setAnswer((prev) => prev + (prev ? ' ' : '') + transcribedText)
              }
            } else {
              alert('Failed to transcribe audio. Please try again.')
            }
          } catch (error) {
            console.error('Transcription error:', error)
            alert('Failed to transcribe audio. Please try again.')
          } finally {
            setIsTranscribing(false)
            setRecordingTarget(null)
            stream.getTracks().forEach(track => track.stop())
          }
        }

        mediaRecorderRef.current = mediaRecorder
        mediaRecorder.start()
        setIsRecording(true)
        setRecordingTarget(target)
      } catch (error) {
        console.error('Error accessing microphone:', error)
        alert('Microphone access denied. Please enable microphone permissions.')
      }
    }
  }

  // Generate answer from question
  const handleGenerateAnswer = async () => {
    if (!question.trim()) {
      alert('Please enter a question first')
      return
    }

    setIsGenerating(true)
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/qa-pairs/generate-from-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          question: question.trim(),
        })
      })

      const data = await response.json()

      if (data.success && data.data) {
        setAnswer(data.data.answer || '')
        if (data.data.tags && Array.isArray(data.data.tags)) {
          setTags(data.data.tags)
        }
      } else {
        alert('Failed to generate answer: ' + (data.error?.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error generating answer:', error)
      alert('Failed to generate answer. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }


  return (
    <div className="flex flex-col h-full bg-background">
      <div className="sticky top-0 bg-background border-b border-border z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-accent transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Add Flashcard</h1>
          <Button
            onClick={handleSave}
            disabled={!question.trim() || !answer.trim() || saving}
            size="sm"
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {/* ChatGPT @flashcards Instructions */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              How to use ChatGPT @flashcards
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowImportSection(!showImportSection)}
            >
              {showImportSection ? 'Hide' : 'Show'}
            </Button>
          </div>
          {showImportSection && (
            <div className="bg-muted/50 p-3 rounded-lg space-y-2">
              <p className="text-xs font-medium">Steps to create flashcards in ChatGPT:</p>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Open ChatGPT app and start a conversation</li>
                <li>Type <code className="bg-background px-1 py-0.5 rounded text-xs">@flashcards</code> to use the flashcards feature</li>
                <li>Use the <code className="bg-background px-1 py-0.5 rounded text-xs">add_flashcard</code> method to create flashcards</li>
                <li>The flashcards will be automatically synced to your account</li>
              </ol>
            </div>
          )}
        </Card>

        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Question *</label>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 w-8 p-0"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleVoiceInput('question')}
                  disabled={isRecording && recordingTarget !== 'question'}
                  className={`h-8 w-8 p-0 ${isRecording && recordingTarget === 'question' ? 'text-destructive' : ''}`}
                >
                  {isTranscribing && recordingTarget === 'question' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isRecording && recordingTarget === 'question' ? (
                    <MicOff className="h-4 w-4 animate-pulse" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Textarea
              ref={questionTextareaRef}
              placeholder="What is your question?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onPaste={handlePaste}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Tip: Start with "What", "How", "Why" for better clarity
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Answer *</label>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 w-8 p-0"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleVoiceInput('answer')}
                  disabled={isRecording && recordingTarget !== 'answer'}
                  className={`h-8 w-8 p-0 ${isRecording && recordingTarget === 'answer' ? 'text-destructive' : ''}`}
                >
                  {isTranscribing && recordingTarget === 'answer' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isRecording && recordingTarget === 'answer' ? (
                    <MicOff className="h-4 w-4 animate-pulse" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Textarea
              ref={answerTextareaRef}
              placeholder="Write your answer... (Markdown supported)"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onPaste={handlePaste}
              rows={6}
              className="resize-none"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleGenerateAnswer}
                disabled={!question.trim() || isGenerating}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Answer
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Supports markdown formatting: **bold**, *italic*, `code`, lists, etc.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
              />
              <Button type="button" size="icon" variant="outline" onClick={handleAddTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </div>
  )
}

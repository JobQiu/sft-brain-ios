"use client"

import { useState, useEffect, Suspense } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getQAPairs } from "@/lib/mobile/qa-store"
import type { QAPair } from "@/lib/mobile/types"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

function MobileQAContent() {
  const [qaPairs, setQAPairs] = useState<QAPair[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchQAPairs = async () => {
      setLoading(true)
      try {
        const pairs = await getQAPairs()
        setQAPairs(pairs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      } catch (error) {
        console.error("Error loading QA pairs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchQAPairs()
  }, [])

  const allTags = Array.from(new Set(qaPairs.flatMap((qa) => (qa.tags && Array.isArray(qa.tags) ? qa.tags : []))))

  const filteredQAs = qaPairs.filter((qa) => {
    const tags = (qa.tags && Array.isArray(qa.tags)) ? qa.tags : []
    const matchesSearch =
      searchQuery === "" ||
      qa.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qa.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => tags.includes(tag))

    return matchesSearch && matchesTags
  })

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="sticky bg-background border-b border-border z-10" style={{ top: 0 }}>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search flashcards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-11"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center justify-center w-11 h-11 rounded-md border transition-colors relative",
                showFilters || selectedTags.length > 0
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-input",
              )}
            >
              <Filter className="w-5 h-5" />
              {selectedTags.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  {selectedTags.length}
                </span>
              )}
            </button>
          </div>

          {showFilters && allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer h-8"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
              {selectedTags.length > 0 && (
                <button onClick={() => setSelectedTags([])} className="text-xs text-muted-foreground underline ml-2">
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredQAs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            {qaPairs.length === 0 ? (
              <>
                <p className="text-muted-foreground">No flashcards yet</p>
                <p className="text-sm text-muted-foreground mt-2">Tap the + button to create your first flashcard</p>
              </>
            ) : (
              <>
                <p className="text-muted-foreground">No flashcards found</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
              </>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredQAs.map((qa) => (
              <button
                key={qa.id}
                onClick={() => router.push(`/mobile/qa/${qa.id}`)}
                className="w-full text-left p-4 hover:bg-accent transition-colors active:bg-accent/80"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground line-clamp-2 mb-2">
                      {qa.question.split("\n")[0].replace(/^#+\s*/, "")}
                    </h3>
                    {qa.tags && Array.isArray(qa.tags) && qa.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {qa.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={`${qa.id}-tag-${index}`} variant="secondary" className="text-xs">
                            {String(tag)}
                          </Badge>
                        ))}
                        {qa.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{qa.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Reviewed: {qa.reviewCount}</span>
                      <span>•</span>
                      <span>Next: {new Date(qa.nextReviewAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function MobileQAPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      <MobileQAContent />
    </Suspense>
  )
}
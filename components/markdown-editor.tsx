"use client"

import { Textarea } from "@/components/ui/textarea"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  hideTip?: boolean
}

export function MarkdownEditor({ value, onChange, placeholder, hideTip }: MarkdownEditorProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="min-h-[200px] font-mono"
    />
  )
}

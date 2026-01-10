'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

// Stub components for resizable - not fully implemented
function ResizablePanelGroup({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="resizable-panel-group"
      className={cn('flex h-full w-full', className)}
      {...props}
    >
      {children}
    </div>
  )
}

function ResizablePanel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="resizable-panel" className={className} {...props}>
      {children}
    </div>
  )
}

function ResizableHandle({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="resizable-handle"
      className={cn('bg-border w-px', className)}
      {...props}
    />
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }

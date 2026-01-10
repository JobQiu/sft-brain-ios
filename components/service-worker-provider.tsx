"use client"

import { useEffect } from 'react'
import { useServiceWorker } from "@/lib/use-service-worker"

export function ServiceWorkerProvider() {
  // Disable service worker for Capacitor/mobile apps
  const isCapacitor = typeof window !== 'undefined' && (
    (window as any).Capacitor ||
    window.location.hostname === '10.0.2.2' ||
    (window.location.hostname === 'localhost' && (window.navigator as any)?.userAgent?.includes('wv'))
  )
  
  // URGENT: Force unregister all service workers on mobile browsers
  // to clear the old "confirm update" dialog bug
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      if (isMobile) {
        // On mobile browsers, unregister ALL service workers to fix the confirm dialog bug
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister()
            console.log('[SW] Force unregistered service worker on mobile')
          })
        })
        return // Don't register new service worker on mobile
      }
    }
  }, [])
  
  // Only use service worker on desktop (not mobile browsers, not Capacitor)
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  
  if (!isCapacitor && !isMobile) {
    useServiceWorker()
  }
  return null
}

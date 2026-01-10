"use client"

import { useEffect } from 'react'

/**
 * Hook to register service worker for caching and offline support
 */
export function useServiceWorker() {
  useEffect(() => {
    // Disable service worker for Capacitor/mobile apps
    const isCapacitor = typeof window !== 'undefined' && (
      (window as any).Capacitor ||
      window.location.hostname === '10.0.2.2' ||
      (window.location.hostname === 'localhost' && (window.navigator as any)?.userAgent?.includes('wv'))
    )
    
    if (isCapacitor && 'serviceWorker' in navigator) {
      // Unregister any existing service workers for Capacitor
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister()
          console.log('[SW] Unregistered service worker for Capacitor')
        })
      })
      return
    }
    
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production' &&
      !isCapacitor
    ) {
      // URGENT FIX: Unregister all existing service workers first to prevent redirect loops
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          // Unregister old service workers
          registration.unregister().then(() => {
            console.log('[SW] Unregistered old service worker')
          })
        })
      }).then(() => {
        // Register new service worker
        return navigator.serviceWorker.register('/sw.js')
      }).then((registration) => {
        console.log('[SW] Registered:', registration.scope)

        // Force update immediately
        registration.update()

        // Check for updates every hour
        setInterval(() => {
          registration.update()
        }, 60 * 60 * 1000)

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (
                  newWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  // New service worker available - auto update
                  console.log('[SW] New version available, updating...')
                  newWorker.postMessage({ type: 'SKIP_WAITING' })
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('[SW] Registration failed:', error)
        })

      // Handle controller change (new service worker activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[SW] Controller changed, reloading page')
        window.location.reload()
      })
    }
  }, [])
}

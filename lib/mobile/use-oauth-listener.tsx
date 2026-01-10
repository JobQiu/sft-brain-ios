"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Hook to listen for OAuth callbacks when app reopens from browser
 */
export function useOAuthListener() {
  const router = useRouter()

  useEffect(() => {
    const setupListener = async () => {
      // Only run in Capacitor environment
      if (typeof window === 'undefined' || !(window as any).Capacitor) {
        return
      }

      try {
        const { App } = await import('@capacitor/app')
        const { Browser } = await import('@capacitor/browser')

        // Listen for app URL open events (deep links)
        const listener = await App.addListener('appUrlOpen', async (data) => {
          console.log('[OAuth] App opened with URL:', data.url)

          // Close the browser if it's still open
          await Browser.close()

          // Check if this is an OAuth callback
          if (data.url.includes('/oauth/google/callback') || data.url.includes('/mobile/auth/callback')) {
            // Extract the full URL or redirect to callback handler
            const url = new URL(data.url)
            const code = url.searchParams.get('code')
            const state = url.searchParams.get('state')

            if (code) {
              // Redirect to the callback page with the code
              router.push(`/mobile/auth/callback?code=${code}&state=${state || ''}`)
            }
          }
        })

        return () => {
          listener.remove()
        }
      } catch (error) {
        console.error('[OAuth] Error setting up listener:', error)
      }
    }

    setupListener()
  }, [router])
}

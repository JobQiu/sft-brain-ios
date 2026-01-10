"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/mobile/auth-context"
import { saveAuthToken } from "@/lib/api-client"

function MobileAuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser } = useAuth() as any

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code")
      const error = searchParams.get("error")

      if (error) {
        console.error("OAuth error:", error)
        router.push("/mobile/login")
        return
      }

      if (code) {
        try {
          // Exchange the authorization code for tokens
          // ALWAYS use relative path - Next.js rewrites will proxy /api/* to backend
          const apiUrl = '' // Relative path - Next.js proxies to backend
          
          // IMPORTANT: redirect_uri must match what was used in the initial OAuth request
          // The backend's /api/auth/login now detects mobile and uses /mobile/auth/callback
          const redirectUri = window.location.origin + "/mobile/auth/callback"
          
          console.log('[MobileAuthCallback] Exchanging code with redirect_uri:', redirectUri)
          
          const response = await fetch(`${apiUrl}/api/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              code,
              redirect_uri: redirectUri
            })
          })

          if (response.ok) {
            const data = await response.json()
            if (data.success && data.data) {
              // Save the JWT token using the api-client utility
              const token = data.data.token || data.data.access_token
              console.log('[MobileAuthCallback] Saving token, length:', token?.length)
              await saveAuthToken(token)
              
              // Verify token was saved
              const savedTokenInfo = localStorage.getItem('auth_token_info')
              console.log('[MobileAuthCallback] Token saved:', !!savedTokenInfo)
              if (savedTokenInfo) {
                try {
                  const tokenInfo = JSON.parse(savedTokenInfo)
                  console.log('[MobileAuthCallback] Token expires at:', new Date(tokenInfo.expiresAt).toISOString())
                } catch (e) {
                  console.error('[MobileAuthCallback] Failed to parse saved token info:', e)
                }
              }

              // Save user info WITHOUT the token
              const user = {
                id: data.data.user.id.toString(),
                name: data.data.user.name,
                email: data.data.user.email,
                avatar: data.data.user.profile_picture || "/placeholder.svg"
              }

              // Store user data
              const userString = JSON.stringify(user)
              localStorage.setItem("qa_user", userString)

              // Try to store in Capacitor Preferences
              try {
                const { Preferences } = await import("@capacitor/preferences")
                await Preferences.set({
                  key: "qa_user",
                  value: userString,
                })
              } catch (error) {
                // Capacitor not available
              }

              // Redirect to QA tab
              router.push("/mobile/qa")
              return
            }
          }
        } catch (error) {
          console.error("Failed to exchange code:", error)
        }
      }

      // If we get here, something went wrong
      router.push("/mobile/login")
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  )
}

export default function MobileAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <MobileAuthCallbackContent />
    </Suspense>
  )
}
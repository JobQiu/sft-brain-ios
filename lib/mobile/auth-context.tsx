"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Preferences } from "@capacitor/preferences"
import { saveAuthToken } from "@/lib/api-client"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage or Capacitor Preferences
    const checkAuth = async () => {
      try {
        // Try Capacitor Preferences first (for mobile app)
        const { value } = await Preferences.get({ key: "qa_user" })
        if (value) {
          setUser(JSON.parse(value))
        } else {
          // Fallback to localStorage (for web)
          const storedUser = localStorage.getItem("qa_user")
          if (storedUser) {
            setUser(JSON.parse(storedUser))
          }
        }
      } catch (error) {
        // If Capacitor is not available, use localStorage
        const storedUser = localStorage.getItem("qa_user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      // Use relative URL when in browser (works with Nginx proxy)
      // In monolithic container, Nginx routes /api/* to Flask backend
      const backendUrl = typeof window !== "undefined" ? "" : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000")

      // First, get the Google OAuth URL from the backend
      const loginResponse = await fetch(`${backendUrl}/api/auth/login`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (loginResponse.ok) {
        const loginData = await loginResponse.json()

        if (loginData.success && loginData.data?.auth_url) {
          // Check if we're in Capacitor (mobile app)
          const isCapacitor = !!(window as any).Capacitor

          if (isCapacitor) {
            // Use Capacitor Browser plugin for in-app OAuth flow
            const { Browser } = await import('@capacitor/browser')

            // Store the current location for redirect after auth
            sessionStorage.setItem("auth_redirect", window.location.pathname)

            // Open OAuth in in-app browser
            await Browser.open({
              url: loginData.data.auth_url,
              windowName: '_self',
            })

            // The Browser will redirect back to the app via deep link
            // The callback will be handled by /auth/callback
          } else {
            // For web, use regular redirect
            if (typeof window !== "undefined") {
              // Store the current location for redirect after auth
              sessionStorage.setItem("auth_redirect", window.location.pathname)

              // Redirect to Google OAuth
              window.location.href = loginData.data.auth_url
            }
          }
          return
        }
      }

      // If backend is not available or we're in development, use test login
      if (process.env.NODE_ENV === "development") {
        console.log("Using test login for development")

        const testResponse = await fetch(`${backendUrl}/api/auth/test-login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "demo@example.com",
            name: "Demo User"
          })
        })

        if (testResponse.ok) {
          const testData = await testResponse.json()
          if (testData.success && testData.data) {
            // Save the JWT token using the api-client utility
            saveAuthToken(testData.data.token)

            // Save user info WITHOUT the token
            const user: User = {
              id: testData.data.user.id.toString(),
              name: testData.data.user.name,
              email: testData.data.user.email,
              avatar: testData.data.user.profile_picture || "/placeholder.svg"
            }

            setUser(user)

            // Store in both localStorage and Capacitor Preferences
            const userString = JSON.stringify(user)
            localStorage.setItem("qa_user", userString)

            try {
              await Preferences.set({
                key: "qa_user",
                value: userString,
              })
            } catch (error) {
              // Capacitor not available, that's okay
            }

            return
          }
        }
      }

      // Ultimate fallback for development if backend is not available
      console.log("Backend not available, using mock authentication")
      const mockUser: User = {
        id: "1",
        name: "Member One",
        email: "member1@example.com",
        avatar: "/placeholder.svg",
      }
      setUser(mockUser)
      const userString = JSON.stringify(mockUser)
      localStorage.setItem("qa_user", userString)

      try {
        await Preferences.set({
          key: "qa_user",
          value: userString,
        })
      } catch (error) {
        // Capacitor not available
      }
    } catch (error) {
      console.error("Login error:", error)
      // Development fallback
      const mockUser: User = {
        id: "1",
        name: "Member One",
        email: "member1@example.com",
        avatar: "/placeholder.svg",
      }
      setUser(mockUser)
      localStorage.setItem("qa_user", JSON.stringify(mockUser))
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    // Get token before clearing for backend logout
    let authToken = null
    try {
      const storedUser = localStorage.getItem("qa_user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        authToken = userData.token
      }
    } catch (e) {
      // Invalid JSON
    }

    // Clear user state first
    setUser(null)

    // Clear localStorage
    localStorage.removeItem("qa_user")

    // Clear sessionStorage as well
    sessionStorage.clear()

    // Clear Capacitor Preferences
    try {
      await Preferences.remove({ key: "qa_user" })
    } catch (error) {
      // Capacitor not available
    }

    // Call backend logout endpoint
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      await fetch(`${backendUrl}/api/auth/logout`, {
        method: "POST",
        headers: authToken ? {
          "Authorization": `Bearer ${authToken}`
        } : {}
      })
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, logout: signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
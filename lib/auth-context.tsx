"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { isAuthenticated } from "./api-client"

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
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage AND token is valid
    const checkUser = () => {
      // First check if we have a valid authentication token
      if (!isAuthenticated()) {
        // Token is missing or expired, clear user data
        setUser(null)
        localStorage.removeItem("qa_user")
        setLoading(false)
        return
      }

      const storedUser = localStorage.getItem("qa_user")
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (e) {
          console.error("Failed to parse user data:", e)
          localStorage.removeItem("qa_user")
        }
      }
      setLoading(false)
    }

    checkUser()

    // Listen for storage changes (when callback page saves user)
    const handleStorageChange = () => {
      checkUser()
    }

    window.addEventListener("storage", handleStorageChange)
    // Also listen for custom event from same tab
    window.addEventListener("userLoggedIn", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("userLoggedIn", handleStorageChange)
    }
  }, [])

  const signInWithGoogle = async () => {
    // Mock Google login - in production, this would use OAuth
    await new Promise((resolve) => setTimeout(resolve, 800))
    const mockUser: User = {
      id: "1",
      name: "Demo User",
      email: "demo@example.com",
      avatar: "/placeholder.svg",
    }
    setUser(mockUser)
    localStorage.setItem("qa_user", JSON.stringify(mockUser))
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("qa_user")
    // Also clear the auth token
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_token_info")
  }

  return <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

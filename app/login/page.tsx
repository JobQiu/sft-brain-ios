"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/mobile/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookOpen, Brain, TrendingUp, Target, Mail, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { saveAuthToken } from "@/lib/api-client"
import { Input } from "@/components/ui/input"

export default function MobileLoginPage() {
  const { user, loading, signInWithGoogle } = useAuth()
  const router = useRouter()
  const [isTestLoading, setIsTestLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState("")

  useEffect(() => {
    if (user && !loading) {
      router.push("/mobile/qa")
    }
  }, [user, loading, router])

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setLoginError("")

    try {
      // Import mock API for standalone mode
      const { mockAPI } = await import("@/lib/mock/api")

      // Use mock API for login
      const data = await mockAPI.login(email, password)

      // Save user info
      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        avatar: data.user.picture || "/placeholder.svg"
      }

      // Store user data
      localStorage.setItem("qa_user", JSON.stringify(userData))

      // Save the JWT token
      await saveAuthToken(data.token)

      // Wait a bit to ensure async storage operations complete
      await new Promise(resolve => setTimeout(resolve, 100))

      // Redirect to dashboard
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Login failed:", error)
      setLoginError(error instanceof Error ? error.message : "Login failed. Please try again.")
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleTestLogin = async () => {
    setIsTestLoading(true)
    try {
      // Use relative URL when in browser (works with Nginx proxy)
      const backendUrl = typeof window !== "undefined" ? "" : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000")
      const response = await fetch(`${backendUrl}/api/auth/test-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "member1@example.com",
          name: "Member One"
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          // Save user info WITHOUT the token
          const user = {
            id: data.data.user.id.toString(),
            name: data.data.user.name,
            email: data.data.user.email,
            avatar: data.data.user.profile_picture || "/placeholder.svg"
          }

          // Store user data
          localStorage.setItem("qa_user", JSON.stringify(user))

          // Save the JWT token using the api-client utility
          await saveAuthToken(data.data.token)

          // IMPORTANT: Wait a bit to ensure async storage operations complete
          await new Promise(resolve => setTimeout(resolve, 100))

          // Redirect to QA tab
          window.location.href = "/mobile/qa"
        }
      }
    } catch (error) {
      console.error("Test login failed:", error)
    }
    setIsTestLoading(false)
  }


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero Section */}
      <div className="flex-1 px-4 pt-12 pb-8">
        <div className="mx-auto max-w-md space-y-8">
          {/* Logo and Title */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <img
                src="/apple-icon.png"
                alt="SFT Brain Logo"
                className="h-16 w-16 rounded-xl shadow-lg"
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                SFT Brain
              </h1>
              <p className="text-base text-muted-foreground">
                Create, manage, and review your question-answer pairs with intelligent scheduling
              </p>
            </div>
          </div>

          {/* Login Card */}
          <Card className="p-6 shadow-xl border-2">
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-semibold">Get Started</h2>
                <p className="text-sm text-muted-foreground mt-1">Sign in to manage your QA pairs</p>
              </div>

              <Button
                onClick={signInWithGoogle}
                variant="outline"
                className="w-full gap-3 h-12 text-base font-medium shadow-sm bg-transparent"
                size="lg"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or sign in with email</span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleEmailPasswordLogin} className="space-y-3">
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoggingIn}
                    className="h-12"
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoggingIn}
                    className="h-12"
                    required
                  />
                  {loginError && (
                    <p className="text-xs text-destructive">{loginError}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Demo accounts: user@example.com, demo@example.com, member1@example.com (password: password123)
                  </p>
                </div>
                <Button
                  type="submit"
                  variant="secondary"
                  disabled={isLoggingIn || !email || !password}
                  className="w-full gap-2 h-12 text-base font-medium"
                  size="lg"
                >
                  <Mail className="h-5 w-5" />
                  {isLoggingIn ? "Signing in..." : "Sign in with Email"}
                </Button>
              </form>

              <div className="text-center text-xs text-muted-foreground">
                By signing in, you agree to our{" "}
                <Link href="/privacy" className="underline hover:text-foreground">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </Card>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Key Features</h3>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-foreground">Smart Review System</h4>
                  <p className="text-xs text-muted-foreground">
                    Spaced repetition algorithm optimizes your review schedule
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-foreground">Track Progress</h4>
                  <p className="text-xs text-muted-foreground">
                    Visual analytics show your learning journey and statistics
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-foreground">Rich Content</h4>
                  <p className="text-xs text-muted-foreground">
                    Support for markdown, images, and code in your QA pairs
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-foreground">Organize & Search</h4>
                  <p className="text-xs text-muted-foreground">
                    Tag your questions and find what you need instantly
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card px-4 py-6">
        <div className="mx-auto max-w-md">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-xs text-muted-foreground">© 2025 SFT Brain Project. All rights reserved.</p>
            <div className="flex gap-4 text-xs">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/help" className="text-muted-foreground hover:text-foreground">
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
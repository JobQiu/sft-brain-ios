"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to mobile login/dashboard
    router.replace("/mobile/login")
  }, [router])

  return null
}

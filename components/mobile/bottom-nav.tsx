"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, BarChart3, PlayCircle, User, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export default function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { icon: Home, label: "QA", path: "/mobile/qa" },
    { icon: BarChart3, label: "Dashboard", path: "/mobile/dashboard" },
    { icon: Plus, label: "Add", path: "/mobile/add", isAction: true },
    { icon: PlayCircle, label: "Review", path: "/mobile/review" },
    { icon: User, label: "Profile", path: "/mobile/profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">

      <div className="flex items-center justify-around px-2 pt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          const Icon = item.icon

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all relative min-w-[60px]",
                "active:scale-95 active:bg-accent/50",
                item.isAction && "flex-initial px-4",
              )}
            >
              {item.isAction ? (
                <div className="w-14 h-14 -mt-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl border-4 border-background">
                  <Icon className="w-7 h-7" />
                </div>
              ) : (
                <>
                  <div className={cn(
                    "relative p-1.5 rounded-lg transition-colors",
                    isActive && "bg-primary/10"
                  )}>
                    <Icon
                      className={cn(
                        "w-6 h-6 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-medium transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
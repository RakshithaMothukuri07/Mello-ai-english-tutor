"use client"

import type React from "react"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getSession } from "@/lib/mello/storage"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (!session?.email) {
      router.replace("/login")
    } else {
      setReady(true)
    }
  }, [router])

  if (!ready) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-gradient-to-b from-white via-purple-50/30 to-white">
        <p className="text-muted-foreground">Checking session…</p>
      </main>
    )
  }

  const links = [
    { href: "/dashboard/practice", label: "Practice" },
    { href: "/dashboard/feedbacks", label: "Feedbacks" },
    { href: "/dashboard/profile", label: "Profile" },
  ]

  return (
    <div className="min-h-dvh bg-gradient-to-b from-white via-purple-50/30 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[90rem] items-center justify-between px-4 py-4">
          <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Mello
          </Link>
          <nav className="hidden gap-4 md:flex">
            {links.map((l) => (
              <Button key={l.href} asChild variant={pathname.startsWith(l.href) ? "default" : "ghost"} className={pathname.startsWith(l.href) ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" : ""}>
                <Link href={l.href}>{l.label}</Link>
              </Button>
            ))}
          </nav>
          <div className="md:hidden">
            <span className="text-sm text-muted-foreground">
              {links.find((l) => pathname.startsWith(l.href))?.label ?? "Menu"}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-9xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
        <aside className="hidden md:block">
          {/* <nav className="grid gap-1">
            {links.map((l) => (
              <Button
                key={l.href}
                asChild
                variant={pathname.startsWith(l.href) ? "secondary" : "ghost"}
                className={cn("justify-start", pathname.startsWith(l.href) ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300" : "")}
              >
                <Link href={l.href}>{l.label}</Link>
              </Button>
            ))}
          </nav> */}
        </aside>
        <main>{children}</main>
      </div>
    </div>
  )
}
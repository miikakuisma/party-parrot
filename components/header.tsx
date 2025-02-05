"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useSession, signOut } from "next-auth/react"

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Kids Party Planner
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-sm font-medium">
              Dashboard
            </Button>
          </Link>
          <ModeToggle />
          {status === "authenticated" ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {session.user?.name}
              </span>
              <Button 
                onClick={() => signOut()}
                variant="outline"
                className="text-sm"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Link href="/auth/signin">
              <Button className="text-sm">Sign In</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}


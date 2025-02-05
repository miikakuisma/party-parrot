"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useSession, signOut } from "next-auth/react"

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="border-b">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="text-2xl font-bold">
          Kids Party Planner
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <ModeToggle />
          {status === "authenticated" ? (
            <>
              <span>Welcome, {session.user?.name}</span>
              <Button onClick={() => signOut()}>Sign Out</Button>
            </>
          ) : (
            <Link href="/auth/signin">
              <Button>Sign In</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}


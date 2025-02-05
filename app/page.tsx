import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Kids Party Planner</h1>
      <p className="text-xl mb-8">Organize amazing birthday parties for your kids!</p>
      <Link href="/create-party">
        <Button size="lg">Create a Party</Button>
      </Link>
    </div>
  )
}


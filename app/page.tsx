import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted">
      <div className="container px-4 md:px-6 flex flex-col items-center space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
            Welcome to Kids Party Planner
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Organize amazing birthday parties for your kids with ease. Create, plan, and manage all your party details in one place.
          </p>
        </div>
        <div className="space-x-4">
          <Link href="/create-party">
            <Button size="lg" className="shadow-lg hover:shadow-xl transition-all">
              Create a Party
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="shadow hover:shadow-md transition-all">
              View Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}


import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Placeholder data
const parties = [
  { id: 1, name: "Alice's 7th Birthday", date: "2024-03-15", rsvpStatus: "Confirmed" },
  { id: 2, name: "Bob's Superhero Party", date: "2024-04-22", rsvpStatus: "Pending" },
  { id: 3, name: "Charlie's Space Adventure", date: "2024-05-10", rsvpStatus: "Confirmed" },
]

export default function Dashboard() {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Parties</h1>
        <Link href="/create-party">
          <Button>Create New Party</Button>
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {parties.map((party) => (
          <Card key={party.id}>
            <CardHeader>
              <CardTitle>{party.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">Date: {party.date}</p>
              <Badge>{party.rsvpStatus}</Badge>
              <div className="mt-4">
                <Link href={`/party/${party.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


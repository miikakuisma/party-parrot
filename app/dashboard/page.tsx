import Link from "next/link"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { sql } from '@vercel/postgres'
import { authOptions } from "@/lib/auth"

async function getEvents(userId: string) {
  console.log('Fetching events for user:', userId) // Debug log
  const result = await sql`
    SELECT * FROM events 
    WHERE user_id = ${parseInt(userId)} 
    ORDER BY date ASC, time ASC
  `
  return result.rows
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/dashboard')
  }

  const events = await getEvents(session.user.id)
  console.log('Found events:', events) // Debug log

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Parties</h1>
      </div>
      {events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">You haven't created any parties yet</p>
            <Link href="/create-party">
              <Button>Create Your First Party</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Date: {new Date(event.date).toLocaleDateString()}
                  {event.time && ` at ${event.time}`}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Location: {event.location}
                </p>
                <Badge>{event.status}</Badge>
                <div className="mt-4">
                  <Link href={`/party/${event.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


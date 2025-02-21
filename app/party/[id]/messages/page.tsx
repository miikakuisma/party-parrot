import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { sql } from '@vercel/postgres'
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

async function getMessages(eventId: string) {
  const result = await sql`
    SELECT m.*, r.name as guest_name
    FROM messages m
    LEFT JOIN rsvps r ON m.rsvp_id = r.id
    WHERE m.event_id = ${parseInt(eventId)}
    ORDER BY m.created_at DESC
  `
  return result.rows
}

export default async function MessagesPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  const messages = await getMessages(params.id)

  return (
    <div className="container py-8 max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Link href={`/party/${params.id}`}>
          <Button variant="outline">Back to Party</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No messages yet
            </p>
          ) : (
            <div className="divide-y">
              {messages.map((message) => (
                <div key={message.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {message.guest_name || "Anonymous Guest"}
                      </p>
                      <p className="mt-1">{message.content}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(message.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 
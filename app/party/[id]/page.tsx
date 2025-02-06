import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import Image from "next/image"
import { sql } from '@vercel/postgres'
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon } from "lucide-react"
import Link from "next/link"

async function getEvent(id: string, userId: string) {
  const result = await sql`
    SELECT * FROM events 
    WHERE id = ${parseInt(id)}
    AND user_id = ${parseInt(userId)}
  `
  
  if (result.rows.length === 0) {
    return null
  }
  
  return result.rows[0]
}

export default async function PartyPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/party/' + params.id)
  }

  const event = await getEvent(params.id, session.user.id)

  if (!event) {
    notFound()
  }

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <Card className="bg-gradient-to-b from-slate-600 to-slate-900">
        <CardHeader className="bg-slate-900">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl">{event.title}</CardTitle>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {event.image_url ? (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              <Image
                src={event.image_url}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          <div>
            <h3 className="font-semibold mb-2">Date and Time</h3>
            <p>
              {new Date(event.date).toLocaleDateString()}
              {event.time && ` at ${event.time}`}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Location</h3>
            <p>{event.location || "Location TBD"}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p>{event.description || "No description provided"}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Guest Limit</h3>
            <p>{event.max_guests ? `${event.max_guests} guests maximum` : "No guest limit"}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Status</h3>
            <p className="capitalize">{event.status}</p>
          </div>

          <div className="flex gap-4 pt-4">
            <Link href={`/party/${event.id}/edit`}>
              <Button>Edit Party</Button>
            </Link>
            <Link href={`/party/${event.id}/invite`}>
              <Button variant="outline">Send Invites</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


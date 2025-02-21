import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import Image from "next/image"
import { sql } from '@vercel/postgres'
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ScrollText } from "lucide-react"
import { RsvpActions } from "./components/rsvp-actions"

async function getEvent(id: string, userId: string) {
  const result = await sql`
    SELECT * FROM events 
    WHERE short_id = ${id}
    AND user_id = ${parseInt(userId)}
  `
  
  if (result.rows.length === 0) {
    return null
  }
  
  return result.rows[0]
}

async function getRsvps(eventId: string) {
  const result = await sql`
    SELECT * FROM rsvps 
    WHERE event_short_id = ${eventId}
    ORDER BY created_at DESC
  `
  return result.rows
}

async function getRsvpWithMessages(eventId: string) {
  const result = await sql`
    SELECT r.*, 
           COUNT(m.id) as message_count
    FROM rsvps r
    LEFT JOIN messages m ON r.id = m.rsvp_id
    WHERE r.event_short_id = ${eventId}
    GROUP BY r.id
    ORDER BY r.created_at DESC
  `
  return result.rows
}

export default async function PartyPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/party/' + params.id)
  }

  const event = await getEvent(params.id, session.user.id)
  const rsvps = await getRsvps(params.id)
  const rsvpsWithMessages = await getRsvpWithMessages(params.id)

  if (!event) {
    notFound()
  }

  return (
    <div className="container py-8 max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Link href="/dashboard">
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
      </div>


      <Card
        className="relative grid h-[64rem] w-full items-end justify-center overflow-hidden text-center"
      >
        <CardHeader
          className={`absolute inset-0 m-0 h-full w-full rounded-none bg-cover bg-center`}
          style={{
            backgroundImage: `url("/backgrounds/${event.background_style}.png")`
          }}
        >
          <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-t from-black/80 via-black/50" />
        </CardHeader>
        <CardContent className="relative py-14 px-6 md:px-12 flex flex-col items-center justify-center">
          <Image
            src={event.image_url}
            alt={event.title}
            width={128}
            height={128}
            className="object-cover rounded-full border-2 border-white"
            priority
          />
          <h2
            className="mb-6 text-white leading-[1.5] text-6xl font-bold"
          >
            {event.title}
          </h2>
          <h5 className="mb-4 text-gray-400">
            {event.description || "No description provided"}
          </h5>
          
        </CardContent>
      </Card>

      <Card className="bg-white/5 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
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

            {/* <div>
              <h3 className="font-semibold mb-2">Status</h3>
              <p className="capitalize">{event.status}</p>
            </div> */}

            <div className="flex gap-4 pt-4 justify-center">
              <Link href={`/party/${event.short_id}/edit`}>
                <Button>Edit Party</Button>
              </Link>
              <Link href={`/party/${event.short_id}/messages`}>
                <Button variant="outline">
                  View Messages
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ScrollText className="h-5 w-5" />
              Guest List ({rsvpsWithMessages.length})
            </CardTitle>
            <Link href={`/party/${event.short_id}/invite`}>
              <Button variant="secondary">Invite Guests</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {rsvpsWithMessages.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No RSVPs yet. Share the invitation link to get started!
            </p>
          ) : (
            <div className="divide-y">
              {rsvpsWithMessages.map((rsvp) => (
                <div key={rsvp.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{rsvp.name}</p>
                      <p className="text-sm text-muted-foreground">{rsvp.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        {new Date(rsvp.created_at).toLocaleDateString()}
                      </p>
                      <RsvpActions 
                        eventId={params.id} 
                        rsvpId={rsvp.id}
                        hasMessages={rsvp.message_count > 0}
                      />
                    </div>
                  </div>
                  {rsvp.allergies && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      <span className="font-medium">Allergies/Diet:</span> {rsvp.allergies}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-center">
        <Link href={`/party/${event.short_id}/edit`}>
          <Button>Edit Party</Button>
        </Link>
      </div>
    </div>
  )
}


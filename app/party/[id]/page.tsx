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
import { getBackgroundStyle } from "@/lib/config/backgrounds"

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

            <div>
              <h3 className="font-semibold mb-2">Status</h3>
              <p className="capitalize">{event.status}</p>
            </div>

            <div className="flex gap-4 pt-4 justify-center">
              <Link href={`/party/${event.id}/edit`}>
                <Button>Edit Party</Button>
              </Link>
              <Link href={`/party/${event.id}/invite`}>
                <Button variant="secondary">Send Invites</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


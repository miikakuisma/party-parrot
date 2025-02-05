import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Placeholder data
const partyDetails = {
  id: 1,
  name: "Alice's 7th Birthday",
  date: "2024-03-15",
  time: "14:00",
  location: "123 Fun Street, Party Town",
  rsvpStatus: "Confirmed",
  giftPreferences: "Alice loves books and art supplies!",
  guests: [
    { name: "Bob", status: "Confirmed", allergies: "Nuts" },
    { name: "Charlie", status: "Pending", allergies: "None" },
    { name: "Diana", status: "Declined", allergies: "Dairy" },
  ],
}

export default function PartyDetails({ params }: { params: { id: string } }) {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">{partyDetails.name}</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div>
              <dt className="font-semibold">Date:</dt>
              <dd>{partyDetails.date}</dd>
            </div>
            <div>
              <dt className="font-semibold">Time:</dt>
              <dd>{partyDetails.time}</dd>
            </div>
            <div>
              <dt className="font-semibold">Location:</dt>
              <dd>{partyDetails.location}</dd>
            </div>
            <div>
              <dt className="font-semibold">RSVP Status:</dt>
              <dd>
                <Badge>{partyDetails.rsvpStatus}</Badge>
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Gift Preferences:</dt>
              <dd>{partyDetails.giftPreferences}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Guest List</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {partyDetails.guests.map((guest, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{guest.name}</span>
                <div>
                  <Badge className="mr-2">{guest.status}</Badge>
                  {guest.allergies !== "None" && (
                    <Badge variant="outline">{guest.allergies}</Badge>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <div className="flex space-x-4">
        <Button>Send Reminders</Button>
        <Link href={`/party/${params.id}/edit`}>
          <Button variant="outline">Edit Party</Button>
        </Link>
      </div>
    </div>
  )
}


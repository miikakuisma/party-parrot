"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2 } from "lucide-react"
import Image from "next/image"

interface Event {
  short_id: string
  title: string
  date: string
  time: string | null
  location: string | null
  description: string | null
  max_guests: number | null
  image_url: string | null
  background_style: string
}

interface StoredRsvp {
  id: number
  name: string
  status: string
}

export default function RsvpPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [event, setEvent] = useState<Event | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showMessageForm, setShowMessageForm] = useState(false)
  const [message, setMessage] = useState("")
  const [storedRsvp, setStoredRsvp] = useState<StoredRsvp | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    allergies: "",
    status: "attending"
  })

  useEffect(() => {
    // Load stored RSVP data for this event
    const stored = localStorage.getItem(`rsvp-${params.id}`)
    if (stored) {
      setStoredRsvp(JSON.parse(stored))
    }
  }, [params.id])

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await fetch(`/api/events/${params.id}/public`)
        if (!response.ok) throw new Error("Failed to fetch event")
        const data = await response.json()
        setEvent(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not load event details",
          variant: "destructive",
        })
      }
    }
    fetchEvent()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/party/${params.id}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to submit RSVP")
      
      const data = await response.json()
      
      // Store RSVP data in localStorage
      const rsvpData = {
        id: data.id,
        name: formData.name,
        status: formData.status
      }
      localStorage.setItem(`rsvp-${params.id}`, JSON.stringify(rsvpData))
      setStoredRsvp(rsvpData)

      toast({
        title: "Success!",
        description: formData.status === "attending" 
          ? "Your RSVP has been submitted" 
          : "Your cancellation has been recorded",
      })

      router.push(`/party/${params.id}/rsvp/success`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit RSVP",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelRsvp = async () => {
    if (!storedRsvp) return
    if (!confirm("Are you sure you want to cancel your RSVP?")) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/party/${params.id}/rsvp/${storedRsvp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      })

      if (!response.ok) throw new Error()

      const updatedRsvp = { ...storedRsvp, status: "cancelled" }
      localStorage.setItem(`rsvp-${params.id}`, JSON.stringify(updatedRsvp))
      setStoredRsvp(updatedRsvp)

      toast({
        title: "Success",
        description: "Your RSVP has been cancelled",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel RSVP",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/party/${params.id}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message,
          rsvpId: storedRsvp?.id // Include RSVP ID if available
        }),
      })

      if (!response.ok) throw new Error("Failed to send message")

      toast({
        title: "Success!",
        description: "Message sent to organizer",
      })

      setMessage("")
      setShowMessageForm(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!event) {
    return (
      <div className="container py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-2xl mx-auto space-y-6">
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
          {event.image_url && (
            <Image
              src={event.image_url}
              alt={event.title}
              width={128}
              height={128}
              className="object-cover rounded-full border-2 border-white"
              priority
            />
          )}
          <h2 className="mb-6 text-white leading-[1.5] text-6xl font-bold">
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>RSVP to Party</CardTitle>
        </CardHeader>
        <CardContent>
          {storedRsvp ? (
            <div className="flex flex-col items-center gap-6">
              <div className="text-center">
                <p className="font-medium mb-2">Welcome back, {storedRsvp.name}!</p>
                <p className="text-muted-foreground">
                  Your RSVP status: <span className="capitalize">{storedRsvp.status}</span>
                </p>
              </div>
              {storedRsvp.status === "attending" && (
                <Button
                  variant="destructive"
                  onClick={handleCancelRsvp}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Cancel My RSVP"}
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => setShowMessageForm(true)}
              >
                Send Message to Organizer
              </Button>
            </div>
          ) : !showForm ? (
            <div className="flex flex-col items-center gap-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Would you like to attend this party?
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => {
                    setFormData(prev => ({ ...prev, status: "attending" }))
                    setShowForm(true)
                  }}>
                    Yes, I will attend!
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setFormData(prev => ({ ...prev, status: "declined" }))
                    setShowForm(true)
                  }}>
                    Sorry, can't make it
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowMessageForm(true)}
              >
                Send Message to Organizer
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Child's Name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Parent's Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies or Dietary Restrictions</Label>
                <Textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit RSVP"}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {showMessageForm && (
            <form onSubmit={handleSendMessage} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Message to Organizer</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowMessageForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 
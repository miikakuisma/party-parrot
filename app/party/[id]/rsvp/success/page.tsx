import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PartyPopper } from "lucide-react"

export default function RsvpSuccessPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-8 max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <PartyPopper className="h-6 w-6" />
            RSVP Confirmed!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Thank you for your RSVP. We look forward to seeing you at the party!
          </p>
          <div className="flex justify-center">
            <Link href={`/party/${params.id}`}>
              <Button variant="outline">View Party Details</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"

export default function RSVPPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    status: "yes",
    allergies: "",
    note: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the RSVP data to your API
    console.log(formData)
    toast({
      title: "RSVP Submitted",
      description: "Your RSVP has been successfully submitted!",
    })
    router.push(`/party/${params.id}`)
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">RSVP for the Party</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <Label htmlFor="name">Your Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <Label>RSVP Status</Label>
          <RadioGroup
            name="status"
            value={formData.status}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes" />
              <Label htmlFor="yes">Yes, I&apos;ll be there</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no" />
              <Label htmlFor="no">No, I can&apos;t make it</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="maybe" id="maybe" />
              <Label htmlFor="maybe">Maybe</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label htmlFor="allergies">Allergies or Dietary Restrictions</Label>
          <Input
            id="allergies"
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            placeholder="Enter any allergies or dietary restrictions"
          />
        </div>
        <div>
          <Label htmlFor="note">Additional Note</Label>
          <Textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Any additional information you&apos;d like to share"
          />
        </div>
        <Button type="submit">Submit RSVP</Button>
      </form>
    </div>
  )
}


"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"

export default function CreateParty() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    rsvpOption: "yes-no",
    giftPreferences: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your API
    console.log(formData)
    toast({
      title: "Party Created",
      description: "Your party has been successfully created!",
    })
    router.push("/dashboard")
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Create a New Party</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <Label htmlFor="title">Party Title</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="time">Time</Label>
          <Input id="time" name="time" type="time" value={formData.time} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
        </div>
        <div>
          <Label>RSVP Options</Label>
          <RadioGroup
            name="rsvpOption"
            value={formData.rsvpOption}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, rsvpOption: value }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes-no" id="yes-no" />
              <Label htmlFor="yes-no">Yes/No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes-no-maybe" id="yes-no-maybe" />
              <Label htmlFor="yes-no-maybe">Yes/No/Maybe</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label htmlFor="giftPreferences">Gift Preferences</Label>
          <Textarea
            id="giftPreferences"
            name="giftPreferences"
            value={formData.giftPreferences}
            onChange={handleChange}
            placeholder="Enter any gift preferences or suggestions"
          />
        </div>
        <Button type="submit">Create Party</Button>
      </form>
    </div>
  )
}


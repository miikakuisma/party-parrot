"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImagePlus, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BACKGROUNDS_CONFIG } from "@/lib/config/backgrounds"
import { cn } from "@/lib/utils"
import type { ChangeEvent } from "react"

const SelectionCheckmark = () => (
  <div className="h-full flex items-center justify-center">
    <div className="bg-white rounded-full p-2">
      <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  </div>
)

export default function CreatePartyPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    maxGuests: "",
    background_style: "default",
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return

    setUploadingImage(true)
    const file = e.target.files[0]

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setImageUrl(data.url)
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          imageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create party")
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: "Your party has been created!",
      })

      router.push(`/party/${data.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container py-8 h-[calc(100vh-6rem)]">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create a New Party</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="info" className="space-y-6">
              <TabsList>
                <TabsTrigger value="info">Event Info</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Party Title</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxGuests">Maximum Number of Guests</Label>
                  <Input
                    id="maxGuests"
                    name="maxGuests"
                    type="number"
                    min="1"
                    value={formData.maxGuests}
                    onChange={handleChange}
                  />
                </div>
              </TabsContent>

              <TabsContent value="design" className="space-y-6">
                <div className="space-y-2">
                  <Label>Image (optional)</Label>
                  <div className="flex flex-col items-center gap-4">
                    {imageUrl ? (
                      <div className="relative">
                        <Image
                          src={imageUrl}
                          alt="Cover"
                          width={0}
                          height={0}
                          sizes="100%"
                          style={{
                            width: 'auto',
                            height: 'auto',
                            maxWidth: '622px',
                            maxHeight: '200px'
                          }}
                          className="rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-24 bg-muted flex items-center justify-center rounded-lg">
                        <ImagePlus className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="max-w-xs"
                      />
                      {uploadingImage && <Loader2 className="h-4 w-4 animate-spin" />}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Card Background</Label>
                  <Tabs defaultValue="gradients">
                    <TabsList>
                      <TabsTrigger value="gradients">Gradients</TabsTrigger>
                      <TabsTrigger value="images">Images</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="gradients">
                      <RadioGroup
                        value={formData.background_style}
                        name="background_style"
                        className="grid grid-cols-2 gap-4"
                        onValueChange={(value) => handleChange({ target: { name: 'background_style', value } })}
                      >
                        {BACKGROUNDS_CONFIG.gradients.map((gradient) => (
                          <div key={gradient.id}>
                            <RadioGroupItem value={gradient.id} id={gradient.id} className="peer sr-only" />
                            <Label
                              htmlFor={gradient.id}
                              className={cn(
                                "block h-64 rounded-lg cursor-pointer ring-offset-2 peer-checked:ring-2 peer-checked:ring-primary transition-all hover:opacity-90",
                                gradient.className
                              )}
                            >
                              {formData.background_style === gradient.id && <SelectionCheckmark />}
                              <span className="sr-only">{gradient.label}</span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </TabsContent>
                    
                    <TabsContent value="images">
                      <RadioGroup
                        value={formData.background_style}
                        name="background_style"
                        className="grid grid-cols-2 gap-4"
                        onValueChange={(value) => handleChange({ target: { name: 'background_style', value } })}
                      >
                        {BACKGROUNDS_CONFIG.images.map((image) => (
                          <div key={image.id}>
                            <RadioGroupItem value={image.id} id={image.id} className="peer sr-only" />
                            <Label
                              htmlFor={image.id}
                              className="block h-64 rounded-lg cursor-pointer ring-offset-2 peer-checked:ring-2 peer-checked:ring-primary transition-all hover:opacity-90 bg-cover bg-center"
                              style={{ backgroundImage: `url('${image.path}')` }}
                            >
                              {formData.background_style === image.id && <SelectionCheckmark />}
                              <span className="sr-only">{image.label}</span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </TabsContent>
                  </Tabs>
                </div>
              </TabsContent>
            </Tabs>

            <Button type="submit" className="w-full" disabled={isLoading || uploadingImage}>
              {isLoading ? "Creating..." : "Create Party"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


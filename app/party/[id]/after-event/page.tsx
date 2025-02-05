"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

// Placeholder data
const initialComments = [
  { id: 1, author: "Bob", content: "Had a great time! Thanks for inviting us!" },
  { id: 2, author: "Charlie", content: "The cake was amazing!" },
]

export default function AfterEventPage({ params }: { params: { id: string } }) {
  const [photoLink, setPhotoLink] = useState("")
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState(initialComments)

  const handlePhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the photo link to your API
    console.log("Photo link submitted:", photoLink)
    toast({
      title: "Photo Link Shared",
      description: "Your photo link has been successfully shared!",
    })
    setPhotoLink("")
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the comment to your API
    const newComment = {
      id: comments.length + 1,
      author: "You", // In a real app, this would be the logged-in user's name
      content: comment,
    }
    setComments([...comments, newComment])
    toast({
      title: "Comment Posted",
      description: "Your comment has been successfully posted!",
    })
    setComment("")
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">After-Event Page</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Share Photos/Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePhotoSubmit} className="space-y-4">
              <div>
                <Label htmlFor="photoLink">Photo/Video Link</Label>
                <Input
                  id="photoLink"
                  value={photoLink}
                  onChange={(e) => setPhotoLink(e.target.value)}
                  placeholder="Enter a link to your photo or video"
                  required
                />
              </div>
              <Button type="submit">Share Link</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Leave a Comment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div>
                <Label htmlFor="comment">Your Comment</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about the party"
                  required
                />
              </div>
              <Button type="submit">Post Comment</Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {comments.map((c) => (
              <li key={c.id} className="border-b pb-2 last:border-b-0">
                <p className="font-semibold">{c.author}</p>
                <p>{c.content}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}


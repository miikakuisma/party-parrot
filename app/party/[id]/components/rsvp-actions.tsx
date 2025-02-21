"use client"

import { Button } from "@/components/ui/button"
import { MoreVertical, Trash2, MessageSquareX } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface RsvpActionsProps {
  eventId: string
  rsvpId: number
  hasMessages?: boolean
}

export function RsvpActions({ eventId, rsvpId, hasMessages }: RsvpActionsProps) {
  const router = useRouter()

  const removeGuest = async () => {
    if (!confirm("Are you sure you want to remove this guest? This will also remove all their messages.")) return

    try {
      const response = await fetch(`/api/party/${eventId}/rsvp/${rsvpId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error()

      router.refresh()
      toast({
        title: "Success",
        description: "Guest has been removed",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove guest",
        variant: "destructive",
      })
    }
  }

  const removeMessages = async () => {
    if (!confirm("Are you sure you want to remove all messages from this guest?")) return

    try {
      const response = await fetch(`/api/party/${eventId}/rsvp/${rsvpId}/messages`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error()

      router.refresh()
      toast({
        title: "Success",
        description: "Messages have been removed",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove messages",
        variant: "destructive",
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {hasMessages && (
          <>
            <DropdownMenuItem
              onClick={removeMessages}
            >
              <MessageSquareX className="mr-2 h-4 w-4" />
              Remove Messages
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          className="text-destructive"
          onClick={removeGuest}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Remove Guest
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 
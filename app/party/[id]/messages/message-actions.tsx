"use client"

import { Button } from "@/components/ui/button"
import { MoreVertical, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface MessageActionsProps {
  eventId: string
  messageId: number
}

export function MessageActions({ eventId, messageId }: MessageActionsProps) {
  const router = useRouter()

  const deleteMessage = async () => {
    if (!confirm("Are you sure you want to delete this message?")) return

    try {
      const response = await fetch(`/api/party/${eventId}/message/${messageId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error()

      router.refresh()
      toast({
        title: "Success",
        description: "Message has been deleted",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message",
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
        <DropdownMenuItem
          className="text-destructive"
          onClick={deleteMessage}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Message
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 
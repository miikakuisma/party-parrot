import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; messageId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Verify the event belongs to the user
    const event = await sql`
      SELECT id FROM events 
      WHERE short_id = ${params.id}
      AND user_id = ${parseInt(session.user.id)}
    `

    if (event.rows.length === 0) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      )
    }

    await sql`
      DELETE FROM messages
      WHERE id = ${parseInt(params.messageId)}
      AND event_short_id = ${params.id}
    `

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete message error:', error)
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    )
  }
} 
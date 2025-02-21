import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { message, rsvpId } = await req.json()

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    await sql`
      INSERT INTO messages (
        event_short_id,
        rsvp_id,
        content
      ) VALUES (
        ${params.id},
        ${rsvpId || null},
        ${message}
      )
    `

    return NextResponse.json(
      { success: true },
      { status: 201 }
    )
  } catch (error) {
    console.error('Message error:', error)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
} 
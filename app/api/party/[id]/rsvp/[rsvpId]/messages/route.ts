import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; rsvpId: string } }
) {
  try {
    await sql`
      DELETE FROM messages
      WHERE rsvp_id = ${parseInt(params.rsvpId)}
      AND event_short_id = ${params.id}
    `

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete messages error:', error)
    return NextResponse.json(
      { error: "Failed to remove messages" },
      { status: 500 }
    )
  }
} 
import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; rsvpId: string } }
) {
  try {
    const { status } = await req.json()

    if (!status || !['attending', 'declined', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }

    await sql`
      UPDATE rsvps
      SET 
        status = ${status},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${parseInt(params.rsvpId)}
      AND event_id = ${parseInt(params.id)}
    `

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update RSVP error:', error)
    return NextResponse.json(
      { error: "Failed to update RSVP" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; rsvpId: string } }
) {
  try {
    // Delete associated messages first
    await sql`
      DELETE FROM messages
      WHERE rsvp_id = ${parseInt(params.rsvpId)}
      AND event_id = ${parseInt(params.id)}
    `

    // Then delete the RSVP
    await sql`
      DELETE FROM rsvps
      WHERE id = ${parseInt(params.rsvpId)}
      AND event_id = ${parseInt(params.id)}
    `

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete RSVP error:', error)
    return NextResponse.json(
      { error: "Failed to remove guest" },
      { status: 500 }
    )
  }
} 
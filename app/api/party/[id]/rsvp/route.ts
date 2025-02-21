import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, phone, allergies } = await req.json()

    // Basic validation
    if (!name || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create RSVP
    const result = await sql`
      INSERT INTO rsvps (
        event_short_id,
        name,
        phone,
        allergies
      ) VALUES (
        ${params.id},
        ${name},
        ${phone},
        ${allergies || null}
      )
      RETURNING id
    `

    return NextResponse.json(
      { id: result.rows[0].id },
      { status: 201 }
    )
  } catch (error) {
    console.error('RSVP error:', error)
    return NextResponse.json(
      { error: "Failed to create RSVP" },
      { status: 500 }
    )
  }
} 
import { sql } from '@vercel/postgres'
import { nanoid } from 'nanoid'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Get all events without short_id
    const events = await sql`
      SELECT id FROM events 
      WHERE short_id IS NULL
    `

    // Update each event with a new short_id
    for (const event of events.rows) {
      const shortId = nanoid(10)
      await sql`
        UPDATE events 
        SET short_id = ${shortId}
        WHERE id = ${event.id}
      `
    }

    // After all events have short_ids, make the column required
    await sql`
      ALTER TABLE events
      ALTER COLUMN short_id SET NOT NULL
    `

    return NextResponse.json(
      { message: `Updated ${events.rows.length} events with short IDs` },
      { status: 200 }
    )
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      { error: "Failed to update existing events" },
      { status: 500 }
    )
  }
} 
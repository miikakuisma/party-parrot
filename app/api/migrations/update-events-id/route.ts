import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // First create a new column
    await sql`
      ALTER TABLE events
      ADD COLUMN short_id TEXT UNIQUE;
    `

    // Then modify the foreign key constraints in rsvps and messages
    await sql`
      ALTER TABLE rsvps
      DROP CONSTRAINT rsvps_event_id_fkey,
      ADD COLUMN event_short_id TEXT REFERENCES events(short_id);
    `

    await sql`
      ALTER TABLE messages
      DROP CONSTRAINT messages_event_id_fkey,
      ADD COLUMN event_short_id TEXT REFERENCES events(short_id);
    `

    return NextResponse.json(
      { message: "Migration completed successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      { error: "Failed to run migration" },
      { status: 500 }
    )
  }
} 
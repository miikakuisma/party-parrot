import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS rsvps (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id),
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        allergies TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'attending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
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
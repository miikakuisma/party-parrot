import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Add image_url column if it doesn't exist
    await sql`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'events' 
          AND column_name = 'image_url'
        ) THEN 
          ALTER TABLE events 
          ADD COLUMN image_url TEXT;
        END IF;
      END $$;
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
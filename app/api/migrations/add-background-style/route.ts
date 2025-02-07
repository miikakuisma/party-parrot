import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Add background_style column if it doesn't exist
    await sql`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'events' 
          AND column_name = 'background_style'
        ) THEN 
          ALTER TABLE events 
          ADD COLUMN background_style TEXT DEFAULT 'default';
        END IF;
      END $$;
    `

    // Update existing events to have the default background style
    await sql`
      UPDATE events 
      SET background_style = 'default' 
      WHERE background_style IS NULL;
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
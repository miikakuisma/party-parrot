import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await sql`
      SELECT 
        id, 
        title, 
        date, 
        time, 
        location, 
        description,
        max_guests,
        image_url,
        background_style
      FROM events 
      WHERE id = ${parseInt(params.id)}
    `

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Fetch event error:', error)
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    )
  }
} 
import { getServerSession } from "next-auth"
import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import { authOptions } from "@/lib/auth"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await sql`
      SELECT * FROM events 
      WHERE id = ${parseInt(params.id)}
      AND user_id = ${parseInt(session.user.id)}
    `

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, date, time, location, description, maxGuests, imageUrl, background_style } = await req.json()

    // Basic validation
    if (!title || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Update event
    const result = await sql`
      UPDATE events 
      SET 
        title = ${title},
        date = ${date},
        time = ${time || null},
        location = ${location || null},
        description = ${description || null},
        max_guests = ${maxGuests ? parseInt(maxGuests) : null},
        image_url = ${imageUrl || null},
        background_style = ${background_style || 'default'},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${parseInt(params.id)}
      AND user_id = ${parseInt(session.user.id)}
      RETURNING id
    `

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Event not found or unauthorized" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { id: result.rows[0].id },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update event error:', error)
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    )
  }
} 
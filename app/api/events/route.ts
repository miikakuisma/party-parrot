import { getServerSession } from "next-auth"
import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, date, time, location, description, maxGuests, imageUrl } = await req.json()

    // Basic validation
    if (!title || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create event
    const result = await sql`
      INSERT INTO events (
        user_id, 
        title, 
        date, 
        time, 
        location, 
        description, 
        max_guests,
        image_url
      ) VALUES (
        ${parseInt(session.user.id)}, 
        ${title}, 
        ${date}, 
        ${time || null}, 
        ${location || null}, 
        ${description || null}, 
        ${maxGuests ? parseInt(maxGuests) : null},
        ${imageUrl || null}
      )
      RETURNING id
    `

    return NextResponse.json(
      { id: result.rows[0].id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create event error:', error)
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    )
  }
} 
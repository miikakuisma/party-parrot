import { sql } from '@vercel/postgres'
import { hash } from 'bcryptjs'
import { NextResponse } from 'next/server'

async function createTables() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Create events table
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        time TIME,
        location VARCHAR(255),
        description TEXT,
        max_guests INTEGER,
        status VARCHAR(50) DEFAULT 'upcoming',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    return true
  } catch (error) {
    console.error('Error creating tables:', error)
    throw error
  }
}

async function createSampleData() {
  try {
    // Create a sample user
    const hashedPassword = await hash('password123', 12)
    const userResult = await sql`
      INSERT INTO users (name, email, password)
      VALUES ('John Doe', 'john@example.com', ${hashedPassword})
      ON CONFLICT (email) DO UPDATE 
      SET name = EXCLUDED.name
      RETURNING id;
    `
    const userId = userResult.rows[0].id

    // Create sample events
    const sampleEvents = [
      {
        title: "Sarah's Princess Party",
        date: '2024-04-15',
        time: '14:00',
        location: '123 Party Lane, Funtown',
        description: 'A magical princess-themed birthday party',
        max_guests: 15,
        status: 'upcoming'
      },
      {
        title: "Tommy's Superhero Bash",
        date: '2024-05-20',
        time: '13:00',
        location: 'Adventure Park',
        description: 'Calling all superheroes for an action-packed celebration',
        max_guests: 20,
        status: 'upcoming'
      },
      {
        title: "Emma's Art Party",
        date: '2024-06-10',
        time: '15:00',
        location: 'Creative Kids Studio',
        description: 'An afternoon of painting, crafts, and creativity',
        max_guests: 12,
        status: 'upcoming'
      }
    ]

    // Insert sample events
    for (const event of sampleEvents) {
      await sql`
        INSERT INTO events (
          user_id, 
          title, 
          date, 
          time, 
          location, 
          description, 
          max_guests, 
          status
        ) VALUES (
          ${userId},
          ${event.title},
          ${event.date},
          ${event.time},
          ${event.location},
          ${event.description},
          ${event.max_guests},
          ${event.status}
        )
        ON CONFLICT DO NOTHING;
      `
    }

    return true
  } catch (error) {
    console.error('Error creating sample data:', error)
    throw error
  }
}

export async function GET() {
  try {
    await createTables()
    await createSampleData()

    return NextResponse.json(
      { message: "Database setup and sample data creation completed successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: "Failed to setup database and sample data" },
      { status: 500 }
    )
  }
} 
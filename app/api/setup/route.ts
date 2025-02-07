import { sql } from '@vercel/postgres'
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
        image_url TEXT,
        background_style TEXT DEFAULT 'default',
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

export async function GET() {
  try {
    await createTables()

    return NextResponse.json(
      { message: "Database setup completed successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: "Failed to setup database" },
      { status: 500 }
    )
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import { Job } from '@/models/Job'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; userType: string }

    if (decoded.userType !== 'employer') {
      return NextResponse.json(
        { error: 'Only employers can access this endpoint' },
        { status: 403 }
      )
    }

    await connectDB()

    const jobs = await Job.find({ employerId: decoded.userId })
      .sort({ createdAt: -1 })

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error('Get my jobs error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}


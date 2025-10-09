import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import { JobSeekerProfile } from '@/models/User'

export const dynamic = 'force-dynamic'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// GET - Get job seeker profile
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; userType: string }

    // Check if user is accessing their own profile
    if (decoded.userId !== params.id) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }

    await connectDB()

    const profile = await JobSeekerProfile.findOne({ userId: params.id })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT - Update job seeker profile
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; userType: string }

    if (decoded.userType !== 'jobseeker') {
      return NextResponse.json(
        { error: 'Only job seekers can update this profile' },
        { status: 403 }
      )
    }

    // Check if user is updating their own profile
    if (decoded.userId !== params.id) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Filter out empty experience entries
    if (body.experience) {
      body.experience = body.experience.filter((exp: any) => 
        exp.title && exp.company && exp.startDate
      )
    }

    // Filter out empty education entries
    if (body.education) {
      body.education = body.education.filter((edu: any) => 
        edu.degree && edu.institution && edu.startDate
      )
    }

    // Filter out empty portfolio entries
    if (body.portfolio) {
      body.portfolio = body.portfolio.filter((item: any) => 
        item.title && item.url
      )
    }

    await connectDB()

    // Find existing profile or create new one
    let profile = await JobSeekerProfile.findOne({ userId: params.id })

    if (profile) {
      // Update existing profile
      Object.assign(profile, body)
      await profile.save()
    } else {
      // Create new profile
      profile = await JobSeekerProfile.create({
        userId: params.id,
        location: body.location || 'Kenya',
        ...body,
      })
    }

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      profile 
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import { User, JobSeekerProfile, EmployerProfile } from '@/models/User'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, userType, firstName, lastName, country, ...profileData } = body

    // Validate required fields
    if (!email || !password || !userType || !firstName || !lastName || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate userType
    if (!['jobseeker', 'employer'].includes(userType)) {
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 400 }
      )
    }

    // For job seekers, ensure they are from Kenya
    if (userType === 'jobseeker' && country.toLowerCase() !== 'kenya') {
      return NextResponse.json(
        { error: 'Job seekers must be from Kenya' },
        { status: 400 }
      )
    }

    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      userType,
      firstName,
      lastName,
      country,
    })

    // Create corresponding profile
    if (userType === 'jobseeker') {
      await JobSeekerProfile.create({
        userId: user._id,
        location: profileData.location || 'Kenya',
        skills: [],
        experience: [],
        education: [],
        portfolio: [],
      })
    } else {
      await EmployerProfile.create({
        userId: user._id,
        companyName: profileData.companyName || '',
        location: profileData.location || country,
      })
    }

    // Return user data (without password)
    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    )
  }
}


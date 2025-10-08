import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import { Job } from '@/models/Job'
import { EmployerProfile } from '@/models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// GET - List all jobs with optional filters
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const remote = searchParams.get('remote')

    const query: any = { status: 'active' }

    if (category) query.category = category
    if (type) query.type = type
    if (remote === 'true') query.remote = true
    if (search) {
      query.$text = { $search: search }
    }

    const jobs = await Job.find(query)
      .populate('employerId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(50)

    // Get employer profiles for these jobs
    const employerIds = jobs.map(job => job.employerId)
    const profiles = await EmployerProfile.find({ userId: { $in: employerIds } })
    const profileMap = new Map(profiles.map(p => [p.userId.toString(), p]))

    const jobsWithEmployer = jobs.map(job => ({
      ...job.toObject(),
      employer: profileMap.get(job.employerId.toString()),
    }))

    return NextResponse.json({ jobs: jobsWithEmployer })
  } catch (error) {
    console.error('Get jobs error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

// POST - Create a new job (employers only)
export async function POST(request: NextRequest) {
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
        { error: 'Only employers can post jobs' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      requirements,
      responsibilities,
      type,
      location,
      remote,
      salary,
      skills,
      experience,
      category,
      status = 'active',
    } = body

    if (!title || !description || !type || !location || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await connectDB()

    const job = await Job.create({
      employerId: decoded.userId,
      title,
      description,
      requirements: requirements || [],
      responsibilities: responsibilities || [],
      type,
      location,
      remote: remote || false,
      salary,
      skills: skills || [],
      experience,
      category,
      status,
    })

    return NextResponse.json({ job }, { status: 201 })
  } catch (error) {
    console.error('Create job error:', error)
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    )
  }
}


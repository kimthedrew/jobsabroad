import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import { Application } from '@/models/Application'
import { Job } from '@/models/Job'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// GET - Get applications for current user
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

    await connectDB()

    let applications

    if (decoded.userType === 'jobseeker') {
      // Get applications by this job seeker
      applications = await Application.find({ jobSeekerId: decoded.userId })
        .populate('jobId')
        .populate('employerId', 'firstName lastName')
        .sort({ createdAt: -1 })
    } else {
      // Get applications for this employer's jobs
      applications = await Application.find({ employerId: decoded.userId })
        .populate('jobId')
        .populate('jobSeekerId', 'firstName lastName email')
        .sort({ createdAt: -1 })
    }

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Get applications error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

// POST - Create a new application (job seekers only)
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

    if (decoded.userType !== 'jobseeker') {
      return NextResponse.json(
        { error: 'Only job seekers can apply to jobs' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { jobId, coverLetter, resume } = body

    if (!jobId || !coverLetter) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await connectDB()

    // Get the job
    const job = await Job.findById(jobId)
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    if (job.status !== 'active') {
      return NextResponse.json(
        { error: 'This job is no longer accepting applications' },
        { status: 400 }
      )
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      jobId,
      jobSeekerId: decoded.userId,
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied to this job' },
        { status: 400 }
      )
    }

    // Create application
    const application = await Application.create({
      jobId,
      jobSeekerId: decoded.userId,
      employerId: job.employerId,
      coverLetter,
      resume,
    })

    // Increment application count
    job.applications += 1
    await job.save()

    return NextResponse.json({ application }, { status: 201 })
  } catch (error) {
    console.error('Create application error:', error)
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    )
  }
}


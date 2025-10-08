import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import { Application } from '@/models/Application'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// GET - Get a single application
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

    await connectDB()

    const application = await Application.findById(params.id)
      .populate('jobId')
      .populate('jobSeekerId', 'firstName lastName email')
      .populate('employerId', 'firstName lastName')

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Check authorization
    if (
      application.jobSeekerId._id.toString() !== decoded.userId &&
      application.employerId._id.toString() !== decoded.userId
    ) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }

    return NextResponse.json({ application })
  } catch (error) {
    console.error('Get application error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    )
  }
}

// PUT - Update application status (employer only)
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

    if (decoded.userType !== 'employer') {
      return NextResponse.json(
        { error: 'Only employers can update applications' },
        { status: 403 }
      )
    }

    await connectDB()

    const application = await Application.findById(params.id)

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    if (application.employerId.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { status, notes } = body

    if (status) application.status = status
    if (notes !== undefined) application.notes = notes

    await application.save()

    return NextResponse.json({ application })
  } catch (error) {
    console.error('Update application error:', error)
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
}


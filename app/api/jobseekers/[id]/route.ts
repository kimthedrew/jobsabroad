import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import { User, JobSeekerProfile } from '@/models/User'

export const dynamic = 'force-dynamic'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// GET - Fetch a single job seeker profile
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    
    await connectDB()

    // Verify user is an employer
    const user = await User.findById(decoded.userId)
    if (!user || user.userType !== 'employer') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Find job seeker with profile
    const jobSeeker = await User.aggregate([
      // Match the specific job seeker
      { $match: { _id: params.id, userType: 'jobseeker' } },
      
      // Lookup profile
      {
        $lookup: {
          from: 'jobseekerprofiles',
          localField: '_id',
          foreignField: 'userId',
          as: 'profile'
        }
      },
      
      // Unwind profile (job seekers without profiles will be excluded)
      { $unwind: '$profile' },
      
      // Project only needed fields
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          country: 1,
          createdAt: 1,
          'profile.phone': 1,
          'profile.location': 1,
          'profile.bio': 1,
          'profile.profilePhoto': 1,
          'profile.desiredJobTitle': 1,
          'profile.skills': 1,
          'profile.experience': 1,
          'profile.education': 1,
          'profile.portfolio': 1,
          'profile.availability': 1,
          'profile.desiredSalary': 1,
          'profile.currency': 1,
          'profile.linkedIn': 1,
          'profile.github': 1,
          'profile.website': 1,
          'profile.resume': 1,
          'profile.updatedAt': 1
        }
      }
    ])

    if (!jobSeeker || jobSeeker.length === 0) {
      return NextResponse.json({ error: 'Job seeker not found' }, { status: 404 })
    }

    return NextResponse.json({
      jobSeeker: jobSeeker[0]
    })

  } catch (error) {
    console.error('Error fetching job seeker:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job seeker' },
      { status: 500 }
    )
  }
}

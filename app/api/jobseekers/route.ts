import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import { User, JobSeekerProfile } from '@/models/User'

export const dynamic = 'force-dynamic'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// GET - Fetch job seekers with filters and pagination
export async function GET(request: NextRequest) {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const availability = searchParams.get('availability') || ''
    const location = searchParams.get('location') || ''
    const salaryMin = searchParams.get('salaryMin') || ''
    const salaryMax = searchParams.get('salaryMax') || ''
    const employmentType = searchParams.get('employmentType') || ''
    const skills = searchParams.get('skills')?.split(',').filter(Boolean) || []

    // Build query
    const query: any = { userType: 'jobseeker' }
    
    // Text search
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    // Build aggregation pipeline for advanced filtering
    const pipeline: any[] = [
      // Match job seekers
      { $match: query },
      
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
      
      // Add profile filters
      {
        $match: {
          ...(availability && { 'profile.availability': availability }),
          ...(location && {
            $or: [
              { 'profile.location': { $regex: location, $options: 'i' } },
              { country: { $regex: location, $options: 'i' } }
            ]
          }),
          ...(salaryMin && { 'profile.desiredSalary': { $gte: parseInt(salaryMin) } }),
          ...(salaryMax && { 'profile.desiredSalary': { $lte: parseInt(salaryMax) } }),
          ...(skills.length > 0 && {
            'profile.skills': { $in: skills.map(skill => new RegExp(skill, 'i')) }
          })
        }
      }
    ]

    // Add text search on profile fields if search term exists
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'profile.bio': { $regex: search, $options: 'i' } },
            { 'profile.desiredJobTitle': { $regex: search, $options: 'i' } },
            { 'profile.skills': { $in: [new RegExp(search, 'i')] } },
            { 'profile.experience.title': { $regex: search, $options: 'i' } },
            { 'profile.experience.company': { $regex: search, $options: 'i' } }
          ]
        }
      })
    }

    // Get total count for pagination
    const totalPipeline = [...pipeline, { $count: 'total' }]
    const totalResult = await User.aggregate(totalPipeline)
    const total = totalResult[0]?.total || 0

    // Add pagination and sorting
    pipeline.push(
      { $sort: { 'profile.updatedAt': -1 } }, // Sort by most recently updated profiles
      { $skip: (page - 1) * limit },
      { $limit: limit }
    )

    // Project only needed fields
    pipeline.push({
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
        'profile.availability': 1,
        'profile.desiredSalary': 1,
        'profile.currency': 1,
        'profile.linkedIn': 1,
        'profile.github': 1,
        'profile.website': 1,
        'profile.updatedAt': 1
      }
    })

    const jobSeekers = await User.aggregate(pipeline)

    return NextResponse.json({
      jobSeekers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })

  } catch (error) {
    console.error('Error fetching job seekers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job seekers' },
      { status: 500 }
    )
  }
}

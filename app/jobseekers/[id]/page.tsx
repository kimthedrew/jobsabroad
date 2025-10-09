'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaMapMarkerAlt, FaPhone, FaEnvelope, FaLinkedin, FaGithub, FaGlobe, FaDownload, FaCalendar, FaBriefcase, FaGraduationCap, FaStar, FaUser } from 'react-icons/fa'

interface JobSeeker {
  _id: string
  firstName: string
  lastName: string
  email: string
  country: string
  profile?: {
    phone?: string
    location: string
    bio?: string
    profilePhoto?: string
    desiredJobTitle?: string
    skills: string[]
    experience: any[]
    education: any[]
    portfolio: any[]
    availability: string
    desiredSalary?: number
    currency: string
    linkedIn?: string
    github?: string
    website?: string
    resume?: string
  }
}

export default function JobSeekerProfile({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [jobSeeker, setJobSeeker] = useState<JobSeeker | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      fetchJobSeeker()
    }
  }, [user, params.id])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/auth/login')
        return
      }
      const data = await response.json()
      if (data.user.userType !== 'employer') {
        router.push('/dashboard/jobseeker')
        return
      }
      setUser(data.user)
    } catch (error) {
      router.push('/auth/login')
    }
  }

  const fetchJobSeeker = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/jobseekers/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setJobSeeker(data.jobSeeker)
      } else {
        router.push('/jobseekers')
      }
    } catch (error) {
      console.error('Error fetching job seeker:', error)
      router.push('/jobseekers')
    } finally {
      setLoading(false)
    }
  }

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'immediate': return 'Available immediately'
      case '2weeks': return 'Available in 2 weeks'
      case '1month': return 'Available in 1 month'
      case 'not-looking': return 'Not actively looking'
      default: return availability
    }
  }

  const formatSalary = (salary?: number, currency?: string) => {
    if (!salary) return 'Not specified'
    return `${currency || 'USD'} ${salary.toLocaleString()}/month`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  const getExperienceYears = (experience: any[]) => {
    if (!experience || experience.length === 0) return 0
    
    const totalYears = experience.reduce((total, exp) => {
      const startDate = new Date(exp.startDate)
      const endDate = exp.current ? new Date() : new Date(exp.endDate)
      const years = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
      return total + years
    }, 0)
    
    return Math.round(totalYears)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!jobSeeker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaUser className="mx-auto text-5xl text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Profile not found</h3>
          <p className="text-gray-600 mb-6">The job seeker profile you're looking for doesn't exist.</p>
          <Link
            href="/jobseekers"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
          >
            Back to Job Seekers
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/jobseekers"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Job Seekers
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-8 py-12 text-white">
            <div className="flex items-start gap-6">
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                {jobSeeker.profile?.profilePhoto ? (
                  <img
                    src={jobSeeker.profile.profilePhoto}
                    alt={`${jobSeeker.firstName} ${jobSeeker.lastName}`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center border-4 border-white">
                    <FaUser className="text-4xl text-white" />
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {jobSeeker.firstName} {jobSeeker.lastName}
                </h1>
                <p className="text-xl text-primary-100 mb-4">
                  {jobSeeker.profile?.desiredJobTitle || 'Open to opportunities'}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-primary-100">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt />
                    {jobSeeker.profile?.location || jobSeeker.country}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendar />
                    {getAvailabilityText(jobSeeker.profile?.availability || '')}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaBriefcase />
                    {getExperienceYears(jobSeeker.profile?.experience || [])} years experience
                  </div>
                  <div className="flex items-center gap-2">
                    <FaStar />
                    {formatSalary(jobSeeker.profile?.desiredSalary, jobSeeker.profile?.currency)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-gray-400" />
                  <span className="text-gray-700">{jobSeeker.email}</span>
                </div>
                {jobSeeker.profile?.phone && (
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-gray-400" />
                    <span className="text-gray-700">{jobSeeker.profile.phone}</span>
                  </div>
                )}
                {jobSeeker.profile?.linkedIn && (
                  <div className="flex items-center gap-3">
                    <FaLinkedin className="text-gray-400" />
                    <a
                      href={jobSeeker.profile.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
                {jobSeeker.profile?.github && (
                  <div className="flex items-center gap-3">
                    <FaGithub className="text-gray-400" />
                    <a
                      href={jobSeeker.profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      GitHub Profile
                    </a>
                  </div>
                )}
                {jobSeeker.profile?.website && (
                  <div className="flex items-center gap-3">
                    <FaGlobe className="text-gray-400" />
                    <a
                      href={jobSeeker.profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      Personal Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            {jobSeeker.profile?.bio && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{jobSeeker.profile.bio}</p>
              </div>
            )}

            {/* Skills */}
            {jobSeeker.profile?.skills && jobSeeker.profile.skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {jobSeeker.profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {jobSeeker.profile?.experience && jobSeeker.profile.experience.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Work Experience</h2>
                <div className="space-y-6">
                  {jobSeeker.profile.experience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-primary-200 pl-6">
                      <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                      <p className="text-primary-600 font-medium">{exp.company}</p>
                      <p className="text-gray-600 text-sm mb-2">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </p>
                      {exp.location && (
                        <p className="text-gray-600 text-sm mb-2 flex items-center gap-1">
                          <FaMapMarkerAlt />
                          {exp.location}
                        </p>
                      )}
                      {exp.description && (
                        <p className="text-gray-700">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {jobSeeker.profile?.education && jobSeeker.profile.education.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Education</h2>
                <div className="space-y-4">
                  {jobSeeker.profile.education.map((edu, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="bg-primary-100 p-3 rounded-full">
                        <FaGraduationCap className="text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                        <p className="text-primary-600 font-medium">{edu.institution}</p>
                        {edu.location && (
                          <p className="text-gray-600 text-sm">{edu.location}</p>
                        )}
                        <p className="text-gray-600 text-sm">
                          {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio */}
            {jobSeeker.profile?.portfolio && jobSeeker.profile.portfolio.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Portfolio</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobSeeker.profile.portfolio.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                      {item.description && (
                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                      )}
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline text-sm"
                      >
                        View Project →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resume */}
            {jobSeeker.profile?.resume && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Resume</h2>
                <a
                  href={jobSeeker.profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
                >
                  <FaDownload />
                  Download Resume
                </a>
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-t pt-8">
              <div className="flex gap-4">
                <Link
                  href={`/dashboard/employer/post-job?hiring=${jobSeeker._id}`}
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition font-medium"
                >
                  Post a Job for {jobSeeker.firstName}
                </Link>
                <Link
                  href="/jobseekers"
                  className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  View Other Candidates
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

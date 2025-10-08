'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaUser, FaEnvelope, FaCalendar, FaEye, FaCheck, FaTimes, FaClock, FaFileAlt } from 'react-icons/fa'

interface Application {
  _id: string
  status: string
  coverLetter: string
  notes?: string
  createdAt: string
  jobId: {
    _id: string
    title: string
    type: string
    location: string
  }
  jobSeekerId: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  profile?: {
    phone?: string
    location: string
    bio?: string
    desiredJobTitle?: string
    skills: string[]
    experience: any[]
    education: any[]
    portfolio: any[]
    linkedIn?: string
    github?: string
    website?: string
    resume?: string
    availability: string
    desiredSalary?: number
    currency: string
  }
}

export default function EmployerApplications() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    checkAuth()
  }, [])

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
      fetchApplications()
    } catch (error) {
      router.push('/auth/login')
    }
  }

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/applications')
      const data = await response.json()
      
      // Fetch profiles for each application
      const applicationsWithProfiles = await Promise.all(
        data.applications.map(async (app: Application) => {
          try {
            const profileResponse = await fetch(`/api/profile/jobseeker/${app.jobSeekerId._id}`)
            if (profileResponse.ok) {
              const profileData = await profileResponse.json()
              return { ...app, profile: profileData.profile }
            }
          } catch (error) {
            console.error('Error fetching profile:', error)
          }
          return app
        })
      )
      
      setApplications(applicationsWithProfiles)
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (applicationId: string, status: string, notes?: string) => {
    try {
      setUpdating(true)
      setError('')
      
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update application')
      }

      // Update the application in the list
      setApplications(prev => 
        prev.map(app => 
          app._id === applicationId 
            ? { ...app, status, notes: notes || app.notes }
            : app
        )
      )

      setSuccess(`Application ${status} successfully!`)
      setTimeout(() => setSuccess(''), 3000)
      setShowModal(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'shortlisted':
        return 'bg-blue-100 text-blue-800'
      case 'reviewed':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <FaCheck className="text-green-600" />
      case 'rejected':
        return <FaTimes className="text-red-600" />
      case 'reviewed':
        return <FaEye className="text-yellow-600" />
      default:
        return <FaClock className="text-gray-600" />
    }
  }

  const filteredApplications = filterStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === filterStatus)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/dashboard/employer"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <FaFileAlt className="mx-auto text-5xl text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600 mb-6">
                {filterStatus === 'all' 
                  ? "You haven't received any applications yet." 
                  : `No applications with status "${filterStatus}" found.`
                }
              </p>
              <Link
                href="/dashboard/employer/post-job"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
              >
                Post a Job
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredApplications.map((application) => (
                <div
                  key={application._id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {application.jobSeekerId.firstName} {application.jobSeekerId.lastName}
                      </h3>
                      <p className="text-gray-600">{application.jobId.title}</p>
                      <p className="text-sm text-gray-500">
                        Applied {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(application.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Cover Letter</h4>
                      <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                        {application.coverLetter}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Job Details</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Position:</strong> {application.jobId.title}</p>
                        <p><strong>Type:</strong> {application.jobId.type}</p>
                        <p><strong>Location:</strong> {application.jobId.location}</p>
                      </div>
                      
                      {application.profile && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Candidate Info</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Email:</strong> {application.jobSeekerId.email}</p>
                            <p><strong>Location:</strong> {application.profile.location}</p>
                            {application.profile.desiredJobTitle && (
                              <p><strong>Desired Role:</strong> {application.profile.desiredJobTitle}</p>
                            )}
                            {application.profile.availability && (
                              <p><strong>Availability:</strong> {application.profile.availability}</p>
                            )}
                            {application.profile.desiredSalary && (
                              <p><strong>Expected Salary:</strong> {application.profile.currency} {application.profile.desiredSalary.toLocaleString()}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {application.profile?.skills && application.profile.skills.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {application.profile.skills.slice(0, 8).map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                        {application.profile.skills.length > 8 && (
                          <span className="text-gray-600 px-3 py-1 text-sm">
                            +{application.profile.skills.length - 8} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={() => {
                        setSelectedApplication(application)
                        setShowModal(true)
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      <FaEye />
                      Review & Respond
                    </button>
                    
                    {application.profile?.resume && (
                      <a
                        href={application.profile.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
                      >
                        <FaFileAlt />
                        View Resume
                      </a>
                    )}
                    
                    {application.profile?.linkedIn && (
                      <a
                        href={application.profile.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition flex items-center gap-2"
                      >
                        <FaUser />
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Review Application from {selectedApplication.jobSeekerId.firstName} {selectedApplication.jobSeekerId.lastName}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Application Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Job Position</h4>
                      <p className="text-gray-700">{selectedApplication.jobId.title}</p>
                      <p className="text-sm text-gray-600">{selectedApplication.jobId.type} • {selectedApplication.jobId.location}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Application Date</h4>
                      <p className="text-gray-700">{new Date(selectedApplication.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Candidate Profile */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Candidate Profile</h3>
                  
                  {selectedApplication.profile ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                        <div className="text-sm space-y-1">
                          <p><strong>Email:</strong> {selectedApplication.jobSeekerId.email}</p>
                          {selectedApplication.profile.phone && (
                            <p><strong>Phone:</strong> {selectedApplication.profile.phone}</p>
                          )}
                          <p><strong>Location:</strong> {selectedApplication.profile.location}</p>
                        </div>
                      </div>

                      {selectedApplication.profile.bio && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Bio</h4>
                          <p className="text-gray-700 text-sm">{selectedApplication.profile.bio}</p>
                        </div>
                      )}

                      {selectedApplication.profile.desiredJobTitle && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Desired Position</h4>
                          <p className="text-gray-700">{selectedApplication.profile.desiredJobTitle}</p>
                        </div>
                      )}

                      {selectedApplication.profile.skills && selectedApplication.profile.skills.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedApplication.profile.skills.map((skill: string, index: number) => (
                              <span
                                key={index}
                                className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedApplication.profile.experience && selectedApplication.profile.experience.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
                          <div className="space-y-2">
                            {selectedApplication.profile.experience.slice(0, 2).map((exp: any, index: number) => (
                              <div key={index} className="bg-gray-50 p-3 rounded">
                                <p className="font-medium text-sm">{exp.title} at {exp.company}</p>
                                <p className="text-xs text-gray-600">{exp.location}</p>
                              </div>
                            ))}
                            {selectedApplication.profile.experience.length > 2 && (
                              <p className="text-xs text-gray-500">+{selectedApplication.profile.experience.length - 2} more positions</p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        {selectedApplication.profile.resume && (
                          <a
                            href={selectedApplication.profile.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition"
                          >
                            View Resume
                          </a>
                        )}
                        {selectedApplication.profile.linkedIn && (
                          <a
                            href={selectedApplication.profile.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-800 text-white px-3 py-2 rounded text-sm hover:bg-blue-900 transition"
                          >
                            LinkedIn
                          </a>
                        )}
                        {selectedApplication.profile.github && (
                          <a
                            href={selectedApplication.profile.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-800 text-white px-3 py-2 rounded text-sm hover:bg-gray-900 transition"
                          >
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Profile not available</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Application Status</h3>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  <button
                    onClick={() => updateApplicationStatus(selectedApplication._id, 'reviewed')}
                    disabled={updating}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    <FaEye />
                    Mark as Reviewed
                  </button>
                  
                  <button
                    onClick={() => updateApplicationStatus(selectedApplication._id, 'shortlisted')}
                    disabled={updating}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    <FaCheck />
                    Shortlist
                  </button>
                  
                  <button
                    onClick={() => updateApplicationStatus(selectedApplication._id, 'accepted')}
                    disabled={updating}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    <FaCheck />
                    Accept
                  </button>
                  
                  <button
                    onClick={() => updateApplicationStatus(selectedApplication._id, 'rejected')}
                    disabled={updating}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    <FaTimes />
                    Reject
                  </button>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

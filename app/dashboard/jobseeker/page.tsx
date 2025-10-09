'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaBriefcase, FaClock, FaCheckCircle, FaTimes, FaEye, FaUser } from 'react-icons/fa'

interface Application {
  _id: string
  status: string
  createdAt: string
  jobId: {
    _id: string
    title: string
    type: string
    location: string
  }
  employerId: {
    firstName: string
    lastName: string
  }
}

export default function JobSeekerDashboard() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

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
      if (data.user.userType !== 'jobseeker') {
        router.push('/dashboard/employer')
        return
      }
      setUser(data.user)
      fetchApplications()
      fetchProfile(data.user.id)
    } catch (error) {
      router.push('/auth/login')
    }
  }

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications')
      const data = await response.json()
      setApplications(data.applications)
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProfile = async (userId: string) => {
    try {
      const response = await fetch(`/api/profile/jobseeker/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
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
        return <FaCheckCircle className="text-green-600" />
      case 'rejected':
        return <FaTimes className="text-red-600" />
      case 'reviewed':
        return <FaEye className="text-yellow-600" />
      default:
        return <FaClock className="text-gray-600" />
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

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
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Profile Photo */}
              {profile?.profilePhoto ? (
                <img
                  src={profile.profilePhoto}
                  alt={`${user?.firstName} ${user?.lastName}`}
                  className="w-20 h-20 rounded-full object-cover border-4 border-primary-100"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                  <FaUser className="text-3xl text-gray-400" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.firstName}!
                </h1>
                <p className="text-gray-600 mt-2">Manage your job applications and profile</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
              </div>
              <FaBriefcase className="text-4xl text-primary-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {applications.filter(a => a.status === 'pending').length}
                </p>
              </div>
              <FaClock className="text-4xl text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Shortlisted</p>
                <p className="text-3xl font-bold text-blue-600">
                  {applications.filter(a => a.status === 'shortlisted').length}
                </p>
              </div>
              <FaCheckCircle className="text-4xl text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Accepted</p>
                <p className="text-3xl font-bold text-green-600">
                  {applications.filter(a => a.status === 'accepted').length}
                </p>
              </div>
              <FaCheckCircle className="text-4xl text-green-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/jobs"
            className="bg-primary-600 text-white p-6 rounded-lg shadow-md hover:bg-primary-700 transition"
          >
            <FaBriefcase className="text-3xl mb-3" />
            <h3 className="text-xl font-bold mb-2">Browse Jobs</h3>
            <p className="text-primary-100">Find your next opportunity</p>
          </Link>
          <Link
            href="/dashboard/jobseeker/profile"
            className="bg-blue-600 text-white p-6 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            <FaUser className="text-3xl mb-3" />
            <h3 className="text-xl font-bold mb-2">Edit Profile</h3>
            <p className="text-blue-100">Update your information and skills</p>
          </Link>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Applications</h2>
          
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <FaBriefcase className="mx-auto text-5xl text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600 mb-6">Start applying to jobs to see them here</p>
              <Link
                href="/jobs"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
              >
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application._id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {application.jobId.title}
                      </h3>
                      <p className="text-gray-600">
                        {application.employerId.firstName} {application.employerId.lastName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(application.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>{application.jobId.type}</span>
                    <span>{application.jobId.location}</span>
                    <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaBriefcase, FaUsers, FaEye, FaPlus, FaEdit, FaTrash } from 'react-icons/fa'

interface Job {
  _id: string
  title: string
  type: string
  location: string
  status: string
  applications: number
  views: number
  createdAt: string
}

export default function EmployerDashboard() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

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
      fetchJobs()
    } catch (error) {
      router.push('/auth/login')
    }
  }

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs/my-jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs || [])
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  const totalApplications = jobs.reduce((sum, job) => sum + job.applications, 0)
  const totalViews = jobs.reduce((sum, job) => sum + job.views, 0)

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
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-600 mt-2">Manage your job postings and applications</p>
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
                <p className="text-gray-600 text-sm">Active Jobs</p>
                <p className="text-3xl font-bold text-gray-900">
                  {jobs.filter(j => j.status === 'active').length}
                </p>
              </div>
              <FaBriefcase className="text-4xl text-primary-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Jobs</p>
                <p className="text-3xl font-bold text-blue-600">{jobs.length}</p>
              </div>
              <FaBriefcase className="text-4xl text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Applications</p>
                <p className="text-3xl font-bold text-green-600">{totalApplications}</p>
              </div>
              <FaUsers className="text-4xl text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Views</p>
                <p className="text-3xl font-bold text-yellow-600">{totalViews}</p>
              </div>
              <FaEye className="text-4xl text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/dashboard/employer/post-job"
            className="bg-primary-600 text-white p-6 rounded-lg shadow-md hover:bg-primary-700 transition"
          >
            <FaPlus className="text-3xl mb-3" />
            <h3 className="text-xl font-bold mb-2">Post a Job</h3>
            <p className="text-primary-100">Create a new job posting</p>
          </Link>
          <Link
            href="/dashboard/employer/applications"
            className="bg-blue-600 text-white p-6 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            <FaUsers className="text-3xl mb-3" />
            <h3 className="text-xl font-bold mb-2">View Applications</h3>
            <p className="text-blue-100">Review candidates for your jobs</p>
          </Link>
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Job Postings</h2>
            <Link
              href="/dashboard/employer/post-job"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center"
            >
              <FaPlus className="mr-2" />
              Post New Job
            </Link>
          </div>
          
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <FaBriefcase className="mx-auto text-5xl text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
              <p className="text-gray-600 mb-6">Create your first job posting to start hiring</p>
              <Link
                href="/dashboard/employer/post-job"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
              >
                Post a Job
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                        <span>{job.type}</span>
                        <span>{job.location}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            job.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : job.status === 'draft'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/jobs/${job._id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="View"
                      >
                        <FaEye />
                      </Link>
                      <Link
                        href={`/dashboard/employer/edit-job/${job._id}`}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                    </div>
                  </div>
                  <div className="flex gap-6 text-sm text-gray-600">
                    <span className="flex items-center">
                      <FaUsers className="mr-2" />
                      {job.applications} applications
                    </span>
                    <span className="flex items-center">
                      <FaEye className="mr-2" />
                      {job.views} views
                    </span>
                    <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
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


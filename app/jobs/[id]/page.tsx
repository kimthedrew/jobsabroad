'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaMapMarkerAlt, FaBriefcase, FaClock, FaBuilding, FaGlobe, FaArrowLeft } from 'react-icons/fa'

interface Job {
  _id: string
  title: string
  description: string
  requirements: string[]
  responsibilities: string[]
  type: string
  location: string
  remote: boolean
  category: string
  salary?: {
    min: number
    max: number
    currency: string
  }
  skills: string[]
  experience: string
  createdAt: string
  views: number
  applications: number
  employer?: {
    companyName: string
    location: string
    description: string
    companyWebsite: string
  }
}

export default function JobDetail() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [applying, setApplying] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchJob()
    }
  }, [params.id])

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${params.id}`)
      const data = await response.json()
      setJob(data.job)
    } catch (error) {
      console.error('Error fetching job:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setApplying(true)

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: params.id,
          coverLetter,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Application failed')
      }

      alert('Application submitted successfully!')
      setShowApplyModal(false)
      router.push('/dashboard/jobseeker')
    } catch (err: any) {
      if (err.message.includes('authenticated')) {
        router.push('/auth/login')
      } else {
        setError(err.message)
      }
    } finally {
      setApplying(false)
    }
  }

  const getTimeAgo = (date: string) => {
    const now = new Date()
    const posted = new Date(date)
    const days = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return `${Math.floor(days / 30)} months ago`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h1>
          <Link href="/jobs" className="text-primary-600 hover:text-primary-700">
            Back to jobs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/jobs"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
              
              {job.employer && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-primary-600 mb-2">
                    {job.employer.companyName}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-gray-600">
                    <span className="flex items-center">
                      <FaMapMarkerAlt className="mr-2" />
                      {job.location} {job.remote && '(Remote)'}
                    </span>
                    <span className="flex items-center">
                      <FaBriefcase className="mr-2" />
                      {job.type}
                    </span>
                    <span className="flex items-center">
                      <FaClock className="mr-2" />
                      Posted {getTimeAgo(job.createdAt)}
                    </span>
                  </div>
                </div>
              )}

              {job.salary && (
                <div className="bg-primary-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-1">Salary Range</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">per year</p>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">About the Role</h3>
                <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
              </div>

              {job.responsibilities && job.responsibilities.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Responsibilities</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {job.responsibilities.map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {job.requirements && job.requirements.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {job.skills && job.skills.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <button
                onClick={() => setShowApplyModal(true)}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition mb-6"
              >
                Apply Now
              </button>

              {job.employer && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">About the Company</h3>
                  <div className="space-y-3">
                    <p className="flex items-center text-gray-700">
                      <FaBuilding className="mr-3 text-primary-600" />
                      {job.employer.companyName}
                    </p>
                    <p className="flex items-center text-gray-700">
                      <FaMapMarkerAlt className="mr-3 text-primary-600" />
                      {job.employer.location}
                    </p>
                    {job.employer.companyWebsite && (
                      <a
                        href={job.employer.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary-600 hover:text-primary-700"
                      >
                        <FaGlobe className="mr-3" />
                        Visit Website
                      </a>
                    )}
                  </div>
                  {job.employer.description && (
                    <p className="mt-4 text-gray-600 text-sm">{job.employer.description}</p>
                  )}
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">{job.applications}</span> applications
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">{job.views}</span> views
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Apply for {job.title}</h2>
            
            {error && (
              <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleApply}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter *
                </label>
                <textarea
                  required
                  rows={10}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell the employer why you're a great fit for this role..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}


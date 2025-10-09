'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaSearch, FaMapMarkerAlt, FaClock, FaDollarSign, FaStar, FaEye, FaUser, FaGraduationCap, FaBriefcase } from 'react-icons/fa'

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
    availability: string
    desiredSalary?: number
    currency: string
    linkedIn?: string
    github?: string
    website?: string
  }
}

export default function JobSeekersPage() {
  const router = useRouter()
  const [jobSeekers, setJobSeekers] = useState<JobSeeker[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    skills: [] as string[],
    availability: '',
    salaryMin: '',
    salaryMax: '',
    location: '',
    employmentType: ''
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [user, setUser] = useState<any>(null)

  const itemsPerPage = 10

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      fetchJobSeekers()
    }
  }, [user, currentPage, searchTerm, filters])

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

  const fetchJobSeekers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filters.availability && { availability: filters.availability }),
        ...(filters.location && { location: filters.location }),
        ...(filters.salaryMin && { salaryMin: filters.salaryMin }),
        ...(filters.salaryMax && { salaryMax: filters.salaryMax }),
        ...(filters.employmentType && { employmentType: filters.employmentType }),
        ...(filters.skills.length > 0 && { skills: filters.skills.join(',') })
      })

      const response = await fetch(`/api/jobseekers?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setJobSeekers(data.jobSeekers)
        setTotalPages(Math.ceil(data.total / itemsPerPage))
      }
    } catch (error) {
      console.error('Error fetching job seekers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchJobSeekers()
  }

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const addSkillFilter = (skill: string) => {
    if (!filters.skills.includes(skill)) {
      setFilters(prev => ({ ...prev, skills: [...prev.skills, skill] }))
      setCurrentPage(1)
    }
  }

  const removeSkillFilter = (skill: string) => {
    setFilters(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }))
    setCurrentPage(1)
  }

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'immediate': return 'Immediate'
      case '2weeks': return '2 weeks'
      case '1month': return '1 month'
      case 'not-looking': return 'Not actively looking'
      default: return availability
    }
  }

  const formatSalary = (salary?: number, currency?: string) => {
    if (!salary) return 'Not specified'
    return `${currency || 'USD'} ${salary.toLocaleString()}/month`
  }

  const getExperienceYears = (experience: any[]) => {
    if (!experience || experience.length === 0) return 'No experience'
    
    const totalYears = experience.reduce((total, exp) => {
      const startDate = new Date(exp.startDate)
      const endDate = exp.current ? new Date() : new Date(exp.endDate)
      const years = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
      return total + years
    }, 0)
    
    return `${Math.round(totalYears)} years experience`
  }

  if (loading && jobSeekers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job seekers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Talent</h1>
          <p className="text-gray-600">Discover skilled Kenyan professionals ready to work with you</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Try: React, Customer Service, Marketing..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              type="submit"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
            >
              SEARCH
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-2">
            Better Search Results? <Link href="/help" className="text-primary-600 hover:underline">Learn more</Link>
          </p>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-700">
            Found {jobSeekers.length} job seekers.
            {totalPages > 1 && (
              <span className="ml-4">
                Page {currentPage} of {totalPages}
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Active Skill Filters */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">ACTIVE SKILL FILTERS</h4>
                <div className="space-y-2">
                  {filters.skills.map(skill => (
                    <div key={skill} className="flex items-center justify-between bg-primary-100 px-3 py-1 rounded">
                      <span className="text-sm text-primary-800">{skill}</span>
                      <button
                        onClick={() => removeSkillFilter(skill)}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <Link href="/skills" className="text-primary-600 hover:underline text-sm">
                    + Add skill filters
                  </Link>
                </div>
              </div>

              {/* Employment Type */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">EMPLOYMENT TYPE</h4>
                <select
                  value={filters.employmentType}
                  onChange={(e) => handleFilterChange('employmentType', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Any</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">AVAILABILITY</h4>
                <select
                  value={filters.availability}
                  onChange={(e) => handleFilterChange('availability', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Any</option>
                  <option value="immediate">Immediate</option>
                  <option value="2weeks">2 weeks</option>
                  <option value="1month">1 month</option>
                </select>
              </div>

              {/* Salary Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">MONTHLY SALARY BETWEEN (USD)</h4>
                <div className="space-y-2">
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.salaryMin}
                      onChange={(e) => handleFilterChange('salaryMin', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.salaryMax}
                      onChange={(e) => handleFilterChange('salaryMax', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">LOCATION</h4>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="City or country"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Job Seekers List */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobSeekers.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FaUser className="mx-auto text-5xl text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No job seekers found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters to find more candidates.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setFilters({
                      skills: [],
                      availability: '',
                      salaryMin: '',
                      salaryMax: '',
                      location: '',
                      employmentType: ''
                    })
                    setCurrentPage(1)
                  }}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {jobSeekers.map((jobSeeker) => (
                  <div key={jobSeeker._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                    <div className="flex items-start gap-4">
                      {/* Profile Photo */}
                      <div className="flex-shrink-0">
                        {jobSeeker.profile?.profilePhoto ? (
                          <img
                            src={jobSeeker.profile.profilePhoto}
                            alt={`${jobSeeker.firstName} ${jobSeeker.lastName}`}
                            className="w-20 h-20 rounded-full object-cover border-2 border-primary-100"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                            <FaUser className="text-2xl text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Job Seeker Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-primary-600 mb-1">
                              {jobSeeker.firstName} {jobSeeker.lastName}
                            </h3>
                            <p className="text-gray-700 font-medium mb-2">
                              {jobSeeker.profile?.desiredJobTitle || 'Open to opportunities'}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <FaMapMarkerAlt className="text-gray-400" />
                                {jobSeeker.profile?.location || jobSeeker.country}
                              </div>
                              <div className="flex items-center gap-1">
                                <FaClock className="text-gray-400" />
                                {getAvailabilityText(jobSeeker.profile?.availability || '')}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                              <FaStar className="text-gray-400" />
                              PIN
                            </button>
                            <Link
                              href={`/jobseekers/${jobSeeker._id}`}
                              className="flex items-center gap-2 px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                            >
                              <FaEye />
                              VIEW PROFILE
                            </Link>
                          </div>
                        </div>

                        {/* Key Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">LOOKING FOR:</h4>
                            <p className="text-sm text-gray-700">
                              {jobSeeker.profile?.desiredJobTitle ? 'Full-time work' : 'Open to opportunities'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatSalary(jobSeeker.profile?.desiredSalary, jobSeeker.profile?.currency)}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">EDUCATION:</h4>
                            <p className="text-sm text-gray-700">
                              {jobSeeker.profile?.education && jobSeeker.profile.education.length > 0
                                ? jobSeeker.profile.education[0].degree
                                : 'Not specified'
                              }
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">EXPERIENCE:</h4>
                            <p className="text-sm text-gray-700">
                              {getExperienceYears(jobSeeker.profile?.experience || [])}
                            </p>
                          </div>
                        </div>

                        {/* Bio */}
                        {jobSeeker.profile?.bio && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-1">PROFILE DESCRIPTION:</h4>
                            <p className="text-sm text-gray-700 line-clamp-3">
                              {jobSeeker.profile.bio}
                            </p>
                          </div>
                        )}

                        {/* Top Skills */}
                        {jobSeeker.profile?.skills && jobSeeker.profile.skills.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">TOP SKILLS:</h4>
                            <div className="flex flex-wrap gap-2">
                              {jobSeeker.profile.skills.slice(0, 5).map((skill, index) => (
                                <span
                                  key={index}
                                  onClick={() => addSkillFilter(skill)}
                                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-primary-100 hover:text-primary-700 cursor-pointer transition"
                                >
                                  {skill}
                                </span>
                              ))}
                              {jobSeeker.profile.skills.length > 5 && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                  +{jobSeeker.profile.skills.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                    if (pageNum > totalPages) return null
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 border rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

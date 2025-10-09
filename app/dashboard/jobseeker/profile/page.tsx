'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaPlus, FaTrash, FaSave } from 'react-icons/fa'

interface Education {
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  current: boolean
}

interface Experience {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface Portfolio {
  title: string
  description: string
  url: string
}

export default function JobSeekerProfile() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [user, setUser] = useState<any>(null)

  const [formData, setFormData] = useState({
    // Personal Information
    phone: '',
    location: '',
    bio: '',
    profilePhoto: '',
    
    // Job Preferences
    desiredJobTitle: '',
    desiredSalary: '',
    currency: 'USD',
    availability: 'immediate',
    
    // Skills
    skills: [] as string[],
    skillInput: '',
    
    // Links
    linkedIn: '',
    github: '',
    website: '',
    resume: '',
    
    // Education
    education: [] as Education[],
    
    // Experience
    experience: [] as Experience[],
    
    // Portfolio
    portfolio: [] as Portfolio[],
  })

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
      fetchProfile(data.user.id)
    } catch (error) {
      router.push('/auth/login')
    }
  }

  const fetchProfile = async (userId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/profile/jobseeker/${userId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.profile) {
          // Populate form with existing data
          setFormData({
            phone: data.profile.phone || '',
            location: data.profile.location || '',
            bio: data.profile.bio || '',
            profilePhoto: data.profile.profilePhoto || '',
            desiredJobTitle: data.profile.desiredJobTitle || '',
            desiredSalary: data.profile.desiredSalary || '',
            currency: data.profile.currency || 'USD',
            availability: data.profile.availability || 'immediate',
            skills: data.profile.skills || [],
            skillInput: '',
            linkedIn: data.profile.linkedIn || '',
            github: data.profile.github || '',
            website: data.profile.website || '',
            resume: data.profile.resume || '',
            education: data.profile.education || [],
            experience: data.profile.experience || [],
            portfolio: data.profile.portfolio || [],
          })
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, etc.)')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      // Convert image to base64
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setFormData({ ...formData, profilePhoto: base64String })
        setSuccess('Photo uploaded! Remember to save your changes.')
        setTimeout(() => setSuccess(''), 3000)
      }
      reader.onerror = () => {
        setError('Failed to read the image file')
      }
      reader.readAsDataURL(file)
    } catch (err: any) {
      setError('Failed to upload image: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      // Filter out empty entries before sending
      const filteredExperience = formData.experience.filter(exp => 
        exp.title && exp.company && exp.startDate
      )
      
      const filteredEducation = formData.education.filter(edu => 
        edu.degree && edu.institution && edu.startDate
      )
      
      const filteredPortfolio = formData.portfolio.filter(item => 
        item.title && item.url
      )

      const response = await fetch(`/api/profile/jobseeker/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          profilePhoto: formData.profilePhoto,
          desiredJobTitle: formData.desiredJobTitle,
          desiredSalary: formData.desiredSalary ? parseInt(formData.desiredSalary) : undefined,
          currency: formData.currency,
          availability: formData.availability,
          skills: formData.skills,
          linkedIn: formData.linkedIn,
          github: formData.github,
          website: formData.website,
          resume: formData.resume,
          education: filteredEducation,
          experience: filteredExperience,
          portfolio: filteredPortfolio,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save profile')
      }

      // Update form state to remove empty entries
      setFormData(prev => ({
        ...prev,
        experience: filteredExperience,
        education: filteredEducation,
        portfolio: filteredPortfolio,
      }))

      setSuccess('Profile saved successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  // Skills Management
  const addSkill = () => {
    if (formData.skillInput.trim() && !formData.skills.includes(formData.skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, formData.skillInput.trim()],
        skillInput: '',
      })
    }
  }

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    })
  }

  // Education Management
  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          degree: '',
          institution: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
        },
      ],
    })
  }

  const updateEducation = (index: number, field: string, value: any) => {
    const updated = [...formData.education]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, education: updated })
  }

  const removeEducation = (index: number) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    })
  }

  // Experience Management
  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        {
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        },
      ],
    })
  }

  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...formData.experience]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, experience: updated })
  }

  const removeExperience = (index: number) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index),
    })
  }

  // Portfolio Management
  const addPortfolio = () => {
    setFormData({
      ...formData,
      portfolio: [
        ...formData.portfolio,
        {
          title: '',
          description: '',
          url: '',
        },
      ],
    })
  }

  const updatePortfolio = (index: number, field: string, value: string) => {
    const updated = [...formData.portfolio]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, portfolio: updated })
  }

  const removePortfolio = (index: number) => {
    setFormData({
      ...formData,
      portfolio: formData.portfolio.filter((_, i) => i !== index),
    })
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/dashboard/jobseeker"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Edit Your Profile</h1>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              <FaSave />
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* Personal Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Information</h2>
            
            {/* Profile Photo */}
            <div className="mb-6 flex items-center space-x-6">
              <div className="flex-shrink-0">
                {formData.profilePhoto ? (
                  <img
                    src={formData.profilePhoto}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary-100"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                    <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo
                </label>
                
                {/* Upload Button */}
                <div className="mb-3">
                  <label className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer transition">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {uploading ? 'Uploading...' : 'Upload Photo'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  <span className="ml-3 text-sm text-gray-500">or enter URL below</span>
                </div>

                {/* URL Input */}
                <input
                  type="url"
                  value={formData.profilePhoto.startsWith('data:') ? '' : formData.profilePhoto}
                  onChange={(e) => setFormData({ ...formData, profilePhoto: e.target.value })}
                  placeholder="https://example.com/your-photo.jpg"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={formData.profilePhoto.startsWith('data:')}
                />
                
                <p className="mt-2 text-sm text-gray-500">
                  {formData.profilePhoto.startsWith('data:') ? (
                    <span className="text-green-600">✓ Photo uploaded successfully. Click "Save Changes" below to save.</span>
                  ) : (
                    'Upload a photo from your device or enter a URL (e.g., from LinkedIn). Recommended: Square image, at least 400x400px, max 5MB.'
                  )}
                </p>
                
                {/* Remove Photo Button */}
                {formData.profilePhoto && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, profilePhoto: '' })}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 transition"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+254 712 345 678"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location (City)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Nairobi"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Bio
              </label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell employers about yourself, your experience, and what makes you unique..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </section>

          {/* Job Preferences */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desired Job Title
                </label>
                <input
                  type="text"
                  value={formData.desiredJobTitle}
                  onChange={(e) => setFormData({ ...formData, desiredJobTitle: e.target.value })}
                  placeholder="e.g. Software Developer"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="immediate">Available Immediately</option>
                  <option value="2weeks">Available in 2 Weeks</option>
                  <option value="1month">Available in 1 Month</option>
                  <option value="not-looking">Not Currently Looking</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Salary (Annual)
                </label>
                <input
                  type="number"
                  value={formData.desiredSalary}
                  onChange={(e) => setFormData({ ...formData, desiredSalary: e.target.value })}
                  placeholder="50000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="KES">KES (KSh)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={formData.skillInput}
                onChange={(e) => setFormData({ ...formData, skillInput: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Type a skill and press Enter"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={addSkill}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="text-primary-900 hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {formData.skills.length === 0 && (
              <p className="text-gray-500 text-sm mt-2">Add skills that are relevant to the jobs you're seeking</p>
            )}
          </section>

          {/* Experience */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
              <button
                type="button"
                onClick={addExperience}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <FaPlus /> Add Experience
              </button>
            </div>
            {formData.experience.map((exp, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-6 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Experience {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateExperience(index, 'title', e.target.value)}
                      placeholder="e.g. Software Developer"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company *
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      placeholder="e.g. Tech Company Ltd"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => updateExperience(index, 'location', e.target.value)}
                      placeholder="e.g. Nairobi, Kenya"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                      disabled={exp.current}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div className="flex items-center pt-8">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      I currently work here
                    </label>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={exp.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    placeholder="Describe your responsibilities and achievements..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            ))}
            {formData.experience.length === 0 && (
              <p className="text-gray-500 text-center py-8">No work experience added yet. Click "Add Experience" to get started.</p>
            )}
          </section>

          {/* Education */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Education</h2>
              <button
                type="button"
                onClick={addEducation}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <FaPlus /> Add Education
              </button>
            </div>
            {formData.education.map((edu, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-6 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Education {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Degree/Certificate *
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      placeholder="e.g. Bachelor of Computer Science"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institution *
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      placeholder="e.g. University of Nairobi"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={edu.location}
                      onChange={(e) => updateEducation(index, 'location', e.target.value)}
                      placeholder="e.g. Nairobi, Kenya"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="month"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="month"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                      disabled={edu.current}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div className="flex items-center pt-8">
                    <input
                      type="checkbox"
                      checked={edu.current}
                      onChange={(e) => updateEducation(index, 'current', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Currently studying here
                    </label>
                  </div>
                </div>
              </div>
            ))}
            {formData.education.length === 0 && (
              <p className="text-gray-500 text-center py-8">No education added yet. Click "Add Education" to get started.</p>
            )}
          </section>

          {/* Portfolio/Projects */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Portfolio/Projects</h2>
              <button
                type="button"
                onClick={addPortfolio}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <FaPlus /> Add Project
              </button>
            </div>
            {formData.portfolio.map((item, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-6 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Project {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removePortfolio(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updatePortfolio(index, 'title', e.target.value)}
                      placeholder="e.g. E-commerce Website"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => updatePortfolio(index, 'description', e.target.value)}
                      placeholder="Brief description of the project..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL/Link *
                    </label>
                    <input
                      type="url"
                      value={item.url}
                      onChange={(e) => updatePortfolio(index, 'url', e.target.value)}
                      placeholder="https://example.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            ))}
            {formData.portfolio.length === 0 && (
              <p className="text-gray-500 text-center py-8">No portfolio items added yet. Showcase your work!</p>
            )}
          </section>

          {/* Links & Resume */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Links & Documents</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={formData.linkedIn}
                  onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Profile
                </label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  placeholder="https://github.com/yourusername"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://yourwebsite.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume/CV Link
                </label>
                <input
                  type="url"
                  value={formData.resume}
                  onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                  placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Upload your resume to Google Drive or Dropbox and paste the shareable link here
                </p>
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Link
              href="/dashboard/jobseeker"
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              <FaSave />
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FaBars, FaTimes, FaGlobe, FaUser, FaBuilding } from 'react-icons/fa'

interface User {
  id: string
  email: string
  userType: 'jobseeker' | 'employer'
  firstName: string
  lastName: string
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    
    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuth()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Listen for custom auth events
    const handleAuthChange = () => {
      console.log('Navbar: Auth change event received')
      checkAuth()
    }
    
    window.addEventListener('authChange', handleAuthChange)
    
    // Check auth on focus (when user returns to tab)
    const handleFocus = () => {
      checkAuth()
    }
    
    window.addEventListener('focus', handleFocus)
    
    // Check auth periodically as a fallback (less frequent)
    const interval = setInterval(checkAuth, 10000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authChange', handleAuthChange)
      window.removeEventListener('focus', handleFocus)
      clearInterval(interval)
    }
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        console.log('Navbar: User authenticated as', data.user.userType)
        setUser(data.user)
      } else {
        console.log('Navbar: User not authenticated')
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      // Dispatch auth change event
      window.dispatchEvent(new CustomEvent('authChange'))
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const getDashboardLink = () => {
    if (!user) return '/auth/login'
    return user.userType === 'jobseeker' ? '/dashboard/jobseeker' : '/dashboard/employer'
  }

  const getDashboardName = () => {
    if (!user) return 'Dashboard'
    return user.userType === 'jobseeker' ? 'My Dashboard' : 'My Dashboard'
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <FaGlobe className="text-primary-600 text-2xl" />
              <span className="text-2xl font-bold text-primary-600">JobsAbroad</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {loading ? (
              <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <>
                {/* Logged in user menu */}
                {user.userType === 'jobseeker' ? (
                  <>
                    {/* Job Seeker Menu */}
                    <Link href="/dashboard/jobseeker" className="text-gray-700 hover:text-primary-600 transition">
                      My Dashboard
                    </Link>
                    <Link href="/dashboard/jobseeker/profile" className="text-gray-700 hover:text-primary-600 transition">
                      My Profile
                    </Link>
                    <Link href="/jobs" className="text-gray-700 hover:text-primary-600 transition">
                      Browse Jobs
                    </Link>
                    <Link href="/dashboard/jobseeker" className="text-gray-700 hover:text-primary-600 transition">
                      My Applications
                    </Link>
                  </>
                ) : (
                  <>
                    {/* Employer Menu */}
                    <Link href="/dashboard/employer" className="text-gray-700 hover:text-primary-600 transition">
                      My Dashboard
                    </Link>
                    <Link href="/dashboard/employer/applications" className="text-gray-700 hover:text-primary-600 transition">
                      Applicants
                    </Link>
                    <Link href="/jobseekers" className="text-gray-700 hover:text-primary-600 transition">
                      Job Seekers
                    </Link>
                    <Link href="/dashboard/employer/post-job" className="text-gray-700 hover:text-primary-600 transition">
                      Post Job
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                {/* Not logged in menu */}
                <Link href="/jobs" className="text-gray-700 hover:text-primary-600 transition">
                  Find Jobs
                </Link>
                <Link href="/talent" className="text-gray-700 hover:text-primary-600 transition">
                  Find Talent
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-primary-600 transition">
                  About
                </Link>
              </>
            )}

            {loading ? (
              <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <>
                {/* User is logged in - show user info and logout */}
                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition">
                    <span className="hidden lg:inline">{user.firstName}</span>
                    {user.userType === 'jobseeker' ? <FaUser /> : <FaBuilding />}
                  </button>
                  
                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                        <div className="text-xs text-primary-600 capitalize">{user.userType}</div>
                      </div>
                      <Link 
                        href={getDashboardLink()} 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {getDashboardName()}
                      </Link>
                      {user.userType === 'jobseeker' && (
                        <Link 
                          href="/dashboard/jobseeker/profile" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Edit Profile
                        </Link>
                      )}
                      {user.userType === 'employer' && (
                        <Link 
                          href="/dashboard/employer/post-job" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Post a Job
                        </Link>
                      )}
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* User is not logged in */}
                <Link href="/auth/login" className="text-gray-700 hover:text-primary-600 transition">
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            {loading ? (
              <div className="px-3 py-2 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : user ? (
              <>
                {/* Mobile logged in menu */}
                {user.userType === 'jobseeker' ? (
                  <>
                    {/* Job Seeker Mobile Menu */}
                    <Link
                      href="/dashboard/jobseeker"
                      className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      My Dashboard
                    </Link>
                    <Link
                      href="/dashboard/jobseeker/profile"
                      className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/jobs"
                      className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      Browse Jobs
                    </Link>
                    <Link
                      href="/dashboard/jobseeker"
                      className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      My Applications
                    </Link>
                  </>
                ) : (
                  <>
                    {/* Employer Mobile Menu */}
                    <Link
                      href="/dashboard/employer"
                      className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      My Dashboard
                    </Link>
                    <Link
                      href="/dashboard/employer/applications"
                      className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      Applicants
                    </Link>
                    <Link
                      href="/jobseekers"
                      className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      Job Seekers
                    </Link>
                    <Link
                      href="/dashboard/employer/post-job"
                      className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      Post Job
                    </Link>
                  </>
                )}
                
                {/* User info and logout */}
                <div className="px-3 py-2 border-t">
                  <div className="text-sm text-gray-500 mb-2">
                    {user.firstName} {user.lastName} ({user.userType})
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Mobile not logged in menu */}
                <Link
                  href="/jobs"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Find Jobs
                </Link>
                <Link
                  href="/talent"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Find Talent
                </Link>
                <Link
                  href="/about"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/auth/login"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="block px-3 py-2 bg-primary-600 text-white text-center rounded-md hover:bg-primary-700"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
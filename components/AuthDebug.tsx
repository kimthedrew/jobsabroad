'use client'

import { useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  userType: 'jobseeker' | 'employer'
  firstName: string
  lastName: string
  country: string
}

export default function AuthDebug() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authCheckCount, setAuthCheckCount] = useState(0)

  const checkAuth = async () => {
    try {
      console.log(`AuthDebug: Checking auth (attempt ${authCheckCount + 1})`)
      const response = await fetch('/api/auth/me')
      console.log(`AuthDebug: Response status: ${response.status}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('AuthDebug: User data:', data)
        setUser(data.user)
      } else {
        console.log('AuthDebug: User not authenticated')
        setUser(null)
      }
    } catch (error) {
      console.error('AuthDebug: Auth check failed:', error)
      setUser(null)
    } finally {
      setLoading(false)
      setAuthCheckCount(prev => prev + 1)
    }
  }

  useEffect(() => {
    checkAuth()
    
    // Listen for auth changes
    const handleAuthChange = () => {
      console.log('AuthDebug: Auth change event received')
      checkAuth()
    }
    
    window.addEventListener('authChange', handleAuthChange)
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange)
    }
  }, [])

  if (process.env.NODE_ENV !== 'development') {
    return null // Only show in development
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div>Loading: {loading ? 'Yes' : 'No'}</div>
      <div>Checks: {authCheckCount}</div>
      <div>User: {user ? `${user.firstName} (${user.userType})` : 'None'}</div>
      <button 
        onClick={checkAuth}
        className="mt-2 bg-blue-600 px-2 py-1 rounded text-xs"
      >
        Refresh Auth
      </button>
    </div>
  )
}

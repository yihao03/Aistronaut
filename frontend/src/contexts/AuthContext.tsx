// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApiService } from '../services/authApi'
import { StoredUserData } from '../lib/auth'

interface AuthContextType {
  isAuthenticated: boolean
  user: StoredUserData | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<StoredUserData | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authApiService.isAuthenticated()
      const currentUser = authApiService.getCurrentUser()
      const currentToken = authApiService.getToken()

      setIsAuthenticated(isAuth)
      setUser(currentUser)
      setToken(currentToken)
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    try {
      await authApiService.login({ email, password })
      
      // Update context state after successful login
      setIsAuthenticated(true)
      setUser(authApiService.getCurrentUser())
      setToken(authApiService.getToken())
    } catch (error) {
      throw error // Re-throw to let the component handle it
    }
  }

  const logout = (): void => {
    authApiService.logout()
    setIsAuthenticated(false)
    setUser(null)
    setToken(null)
  }

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  return (props: P) => {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      // You might want to redirect to login here
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">Authentication Required</h2>
            <p className="text-gray-600 mt-2">Please sign in to access this page.</p>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}
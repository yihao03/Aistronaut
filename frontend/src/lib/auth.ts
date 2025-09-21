// src/lib/auth.ts

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'user_data'

export interface TokenData {
  token: string
  expiresAt?: number
}

export interface StoredUserData {
  userID: string
  username: string
  email?: string
}

// Token storage functions
export const tokenStorage = {
  // Store JWT token
  setToken(token: string): void {
    try {
      // Decode JWT to get expiration (optional)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const tokenData: TokenData = {
        token,
        expiresAt: payload.exp ? payload.exp * 1000 : undefined // Convert to milliseconds
      }
      localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData))
    } catch (error) {
      // If token parsing fails, store as plain token
      const tokenData: TokenData = { token }
      localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData))
    }
  },

  // Get JWT token
  getToken(): string | null {
    try {
      const storedData = localStorage.getItem(TOKEN_KEY)
      if (!storedData) return null

      const tokenData: TokenData = JSON.parse(storedData)
      
      // Check if token is expired
      if (tokenData.expiresAt && Date.now() > tokenData.expiresAt) {
        this.clearToken()
        return null
      }

      return tokenData.token
    } catch (error) {
      console.warn('Failed to parse stored token:', error)
      this.clearToken()
      return null
    }
  },

  // Remove JWT token
  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getToken() !== null
  }
}

// User data storage functions
export const userStorage = {
  // Store user data
  setUser(userData: StoredUserData): void {
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
  },

  // Get user data
  getUser(): StoredUserData | null {
    try {
      const storedData = localStorage.getItem(USER_KEY)
      return storedData ? JSON.parse(storedData) : null
    } catch (error) {
      console.warn('Failed to parse stored user data:', error)
      return null
    }
  },

  // Clear user data
  clearUser(): void {
    localStorage.removeItem(USER_KEY)
  }
}

// Utility to decode JWT payload (for extracting user info)
export const decodeJWT = (token: string): any => {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch (error) {
    console.warn('Failed to decode JWT:', error)
    return null
  }
}

// Get authorization header for API requests
export const getAuthHeader = (): Record<string, string> => {
  const token = tokenStorage.getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
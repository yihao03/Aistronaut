// src/services/authApi.ts
/// <reference types="vite/client" />

import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, User, AuthError } from '../types'
import { tokenStorage, userStorage, decodeJWT, getAuthHeader } from '../lib/auth'

class AuthApiService {
  private baseUrl: string

  constructor() {
    // Use the provided API endpoint or fallback to localhost for development
    this.baseUrl = import.meta.env.VITE_AUTH_API_BASE_URL || 'http://43.216.133.5:8080'
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    }

    try {
      const response = await fetch(url, defaultOptions)
      
      if (!response.ok) {
        const errorData: AuthError = await response.json().catch(() => ({
          error: 'Network error',
          details: `HTTP ${response.status} ${response.statusText}`
        }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the authentication server. Please check your internet connection.')
      }
      throw error
    }
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    return this.makeRequest<RegisterResponse>('/user/create', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.makeRequest<LoginResponse>('/user/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    // Store token and user data after successful login
    if (response.token) {
      tokenStorage.setToken(response.token)
      
      // Decode JWT to extract user information
      const payload = decodeJWT(response.token)
      if (payload && payload.userID && payload.username) {
        userStorage.setUser({
          userID: payload.userID,
          username: payload.username,
          email: credentials.email // Store email from login request
        })
      }
    }

    return response
  }

  async logout(): Promise<void> {
    // Clear stored token and user data
    tokenStorage.clearToken()
    userStorage.clearUser()
  }

  // Check if user is currently authenticated
  isAuthenticated(): boolean {
    return tokenStorage.isAuthenticated()
  }

  // Get current user data
  getCurrentUser(): any | null {
    return userStorage.getUser()
  }

  // Get current JWT token
  getToken(): string | null {
    return tokenStorage.getToken()
  }

  // Make authenticated requests (for future use with chat API)
  async makeAuthenticatedRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const authHeaders = getAuthHeader()
    const mergedOptions = {
      ...options,
      headers: {
        ...options.headers,
        ...authHeaders
      }
    }
    return this.makeRequest<T>(endpoint, mergedOptions)
  }
}

export const authApiService = new AuthApiService()
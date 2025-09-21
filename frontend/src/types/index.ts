// src/types/index.ts

export interface HolidayOption {
  id: string
  title: string
  destination: string
  duration: string
  flight: string
  hotel: string
  activities: string
  budget: string
}

export interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  options?: HolidayOption[]
}

export interface TripPlanResults {
  flights: FlightResult[]
  hotels: HotelResult[]
  activities: string[]
}

export interface FlightResult {
  airline: string
  price: string
  duration: string
}

export interface HotelResult {
  name: string
  price: string
  rating: number
}

// User Authentication Types
export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface RegisterResponse {
  message: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface User {
  id: string
  username: string
  email: string
  createdAt: string
}

export interface AuthError {
  error: string
  code?: string
  details?: string
}

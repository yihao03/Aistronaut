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
  // Enhanced fields for detailed display
  description?: string
  price?: string
  features?: string[]
  flightInfo?: {
    airline: string
    duration: string
    stops: string
  }
  accommodationInfo?: {
    name: string
    type: string
    rating: number
    amenities: string[]
  }
  itinerary?: string[]
  image?: string
}

export interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  options?: HolidayOption[]
  bookingDetails?: DemoBookingDetails
}

// Booking Details for demo version
export interface DemoFlightDetails {
  id: string
  airline: string
  flightNumber: string
  departure: {
    airport: string
    city: string
    time: string
    date: string
  }
  arrival: {
    airport: string
    city: string
    time: string
    date: string
  }
  duration: string
  class: string
  price: string
  baggage: string
}

export interface DemoAccommodationDetails {
  id: string
  name: string
  type: string
  rating: number
  address: string
  checkIn: string
  checkOut: string
  roomType: string
  guests: number
  nights: number
  pricePerNight: string
  totalPrice: string
  amenities: string[]
  images?: string[]
}

export interface DemoBookingDetails {
  id: string
  packageId: string
  packageTitle: string
  totalPrice: string
  currency: string
  validUntil: string
  outboundFlight: DemoFlightDetails
  returnFlight?: DemoFlightDetails
  accommodation: DemoAccommodationDetails
  inclusions: string[]
  terms: string[]
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

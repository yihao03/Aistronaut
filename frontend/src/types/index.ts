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

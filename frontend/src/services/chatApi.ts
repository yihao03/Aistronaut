// src/services/chatApi.ts
/// <reference types="vite/client" />

import { getAuthHeader } from '../lib/auth'

// New API Types (no changes needed here)
export interface CreateConversationResponse {
  conversation_id: string;
}

export interface ChatRequest {
  conversation_id: string;
  user_id: string;
  content: string;
  content_type: number;
}

export interface ChatResponse {
  conversation_id: string;
  content: string;
  object: string;
  created_at: string;
  is_user: boolean;
}

export interface TripObject {
  trip_id: string;
  user_id: string;
  trip_name: string;
  destination_country: string;
  destination_city: string;
  start_date: string;
  end_date: string;
  total_budget: number;
  current_spent: number;
  trip_status: string;
  number_of_travelers: number;
  adults_count: number;
  children_count: number;
  infants_count: number;
  trip_type: string;
  purpose: string;
  notes: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  created_at: string;
  updated_at: string;
}

// Legacy types (no changes needed here)
export interface LegacyChatRequest {
  message: string;
  conversationId?: string;
}

export interface LegacyChatResponse {
  id: string;
  message: string;
  conversationId: string;
  timestamp: string;
  options?: TravelOption[];
  bookingDetails?: BookingDetails;
  metadata?: {
    confidence: number;
    intent: string;
    entities?: any[];
  };
}

export interface TravelOption {
  id: string;
  title: string;
  destination: string;
  duration: string;
  price: string;
  description: string;
  image?: string;
  features: string[];
  flightInfo?: {
    airline: string;
    duration: string;
    stops: string;
  };
  accommodationInfo?: {
    name: string;
    type: string;
    rating: number;
    amenities: string[];
  };
  itinerary: string[];
}

export interface FlightDetails {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    city: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    city: string;
    time: string;
    date: string;
  };
  duration: string;
  class: string;
  price: string;
  baggage: string;
}

export interface AccommodationDetails {
  id: string;
  name: string;
  type: string;
  rating: number;
  address: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  guests: number;
  nights: number;
  pricePerNight: string;
  totalPrice: string;
  amenities: string[];
  images?: string[];
}

export interface BookingDetails {
  id: string;
  packageId: string;
  packageTitle: string;
  totalPrice: string;
  currency: string;
  validUntil: string;
  outboundFlight: FlightDetails;
  returnFlight?: FlightDetails;
  accommodation: AccommodationDetails;
  inclusions: string[];
  terms: string[];
}

export interface ApiError {
  error: string;
  code?: string;
  details?: string;
}

class ChatApiService {
  private baseUrl: string;

  constructor() {
    // Use the same configuration as authApi for consistency
    this.baseUrl = import.meta.env.VITE_AUTH_API_BASE_URL || 'http://43.216.133.5:8080';
    console.log('Using ChatApiService baseUrl:', this.baseUrl);
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}, requireAuth: boolean = false): Promise<T> {
    const cleanBaseUrl = this.baseUrl?.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${cleanBaseUrl}${cleanEndpoint}`;
    
    console.log('Base URL:', this.baseUrl);
    console.log('Endpoint:', endpoint);
    console.log('Final URL:', url);
    console.log('Making request to:', url);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (requireAuth) {
      const authHeaders = getAuthHeader();
      Object.assign(headers, authHeaders);
    }
    
    const defaultOptions: RequestInit = {
      headers,
      ...options,
    };

    try {
      console.log('Request options:', defaultOptions);
      const response = await fetch(url, defaultOptions);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        // Try to get response text first to see what we're actually receiving
        const responseText = await response.text();
        console.log('Error response text:', responseText);
        
        let errorData: ApiError;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = {
            error: responseText || 'Network error',
            details: `HTTP ${response.status} ${response.statusText}`
          };
        }
        
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const responseText = await response.text();
      console.log('Success response text:', responseText);
      
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        throw new Error('Invalid JSON response from server');
      }
    } catch (error) {
      console.error('Request error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the server. Please check if the backend is running.');
      }
      throw error;
    }
  }

  // Create a new conversation using the backend /chat/create endpoint
  async createConversation(): Promise<CreateConversationResponse> {
    return this.makeRequest<CreateConversationResponse>('/chat/create', {
      method: 'POST',
    }, true); // Requires authentication
  }

  // FIX: The sendMessage method is correct, but the endpoint has been changed in the `sendLegacyMessage` method below.
  // This method is no longer used directly by `sendLegacyMessage`.
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    return this.makeRequest<ChatResponse>('/chat/', {
      method: 'POST',
      body: JSON.stringify(request),
    }, true);
  }

  parseTripObject(objectString: string): TripObject | null {
    try {
      return JSON.parse(objectString);
    } catch (error) {
      console.warn('Failed to parse trip object:', error);
      return null;
    }
  }

  // Updated to match backend API format
  async sendLegacyMessage(request: LegacyChatRequest): Promise<LegacyChatResponse> {
    try {
      // Get user info from auth headers to include user_id
      const authHeaders = getAuthHeader();
      
      // Parse JWT to get user_id (the backend expects user_id in the request body)
      const token = localStorage.getItem('token');
      let user_id = '';
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const payload = JSON.parse(jsonPayload);
          user_id = payload.user_id || '';
        } catch (e) {
          console.warn('Failed to parse JWT for user_id:', e);
        }
      }
      
      const chatRequest: ChatRequest = {
        conversation_id: request.conversationId || '', 
        user_id: user_id,
        content: request.message,
        content_type: 0
      };

      // Send message to the correct endpoint
      const response = await this.makeRequest<ChatResponse>('/chat/', {
        method: 'POST',
        body: JSON.stringify(chatRequest),
      }, true);

      // Convert the new API response to the legacy format
      return {
        id: `msg_${Date.now()}`,
        message: response.content,
        conversationId: response.conversation_id,
        timestamp: response.created_at,
        metadata: {
          confidence: 0.95,
          intent: 'travel_planning',
          entities: []
        },
        // The `object` field from the new response can be parsed here if needed,
        // but the legacy format doesn't have a direct field for it.
      };
    } catch (error) {
      throw error;
    }
  }

  async sendMessageToApi(request: LegacyChatRequest): Promise<LegacyChatResponse> {
    return this.sendLegacyMessage(request);
  }

  async getConversationHistory(conversationId: string): Promise<ChatResponse[]> {
    return [];
  }

  async sendOptionSelection(optionId: string, request: LegacyChatRequest): Promise<LegacyChatResponse> {
    return this.sendLegacyMessage(request);
  }
}

export const chatApiService = new ChatApiService();
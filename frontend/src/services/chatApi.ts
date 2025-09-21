// src/services/chatApi.ts
/// <reference types="vite/client" />

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
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
    // Default to localhost for development
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          error: 'Network error',
          details: `HTTP ${response.status} ${response.statusText}`
        }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the server. Please check if the backend is running.');
      }
      throw error;
    }
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    // For now, return a dummy response since backend isn't ready
    // This will be replaced with actual API call later
    return this.getDummyResponse(request.message);
  }

  async sendOptionSelection(optionId: string, request: ChatRequest): Promise<ChatResponse> {
    // Handle option selection to show booking details
    return this.getDummyResponse(request.message, true, optionId);
  }

  private async getDummyResponse(message: string, isOptionSelected: boolean = false, selectedOptionId?: string): Promise<ChatResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerMessage = message.toLowerCase();
    
    // Handle option selection with booking details
    if (isOptionSelected && selectedOptionId) {
      return this.generateBookingDetails(selectedOptionId);
    }
    
    // Simulate different response types based on message content
    if (lowerMessage.includes('start') || lowerMessage.includes('options') || lowerMessage.includes('packages')) {
      return {
        id: `msg_${Date.now()}`,
        message: "🌟 Here are some amazing travel packages I've found for you! Each option includes flights, accommodation, and curated activities:",
        conversationId: 'conv_123',
        timestamp: new Date().toISOString(),
        options: [
          {
            id: 'pkg_bali_001',
            title: 'Tropical Paradise Escape',
            destination: 'Bali, Indonesia',
            duration: '7 Days / 6 Nights',
            price: '$1,299',
            description: 'Experience the magic of Bali with pristine beaches, ancient temples, and vibrant culture.',
            features: [
              'All meals included',
              'Airport transfers',
              'Travel insurance',
              '24/7 support'
            ],
            flightInfo: {
              airline: 'Emirates',
              duration: '18h 15m',
              stops: '1 stop via Dubai'
            },
            accommodationInfo: {
              name: 'Seminyak Beach Resort & Spa',
              type: '4-star Resort',
              rating: 4.5,
              amenities: ['Beach Access', 'Spa', 'Pool', 'Restaurant']
            },
            itinerary: [
              'Day 1-2: Arrival & Seminyak Beach relaxation',
              'Day 3-4: Ubud cultural tours & rice terraces',
              'Day 5-6: Temple visits & traditional cooking class',
              'Day 7: Departure with spa treatment'
            ]
          },
          {
            id: 'pkg_kyoto_001',
            title: 'Cultural Heritage Journey',
            destination: 'Kyoto, Japan',
            duration: '6 Days / 5 Nights',
            price: '$1,599',
            description: 'Immerse yourself in traditional Japan with historic temples, gardens, and authentic cuisine.',
            features: [
              'JR Pass included',
              'English guide',
              'Traditional meals',
              'Cultural activities'
            ],
            flightInfo: {
              airline: 'ANA',
              duration: '14h 40m',
              stops: 'Direct flight'
            },
            accommodationInfo: {
              name: 'Traditional Kyoto Ryokan',
              type: 'Authentic Ryokan',
              rating: 4.7,
              amenities: ['Onsen Bath', 'Tatami Rooms', 'Garden Views', 'Tea Ceremony']
            },
            itinerary: [
              'Day 1: Arrival & traditional welcome ceremony',
              'Day 2: Fushimi Inari & Kiyomizu Temple tours',
              'Day 3: Arashiyama bamboo grove & monkey park',
              'Day 4: Tea ceremony & kimono experience',
              'Day 5: Nijo Castle & Gion district exploration',
              'Day 6: Departure with farewell breakfast'
            ]
          },
          {
            id: 'pkg_santorini_001',
            title: 'Aegean Sea Adventure',
            destination: 'Santorini, Greece',
            duration: '5 Days / 4 Nights',
            price: '$1,199',
            description: 'Discover the stunning beauty of Santorini with breathtaking sunsets and crystal-clear waters.',
            features: [
              'Daily breakfast',
              'Wine tours included',
              'Sunset cruise',
              'Photography session'
            ],
            flightInfo: {
              airline: 'Delta',
              duration: '12h 15m',
              stops: '1 stop via Athens'
            },
            accommodationInfo: {
              name: 'Cliff Side Suites',
              type: 'Boutique Hotel',
              rating: 4.8,
              amenities: ['Caldera Views', 'Infinity Pool', 'Private Balcony', 'Wine Bar']
            },
            itinerary: [
              'Day 1: Arrival & sunset viewing in Oia',
              'Day 2: Volcano boat tour & hot springs',
              'Day 3: Wine tasting at 3 local wineries',
              'Day 4: Beach day & photography session',
              'Day 5: Final sunset & departure'
            ]
          }
        ],
        metadata: {
          confidence: 0.95,
          intent: 'show_travel_packages',
          entities: ['travel', 'packages', 'options']
        }
      };
    }

    if (lowerMessage.includes('budget') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return {
        id: `msg_${Date.now()}`,
        message: "💰 I understand you're interested in budget planning! Our packages are designed with different price ranges:\n\n• **Budget-friendly**: $800-$1,200 (including flights)\n• **Mid-range**: $1,200-$2,000 (premium experiences)\n• **Luxury**: $2,000+ (5-star everything)\n\nWhat's your preferred budget range? I can customize recommendations accordingly!",
        conversationId: 'conv_123',
        timestamp: new Date().toISOString(),
        metadata: {
          confidence: 0.88,
          intent: 'budget_inquiry',
          entities: ['budget', 'price']
        }
      };
    }

    if (lowerMessage.includes('destination') || lowerMessage.includes('where')) {
      return {
        id: `msg_${Date.now()}`,
        message: "🗺️ Great question! I can help you explore destinations based on your preferences:\n\n🏖️ **Beach lovers**: Bali, Maldives, Santorini\n🏔️ **Adventure seekers**: Nepal, Patagonia, New Zealand\n🏛️ **Culture enthusiasts**: Japan, Egypt, Peru\n🌆 **City explorers**: Tokyo, Paris, New York\n\nWhat type of experience are you looking for? Or would you like to see our curated packages by typing 'start'?",
        conversationId: 'conv_123',
        timestamp: new Date().toISOString(),
        metadata: {
          confidence: 0.90,
          intent: 'destination_inquiry',
          entities: ['destination', 'location']
        }
      };
    }

    // Default response
    const responses = [
      "That's a great question! I'm here to help you plan the perfect trip. What specific aspect of travel would you like to explore?",
      "I'd love to help you with that! Could you tell me more about what kind of travel experience you're looking for?",
      "Interesting! Travel planning can be exciting. Are you looking for destination recommendations, budget planning, or activity suggestions?",
      "I can definitely assist you with that! Would you like to see some popular travel packages by typing 'start'?",
      "That sounds like something I can help with! What's your ideal destination or travel style?"
    ];

    return {
      id: `msg_${Date.now()}`,
      message: responses[Math.floor(Math.random() * responses.length)],
      conversationId: 'conv_123',
      timestamp: new Date().toISOString(),
      metadata: {
        confidence: 0.75,
        intent: 'general_inquiry',
        entities: []
      }
    };
  }

  // Method to be implemented when backend is ready
  async sendMessageToApi(request: ChatRequest): Promise<ChatResponse> {
    return this.makeRequest<ChatResponse>('/chat/message', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getConversationHistory(conversationId: string): Promise<ChatResponse[]> {
    return this.makeRequest<ChatResponse[]>(`/chat/conversations/${conversationId}`);
  }

  private generateBookingDetails(optionId: string): ChatResponse {
    const bookingData = this.getBookingDataForOption(optionId);
    
    return {
      id: `booking_${Date.now()}`,
      message: `🎯 **Great choice!** Here are the detailed booking information for your selected package:\n\n📋 Please review all details below and confirm your booking.`,
      conversationId: 'conv_123',
      timestamp: new Date().toISOString(),
      bookingDetails: bookingData,
      metadata: {
        confidence: 1.0,
        intent: 'show_booking_details',
        entities: ['booking', 'confirmation']
      }
    };
  }

  private getBookingDataForOption(optionId: string): BookingDetails {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 3);

    switch (optionId) {
      case 'pkg_bali_001':
        return {
          id: 'booking_bali_001',
          packageId: 'pkg_bali_001',
          packageTitle: 'Tropical Paradise Escape - Bali, Indonesia',
          totalPrice: '$1,299',
          currency: 'USD',
          validUntil: validUntil.toISOString(),
          outboundFlight: {
            id: 'flight_out_001',
            airline: 'Emirates',
            flightNumber: 'EK 368',
            departure: {
              airport: 'JFK',
              city: 'New York',
              time: '11:30 PM',
              date: tomorrow.toISOString().split('T')[0]
            },
            arrival: {
              airport: 'DPS',
              city: 'Denpasar, Bali',
              time: '11:45 PM (+1)',
              date: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            },
            duration: '18h 15m (1 stop)',
            class: 'Economy',
            price: '$680',
            baggage: '2 x 23kg checked, 7kg carry-on'
          },
          returnFlight: {
            id: 'flight_ret_001',
            airline: 'Emirates',
            flightNumber: 'EK 369',
            departure: {
              airport: 'DPS',
              city: 'Denpasar, Bali',
              time: '12:40 AM',
              date: new Date(nextWeek.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            },
            arrival: {
              airport: 'JFK',
              city: 'New York',
              time: '6:55 AM',
              date: new Date(nextWeek.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            },
            duration: '17h 15m (1 stop)',
            class: 'Economy',
            price: '$680',
            baggage: '2 x 23kg checked, 7kg carry-on'
          },
          accommodation: {
            id: 'hotel_bali_001',
            name: 'Seminyak Beach Resort & Spa',
            type: 'Resort',
            rating: 4.5,
            address: 'Jl. Laksmana, Seminyak, Kuta, Badung Regency, Bali 80361, Indonesia',
            checkIn: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            checkOut: new Date(nextWeek.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            roomType: 'Deluxe Ocean View Room',
            guests: 2,
            nights: 6,
            pricePerNight: '$85',
            totalPrice: '$510',
            amenities: [
              'Free WiFi',
              'Swimming Pool',
              'Spa Services',
              'Beach Access',
              'Restaurant & Bar',
              'Fitness Center',
              'Room Service',
              'Airport Shuttle'
            ]
          },
          inclusions: [
            'Round-trip flights (Economy class)',
            '6 nights accommodation with breakfast',
            'Airport transfers',
            'Temple tour with guide',
            'Balinese cooking class',
            '90-minute spa treatment',
            'Travel insurance',
            '24/7 customer support'
          ],
          terms: [
            'Valid passport required (6+ months)',
            'Visa on arrival available for most countries',
            'Full payment required within 24 hours',
            'Cancellation: 50% refund if cancelled 7+ days before travel',
            'Travel insurance included, additional coverage available',
            'Prices subject to availability and currency fluctuations'
          ]
        };
      
      case 'pkg_kyoto_001':
        return {
          id: 'booking_kyoto_001',
          packageId: 'pkg_kyoto_001',
          packageTitle: 'Cultural Heritage Journey - Kyoto, Japan',
          totalPrice: '$1,599',
          currency: 'USD',
          validUntil: validUntil.toISOString(),
          outboundFlight: {
            id: 'flight_out_002',
            airline: 'ANA',
            flightNumber: 'NH 1010',
            departure: {
              airport: 'JFK',
              city: 'New York',
              time: '1:15 PM',
              date: tomorrow.toISOString().split('T')[0]
            },
            arrival: {
              airport: 'KIX',
              city: 'Osaka/Kyoto',
              time: '3:55 PM (+1)',
              date: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            },
            duration: '14h 40m (Direct)',
            class: 'Economy',
            price: '$850',
            baggage: '2 x 23kg checked, 7kg carry-on'
          },
          returnFlight: {
            id: 'flight_ret_002',
            airline: 'ANA',
            flightNumber: 'NH 1009',
            departure: {
              airport: 'KIX',
              city: 'Osaka/Kyoto',
              time: '5:55 PM',
              date: new Date(nextWeek.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            },
            arrival: {
              airport: 'JFK',
              city: 'New York',
              time: '2:35 PM',
              date: new Date(nextWeek.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            },
            duration: '12h 40m (Direct)',
            class: 'Economy',
            price: '$850',
            baggage: '2 x 23kg checked, 7kg carry-on'
          },
          accommodation: {
            id: 'hotel_kyoto_001',
            name: 'Traditional Kyoto Ryokan Yoshimizu',
            type: 'Ryokan',
            rating: 4.7,
            address: '1-317 Shimokawaracho, Higashiyama Ward, Kyoto, 605-0825, Japan',
            checkIn: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            checkOut: new Date(nextWeek.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            roomType: 'Traditional Tatami Room',
            guests: 2,
            nights: 5,
            pricePerNight: '$140',
            totalPrice: '$700',
            amenities: [
              'Traditional Japanese Breakfast',
              'Hot Spring Bath (Onsen)',
              'Tea Ceremony Room',
              'Garden Views',
              'Kimono Rental',
              'Free WiFi',
              'Meditation Space',
              'Cultural Activities'
            ]
          },
          inclusions: [
            'Round-trip direct flights (Economy class)',
            '5 nights traditional ryokan stay',
            'JR Pass for unlimited train travel',
            'Private temple tours in Kyoto',
            'Traditional tea ceremony experience',
            'Kaiseki dinner (1 night)',
            'English-speaking guide',
            'Travel insurance'
          ],
          terms: [
            'Valid passport required (6+ months)',
            'Tourist visa not required for stays under 90 days (most countries)',
            'Full payment required within 24 hours',
            'Cancellation: 50% refund if cancelled 7+ days before travel',
            'Traditional ryokan requires respect for Japanese customs',
            'Some meals include raw fish - please inform of dietary restrictions'
          ]
        };

      case 'pkg_santorini_001':
        return {
          id: 'booking_santorini_001',
          packageId: 'pkg_santorini_001',
          packageTitle: 'Aegean Sea Adventure - Santorini, Greece',
          totalPrice: '$1,199',
          currency: 'USD',
          validUntil: validUntil.toISOString(),
          outboundFlight: {
            id: 'flight_out_003',
            airline: 'Delta',
            flightNumber: 'DL 8452',
            departure: {
              airport: 'JFK',
              city: 'New York',
              time: '8:25 PM',
              date: tomorrow.toISOString().split('T')[0]
            },
            arrival: {
              airport: 'JTR',
              city: 'Santorini',
              time: '4:40 PM (+1)',
              date: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            },
            duration: '12h 15m (1 stop)',
            class: 'Economy',
            price: '$580',
            baggage: '1 x 23kg checked, 8kg carry-on'
          },
          returnFlight: {
            id: 'flight_ret_003',
            airline: 'Delta',
            flightNumber: 'DL 8453',
            departure: {
              airport: 'JTR',
              city: 'Santorini',
              time: '6:15 PM',
              date: new Date(nextWeek.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            },
            arrival: {
              airport: 'JFK',
              city: 'New York',
              time: '11:45 PM',
              date: new Date(nextWeek.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            },
            duration: '11h 30m (1 stop)',
            class: 'Economy',
            price: '$580',
            baggage: '1 x 23kg checked, 8kg carry-on'
          },
          accommodation: {
            id: 'hotel_santorini_001',
            name: 'Cliff Side Suites Santorini',
            type: 'Boutique Hotel',
            rating: 4.8,
            address: 'Imerovigli, 847 00 Santorini, Cyclades, Greece',
            checkIn: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            checkOut: new Date(nextWeek.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            roomType: 'Suite with Caldera View',
            guests: 2,
            nights: 4,
            pricePerNight: '$155',
            totalPrice: '$620',
            amenities: [
              'Private Balcony with Caldera View',
              'Infinity Pool',
              'Complimentary Breakfast',
              'Wine Tasting',
              'Sunset Photography Spots',
              'Free WiFi',
              'Concierge Service',
              'Airport Transfers'
            ]
          },
          inclusions: [
            'Round-trip flights (Economy class)',
            '4 nights cliff-side accommodation',
            'Daily breakfast with caldera views',
            'Private boat excursion to volcano',
            'Wine tasting tour (3 wineries)',
            'Sunset photography session',
            'Airport transfers',
            'Travel insurance'
          ],
          terms: [
            'EU passport or valid visa required',
            'Travel within Schengen area - check requirements',
            'Full payment required within 24 hours',
            'Cancellation: 50% refund if cancelled 5+ days before travel',
            'Weather dependent activities may be rescheduled',
            'Peak season surcharges may apply'
          ]
        };

      default:
        // Default booking details
        return {
          id: 'booking_default',
          packageId: optionId,
          packageTitle: 'Travel Package',
          totalPrice: '$999',
          currency: 'USD',
          validUntil: validUntil.toISOString(),
          outboundFlight: {
            id: 'flight_default',
            airline: 'Airline',
            flightNumber: 'XX 000',
            departure: {
              airport: 'JFK',
              city: 'New York',
              time: '10:00 AM',
              date: tomorrow.toISOString().split('T')[0]
            },
            arrival: {
              airport: 'XXX',
              city: 'Destination',
              time: '8:00 PM',
              date: tomorrow.toISOString().split('T')[0]
            },
            duration: '10h 00m',
            class: 'Economy',
            price: '$500',
            baggage: '1 x 23kg checked'
          },
          accommodation: {
            id: 'hotel_default',
            name: 'Hotel Default',
            type: 'Hotel',
            rating: 4.0,
            address: 'Hotel Address',
            checkIn: tomorrow.toISOString().split('T')[0],
            checkOut: nextWeek.toISOString().split('T')[0],
            roomType: 'Standard Room',
            guests: 2,
            nights: 5,
            pricePerNight: '$100',
            totalPrice: '$500',
            amenities: ['WiFi', 'Pool', 'Restaurant']
          },
          inclusions: ['Flights', 'Hotel', 'Transfers'],
          terms: ['Terms and conditions apply']
        };
    }
  }
}

export const chatApiService = new ChatApiService();

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
  flight_object?: string;
  accommodation_object?: string;
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
  flightOptions?: FlightOption[];
  tripOptions?: TripOption[];
  accommodationOptions?: AccommodationOption[];
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

// Flight API response types
export interface FlightResponse {
  selected_flight: {
    airline: string;
    outbound_flight: {
      flight_number: string;
      departure_city: string;
      arrival_city: string;
      departure_date: string;
      departure_time: string;
      arrival_date: string;
      arrival_time: string;
      duration_hours: number;
      stops: string[];
    };
    return_flight: {
      flight_number: string;
      departure_city: string;
      arrival_city: string;
      departure_date: string;
      departure_time: string;
      arrival_date: string;
      arrival_time: string;
      duration_hours: number;
      stops: string[];
    };
    price: number;
    currency: string | null;
    reason: string;
  };
  trip_preferences: any;
  mode: string;
}

export interface FlightOption {
  id: string;
  mode: string;
  airline: string;
  price: number;
  currency: string;
  reason: string;
  outboundFlight: {
    flightNumber: string;
    route: string;
    departureDate: string;
    departureTime: string;
    arrivalDate: string;
    arrivalTime: string;
    duration: string;
    stops: string;
  };
  returnFlight: {
    flightNumber: string;
    route: string;
    departureDate: string;
    departureTime: string;
    arrivalDate: string;
    arrivalTime: string;
    duration: string;
    stops: string;
  };
}

export interface TripOption {
  id: string;
  title: string;
  destination: string;
  country: string;
  duration: string;
  description: string;
  image?: string;
  features: string[];
  itinerary: string[];
  flightInfo: FlightOption;
  totalPrice: number;
  currency: string;
}

export interface AccommodationOption {
  id: string;
  name: string;
  type: string;
  rating: number;
  location: string;
  description: string;
  amenities: string[];
  images?: string[];
  pricePerNight: number;
  totalPrice: number;
  currency: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  guests: number;
  nights: number;
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

  parseFlightObject(flightObjectString: string): FlightOption[] {
    try {
      const flightResponses: FlightResponse[] = JSON.parse(flightObjectString);
      return flightResponses.map((flight, index) => ({
        id: `flight_${index}_${flight.mode}`,
        mode: flight.mode,
        airline: flight.selected_flight.airline,
        price: flight.selected_flight.price,
        currency: flight.selected_flight.currency || 'USD',
        reason: flight.selected_flight.reason,
        outboundFlight: {
          flightNumber: flight.selected_flight.outbound_flight.flight_number,
          route: `${flight.selected_flight.outbound_flight.departure_city} → ${flight.selected_flight.outbound_flight.arrival_city}`,
          departureDate: flight.selected_flight.outbound_flight.departure_date,
          departureTime: flight.selected_flight.outbound_flight.departure_time,
          arrivalDate: flight.selected_flight.outbound_flight.arrival_date,
          arrivalTime: flight.selected_flight.outbound_flight.arrival_time,
          duration: `${flight.selected_flight.outbound_flight.duration_hours.toFixed(1)} hours`,
          stops: flight.selected_flight.outbound_flight.stops.join(', ')
        },
        returnFlight: {
          flightNumber: flight.selected_flight.return_flight.flight_number,
          route: `${flight.selected_flight.return_flight.departure_city} → ${flight.selected_flight.return_flight.arrival_city}`,
          departureDate: flight.selected_flight.return_flight.departure_date,
          departureTime: flight.selected_flight.return_flight.departure_time,
          arrivalDate: flight.selected_flight.return_flight.arrival_date,
          arrivalTime: flight.selected_flight.return_flight.arrival_time,
          duration: `${flight.selected_flight.return_flight.duration_hours.toFixed(1)} hours`,
          stops: flight.selected_flight.return_flight.stops.join(', ')
        }
      }));
    } catch (error) {
      console.warn('Failed to parse flight object:', error);
      return [];
    }
  }

  generateTripOptions(flightOptions: FlightOption[], userMessage?: string): TripOption[] {
    const asianDestinations = {
      "Thailand": [
        {
          title: "Bangkok Explorer",
          destination: "Bangkok",
          country: "Thailand",
          description: "Discover the vibrant street life, ornate shrines, bustling markets, and incredible street food that make Bangkok one of Asia's most exciting cities.",
          features: ["Temple hopping", "Floating markets", "Thai cooking class", "Tuk-tuk tours", "River cruise"],
          itinerary: [
            "Day 1: Arrival, Grand Palace and Wat Pho",
            "Day 2: Chatuchak Market and Wat Arun",
            "Day 3: Floating market tour and Thai cooking class",
            "Day 4: Chao Phraya river cruise and Chinatown"
          ]
        },
        {
          title: "Phuket Paradise",
          destination: "Phuket",
          country: "Thailand",
          description: "Relax on pristine beaches, explore vibrant nightlife, and enjoy water sports in Thailand's most famous island destination with stunning sunsets.",
          features: ["Beach relaxation", "Island hopping", "Snorkeling", "Nightlife", "Spa treatments"],
          itinerary: [
            "Day 1: Arrival, Patong Beach exploration",
            "Day 2: Phi Phi Islands day trip",
            "Day 3: Old Town Phuket and local markets",
            "Day 4: Beach day and sunset viewing"
          ]
        },
        {
          title: "Chiang Mai Culture",
          destination: "Chiang Mai",
          country: "Thailand",
          description: "Experience authentic Thai culture in the northern highlands with ancient temples, hill tribe villages, and traditional crafts.",
          features: ["Temple visits", "Hill tribe tours", "Cooking classes", "Night bazaar", "Elephant sanctuary"],
          itinerary: [
            "Day 1: Arrival, Old City temple tour",
            "Day 2: Elephant sanctuary and hill tribe visit",
            "Day 3: Thai cooking class and night bazaar",
            "Day 4: Doi Suthep temple and departure"
          ]
        }
      ],
      "Japan": [
        {
          title: "Tokyo Adventure",
          destination: "Tokyo",
          country: "Japan",
          description: "Experience the perfect blend of traditional culture and modern innovation in Japan's bustling capital. From ancient temples to cutting-edge technology, Tokyo offers endless discoveries.",
          features: ["Temple visits", "Sushi workshops", "Cherry blossom viewing", "Shibuya crossing", "Mt. Fuji day trip"],
          itinerary: [
            "Day 1: Arrival in Tokyo, explore Asakusa Temple",
            "Day 2: Shibuya and Harajuku districts tour",
            "Day 3: Traditional sushi making workshop",
            "Day 4: Day trip to Mt. Fuji and Hakone"
          ]
        },
        {
          title: "Osaka Delights",
          destination: "Osaka",
          country: "Japan",
          description: "Discover Japan's kitchen with incredible street food, historic castles, and friendly locals in this vibrant culinary capital.",
          features: ["Street food tours", "Osaka Castle", "Dotonbori district", "Takoyaki tasting", "Day trip to Nara"],
          itinerary: [
            "Day 1: Arrival, Dotonbori food tour",
            "Day 2: Osaka Castle and Kuromon Market",
            "Day 3: Day trip to Nara deer park",
            "Day 4: Universal Studios Japan"
          ]
        },
        {
          title: "Kyoto Heritage",
          destination: "Kyoto",
          country: "Japan",
          description: "Step back in time in Japan's ancient capital, filled with golden temples, bamboo forests, and traditional geisha districts.",
          features: ["Temple visits", "Bamboo grove", "Geisha districts", "Traditional tea ceremony", "Sake tasting"],
          itinerary: [
            "Day 1: Arrival, Kinkaku-ji Golden Pavilion",
            "Day 2: Arashiyama Bamboo Grove and monkey park",
            "Day 3: Gion district and tea ceremony",
            "Day 4: Fushimi Inari shrine and departure"
          ]
        }
      ],
      "South Korea": [
        {
          title: "Seoul Discovery",
          destination: "Seoul",
          country: "South Korea",
          description: "Immerse yourself in Korean culture, from K-pop to traditional palaces, delicious street food, and vibrant nightlife in this dynamic city.",
          features: ["Palace tours", "K-pop experiences", "Korean BBQ", "Hanbok rental", "DMZ tour"],
          itinerary: [
            "Day 1: Arrival, Myeongdong shopping district",
            "Day 2: Gyeongbokgung Palace and Bukchon Hanok Village",
            "Day 3: Gangnam district and K-pop studio tour",
            "Day 4: DMZ (Demilitarized Zone) day trip"
          ]
        },
        {
          title: "Busan Coastal",
          destination: "Busan",
          country: "South Korea",
          description: "Explore South Korea's coastal gem with beautiful beaches, colorful villages, fresh seafood, and stunning mountain views.",
          features: ["Beach visits", "Gamcheon village", "Seafood markets", "Temple visits", "Coastal hiking"],
          itinerary: [
            "Day 1: Arrival, Haeundae Beach",
            "Day 2: Gamcheon Culture Village",
            "Day 3: Jagalchi Fish Market and Beomeosa Temple",
            "Day 4: Taejongdae Park and departure"
          ]
        },
        {
          title: "Jeju Island",
          destination: "Jeju",
          country: "South Korea",
          description: "Discover Korea's tropical paradise with volcanic landscapes, beautiful beaches, and unique women divers called 'haenyeo'.",
          features: ["Volcanic craters", "Beach relaxation", "Haenyeo culture", "Hiking trails", "Local cuisine"],
          itinerary: [
            "Day 1: Arrival, Seongsan Ilchulbong Peak",
            "Day 2: Hallasan National Park hiking",
            "Day 3: Jeju Folk Village and beaches",
            "Day 4: Manjanggul Cave and departure"
          ]
        }
      ],
      "Singapore": [
        {
          title: "Singapore Highlights",
          destination: "Singapore",
          country: "Singapore",
          description: "Experience the multicultural city-state where East meets West, featuring world-class attractions, amazing food, and stunning architecture.",
          features: ["Gardens by the Bay", "Marina Bay Sands", "Food courts", "Sentosa Island", "Night safari"],
          itinerary: [
            "Day 1: Arrival, Marina Bay Sands and Gardens by the Bay",
            "Day 2: Sentosa Island and Universal Studios",
            "Day 3: Singapore Zoo and Night Safari",
            "Day 4: Chinatown and Little India food tour"
          ]
        },
        {
          title: "Singapore Cultural",
          destination: "Singapore",
          country: "Singapore",
          description: "Dive deep into Singapore's rich multicultural heritage with ethnic quarters, traditional crafts, and authentic local experiences.",
          features: ["Cultural quarters", "Heritage tours", "Local workshops", "Traditional markets", "Religious sites"],
          itinerary: [
            "Day 1: Arrival, Chinatown heritage trail",
            "Day 2: Little India and Arab Street",
            "Day 3: Peranakan Museum and local workshops",
            "Day 4: Traditional markets and departure"
          ]
        },
        {
          title: "Singapore Luxury",
          destination: "Singapore",
          country: "Singapore",
          description: "Indulge in Singapore's luxury offerings with high-end shopping, fine dining, exclusive experiences, and premium accommodations.",
          features: ["Luxury shopping", "Fine dining", "Rooftop bars", "Spa treatments", "Private tours"],
          itinerary: [
            "Day 1: Arrival, Orchard Road luxury shopping",
            "Day 2: Marina Bay luxury experiences",
            "Day 3: Michelin dining and rooftop bars",
            "Day 4: Spa day and private city tour"
          ]
        }
      ],
      "Malaysia": [
        {
          title: "Kuala Lumpur Journey",
          destination: "Kuala Lumpur",
          country: "Malaysia",
          description: "Explore Malaysia's capital city with its iconic twin towers, diverse culture, incredible street food, and blend of modern and traditional architecture.",
          features: ["Petronas Towers", "Batu Caves", "Street food tours", "KL Tower", "Cultural districts"],
          itinerary: [
            "Day 1: Arrival, Petronas Twin Towers and KLCC",
            "Day 2: Batu Caves and traditional villages",
            "Day 3: Central Market and Chinatown food tour",
            "Day 4: KL Tower and Bukit Bintang district"
          ]
        },
        {
          title: "Penang Heritage",
          destination: "Penang",
          country: "Malaysia",
          description: "Discover Malaysia's cultural heart with UNESCO World Heritage sites, street art, and some of Asia's best street food.",
          features: ["UNESCO sites", "Street art tours", "Food trails", "Heritage walks", "Traditional crafts"],
          itinerary: [
            "Day 1: Arrival, Georgetown heritage walk",
            "Day 2: Street art tour and clan houses",
            "Day 3: Penang Hill and food trail",
            "Day 4: Traditional villages and departure"
          ]
        },
        {
          title: "Langkawi Tropics",
          destination: "Langkawi",
          country: "Malaysia",
          description: "Relax in Malaysia's tropical paradise with pristine beaches, cable car rides, and duty-free shopping on this beautiful island.",
          features: ["Beach relaxation", "Cable car rides", "Island hopping", "Duty-free shopping", "Mangrove tours"],
          itinerary: [
            "Day 1: Arrival, Pantai Cenang Beach",
            "Day 2: Langkawi Cable Car and Sky Bridge",
            "Day 3: Island hopping tour",
            "Day 4: Mangrove tour and departure"
          ]
        }
      ]
    };

    // Detect target country from user message
    const detectTargetCountry = (message?: string): string | null => {
      if (!message) return null;
      
      const messageLower = message.toLowerCase();
      const countryKeywords = {
        "Thailand": ["bangkok", "thailand", "thai", "phuket", "chiang mai", "krabi", "pattaya"],
        "Japan": ["japan", "japanese", "tokyo", "osaka", "kyoto", "hiroshima", "nagoya"],
        "South Korea": ["korea", "korean", "seoul", "busan", "jeju", "incheon"],
        "Singapore": ["singapore", "singaporean"],
        "Malaysia": ["malaysia", "malaysian", "kuala lumpur", "penang", "langkawi", "malacca"]
      };
      
      for (const [country, keywords] of Object.entries(countryKeywords)) {
        if (keywords.some(keyword => messageLower.includes(keyword))) {
          return country;
        }
      }
      
      return null;
    };

    const targetCountry = detectTargetCountry(userMessage);
    console.log('Detected target country:', targetCountry, 'from message:', userMessage);

    // Select destinations based on target country or use mixed selection
    let selectedDestinations: any[];
    
    if (targetCountry && asianDestinations[targetCountry]) {
      // Show only destinations from the target country
      selectedDestinations = asianDestinations[targetCountry];
      console.log(`Showing ${selectedDestinations.length} destinations from ${targetCountry}`);
    } else {
      // Mixed selection from all countries (original behavior)
      selectedDestinations = [
        ...asianDestinations["Thailand"].slice(0, 1),
        ...asianDestinations["Japan"].slice(0, 1),
        ...asianDestinations["South Korea"].slice(0, 1),
        ...asianDestinations["Singapore"].slice(0, 1),
        ...asianDestinations["Malaysia"].slice(0, 1)
      ];
      console.log('Showing mixed destinations from all countries');
    }

    return flightOptions.slice(0, Math.min(selectedDestinations.length, 3)).map((flight, index) => {
      const destination = selectedDestinations[index % selectedDestinations.length];
      
      // Calculate actual nights from flight dates
      const arrivalDate = new Date(flight.outboundFlight.arrivalDate);
      const departureDate = new Date(flight.returnFlight.departureDate);
      const actualNights = Math.max(1, Math.ceil((departureDate.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24)));
      
      // Determine trip duration text based on actual nights
      const durationText = actualNights === 1 ? "2 days / 1 night" : 
                          actualNights === 2 ? "3 days / 2 nights" :
                          actualNights === 3 ? "4 days / 3 nights" :
                          actualNights === 4 ? "5 days / 4 nights" :
                          `${actualNights + 1} days / ${actualNights} nights`;
      
      const accommodationCost = Math.round(150 + Math.random() * 200); // $150-350 per night
      const totalAccommodation = accommodationCost * actualNights;
      const activitiesCost = Math.round(100 + Math.random() * 200); // $100-300 for activities/meals
      const totalPrice = flight.price + totalAccommodation + activitiesCost;
      
      console.log(`Trip ${destination.title}: ${actualNights} nights, accommodation: $${totalAccommodation}, total: $${totalPrice}`);
      
      return {
        id: `trip_${flight.id}`,
        title: destination.title,
        destination: destination.destination,
        country: destination.country,
        duration: durationText,
        description: destination.description,
        features: destination.features,
        itinerary: destination.itinerary.slice(0, actualNights + 1), // Adjust itinerary to match actual nights
        flightInfo: flight,
        totalPrice: totalPrice,
        currency: flight.currency
      };
    });
  }

  generateAccommodationOptions(destination: string, checkIn: string, checkOut: string): AccommodationOption[] {
    // Calculate nights between dates
    const checkinDate = new Date(checkIn);
    const checkoutDate = new Date(checkOut);
    const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
    const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
    
    console.log('Accommodation dates:', {
      checkIn,
      checkOut,
      checkinDate,
      checkoutDate,
      timeDiff,
      nights
    });
    
    const accommodationTypes = [
      {
        name: `Grand ${destination} Hotel`,
        type: "5-Star Hotel",
        rating: 4.8,
        location: `${destination} City Center`,
        description: `Luxurious 5-star hotel in the heart of ${destination}, offering world-class amenities and exceptional service. Perfect for travelers seeking comfort and elegance.`,
        amenities: ["Free WiFi", "Swimming Pool", "Spa & Wellness", "Fitness Center", "Restaurant", "Room Service", "Concierge", "Valet Parking"],
        pricePerNight: 280 + Math.round(Math.random() * 120), // $280-400
        roomType: "Deluxe King Room",
        guests: 2
      },
      {
        name: `${destination} Boutique Inn`,
        type: "4-Star Boutique",
        rating: 4.5,
        location: `${destination} Historic District`,
        description: `Charming boutique hotel with unique character and personalized service. Located in the historic district, offering an authentic ${destination} experience.`,
        amenities: ["Free WiFi", "Breakfast Included", "Fitness Center", "Business Center", "Pet Friendly", "Free Parking"],
        pricePerNight: 180 + Math.round(Math.random() * 80), // $180-260
        roomType: "Superior Double Room",
        guests: 2
      },
      {
        name: `${destination} Express Hotel`,
        type: "3-Star Hotel",
        rating: 4.2,
        location: `${destination} Business District`,
        description: `Modern and comfortable hotel offering excellent value for money. Ideal for business travelers and budget-conscious tourists seeking quality accommodation.`,
        amenities: ["Free WiFi", "Breakfast Included", "24/7 Reception", "Business Center", "Free Parking", "Laundry Service"],
        pricePerNight: 120 + Math.round(Math.random() * 60), // $120-180
        roomType: "Standard Twin Room",
        guests: 2
      }
    ];

    return accommodationTypes.map((acc, index) => {
      const totalPrice = acc.pricePerNight * nights;
      return {
        id: `accommodation_${index}_${destination.toLowerCase()}`,
        name: acc.name,
        type: acc.type,
        rating: acc.rating,
        location: acc.location,
        description: acc.description,
        amenities: acc.amenities,
        pricePerNight: acc.pricePerNight,
        totalPrice: totalPrice,
        currency: "USD",
        checkIn: checkIn,
        checkOut: checkOut,
        roomType: acc.roomType,
        guests: acc.guests,
        nights: nights
      };
    });
  }

  generateBookingDetails(trip: TripOption, accommodation: AccommodationOption): BookingDetails {
    const bookingId = `BK${Date.now()}`;
    const validUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    
    // Calculate actual nights based on flight dates
    const arrivalDate = new Date(trip.flightInfo.outboundFlight.arrivalDate);
    const departureDate = new Date(trip.flightInfo.returnFlight.departureDate);
    const actualNights = Math.max(1, Math.ceil((departureDate.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    console.log('Booking details - actual nights:', actualNights, 'accommodation nights:', accommodation.nights);
    
    return {
      id: bookingId,
      packageId: trip.id,
      packageTitle: `${trip.title} - Complete Package`,
      totalPrice: `$${trip.flightInfo.price + (accommodation.pricePerNight * actualNights) + 150}`, // Add $150 for activities/transfers
      currency: 'USD',
      validUntil: validUntil.toISOString(),
      outboundFlight: {
        id: trip.flightInfo.outboundFlight.flightNumber,
        airline: trip.flightInfo.airline,
        flightNumber: trip.flightInfo.outboundFlight.flightNumber,
        departure: {
          airport: trip.flightInfo.outboundFlight.route.split(' → ')[0] || 'Departure Airport',
          city: trip.flightInfo.outboundFlight.route.split(' → ')[0] || 'Departure City',
          time: trip.flightInfo.outboundFlight.departureTime ? trip.flightInfo.outboundFlight.departureTime.substring(0, 5) : '12:00',
          date: trip.flightInfo.outboundFlight.departureDate
        },
        arrival: {
          airport: trip.flightInfo.outboundFlight.route.split(' → ')[1] || 'Arrival Airport',
          city: trip.flightInfo.outboundFlight.route.split(' → ')[1] || 'Arrival City',
          time: trip.flightInfo.outboundFlight.arrivalTime ? trip.flightInfo.outboundFlight.arrivalTime.substring(0, 5) : '15:00',
          date: trip.flightInfo.outboundFlight.arrivalDate
        },
        duration: trip.flightInfo.outboundFlight.duration,
        class: trip.flightInfo.mode.charAt(0).toUpperCase() + trip.flightInfo.mode.slice(1),
        price: `$${Math.round(trip.flightInfo.price * 0.6)}`,
        baggage: '1x 23kg checked bag, 1x carry-on'
      },
      returnFlight: {
        id: trip.flightInfo.returnFlight.flightNumber,
        airline: trip.flightInfo.airline,
        flightNumber: trip.flightInfo.returnFlight.flightNumber,
        departure: {
          airport: trip.flightInfo.returnFlight.route.split(' → ')[0] || 'Return Departure',
          city: trip.flightInfo.returnFlight.route.split(' → ')[0] || 'Return Departure City',
          time: trip.flightInfo.returnFlight.departureTime ? trip.flightInfo.returnFlight.departureTime.substring(0, 5) : '18:00',
          date: trip.flightInfo.returnFlight.departureDate
        },
        arrival: {
          airport: trip.flightInfo.returnFlight.route.split(' → ')[1] || 'Final Arrival',
          city: trip.flightInfo.returnFlight.route.split(' → ')[1] || 'Final Arrival City',
          time: trip.flightInfo.returnFlight.arrivalTime ? trip.flightInfo.returnFlight.arrivalTime.substring(0, 5) : '21:00',
          date: trip.flightInfo.returnFlight.arrivalDate
        },
        duration: trip.flightInfo.returnFlight.duration,
        class: trip.flightInfo.mode.charAt(0).toUpperCase() + trip.flightInfo.mode.slice(1),
        price: `$${Math.round(trip.flightInfo.price * 0.4)}`,
        baggage: '1x 23kg checked bag, 1x carry-on'
      },
      accommodation: {
        id: accommodation.id,
        name: accommodation.name,
        type: accommodation.type,
        rating: accommodation.rating,
        address: accommodation.location,
        checkIn: accommodation.checkIn,
        checkOut: accommodation.checkOut,
        roomType: accommodation.roomType,
        guests: accommodation.guests,
        nights: actualNights,
        pricePerNight: `$${accommodation.pricePerNight}`,
        totalPrice: `$${accommodation.pricePerNight * actualNights}`,
        amenities: accommodation.amenities
      },
      inclusions: [
        'Round-trip flights as specified',
        `${actualNights} nights accommodation at ${accommodation.name}`,
        'Airport transfers',
        '24/7 customer support',
        'Travel insurance coverage',
        ...trip.features,
        'Digital travel guide',
        'Emergency contact support'
      ],
      terms: [
        'Booking must be confirmed within 24 hours',
        'Cancellation allowed up to 48 hours before departure',
        'Changes may incur additional fees',
        'Valid passport required for international travel',
        'Terms and conditions apply',
        'Travel insurance is included but additional coverage recommended'
      ]
    };
  }

  detectCountryFromMessage(message: string): string | null {
    const messageLower = message.toLowerCase();
    const countryKeywords = {
      "Thailand": ["bangkok", "thailand", "thai", "phuket", "chiang mai", "krabi", "pattaya"],
      "Japan": ["japan", "japanese", "tokyo", "osaka", "kyoto", "hiroshima", "nagoya"],
      "South Korea": ["korea", "korean", "seoul", "busan", "jeju", "incheon"],
      "Singapore": ["singapore", "singaporean"],
      "Malaysia": ["malaysia", "malaysian", "kuala lumpur", "penang", "langkawi", "malacca"]
    };
    
    for (const [country, keywords] of Object.entries(countryKeywords)) {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        return country;
      }
    }
    
    return null;
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

      // Parse flight options if available and generate trip options
      let tripOptions: TripOption[] | undefined = undefined;
      let enhancedMessage = response.content;
      
      if (response.flight_object) {
        const flightOptions = this.parseFlightObject(response.flight_object);
        tripOptions = this.generateTripOptions(flightOptions, request.message);
        
        // Add engaging message when showing trip options
        if (tripOptions && tripOptions.length > 0) {
          const flightPrice = flightOptions[0]?.price || 0;
          const priceRange = flightOptions.length > 1 ? `Starting from $${Math.min(...flightOptions.map(f => f.price))}` : `$${flightPrice}`;
          const modes = [...new Set(flightOptions.map(f => f.mode))].join(', ');
          
          // Determine if this is a country-specific request
          const targetCountry = this.detectCountryFromMessage(request.message);
          const countryNames = {
            "Thailand": "Thailand",
            "Japan": "Japan", 
            "South Korea": "South Korea",
            "Singapore": "Singapore",
            "Malaysia": "Malaysia"
          };
          
          if (targetCountry && tripOptions.every(trip => trip.country === targetCountry)) {
            // Country-specific message
            enhancedMessage = `🎉 **Perfect! I found amazing flights to ${countryNames[targetCountry]}!**\n\n✈️ **Flight Details:**\n🏢 **Airline**: ${flightOptions[0]?.airline || 'Premium Airlines'}\n💵 **Pricing**: ${priceRange}\n🎯 **Travel Modes**: ${modes} options available\n\n🇾🇭 **Discover ${countryNames[targetCountry]}'s Best Destinations!**\n\nI've curated **${tripOptions.length} incredible ${countryNames[targetCountry]} experiences** that perfectly match your travel dates. From cultural immersion to modern adventures, each package offers unique insights into ${countryNames[targetCountry]}'s rich heritage and vibrant lifestyle!\n\n✨ **Choose your perfect ${countryNames[targetCountry]} adventure:**\n\n👇 **Select your preferred destination:**`;
          } else {
            // Mixed destinations message
            enhancedMessage = `🎉 **Fantastic! I found perfect flights for your Asian adventure!**\n\n✈️ **Flight Details:**\n🏢 **Airline**: ${flightOptions[0]?.airline || 'Premium Airlines'}\n💵 **Pricing**: ${priceRange}\n🎯 **Travel Modes**: ${modes} options available\n🗺️ **Routes**: Multiple Asian destinations\n\n🌏 **Curated Asian Experiences Await!**\n\nI've matched your flights with **${tripOptions.length} incredible destination packages** featuring Asia's most captivating cities. Each package includes comprehensive itineraries, cultural experiences, and unforgettable adventures!\n\n✨ **From bustling Tokyo to vibrant Bangkok - your perfect Asian getaway awaits:**\n\n👇 **Select your dream destination:**`;
          }
        }
      }

      // Convert the new API response to the legacy format
      return {
        id: `msg_${Date.now()}`,
        message: enhancedMessage,
        conversationId: response.conversation_id,
        timestamp: response.created_at,
        tripOptions,
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
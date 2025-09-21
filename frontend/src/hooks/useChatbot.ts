  // src/hooks/useChatbot.ts
  import { useState, useRef, useEffect } from 'react'
  import { Message, HolidayOption, DemoBookingDetails } from '../types'

  const HOLIDAY_OPTIONS: HolidayOption[] = [
    {
      id: 'bali',
      title: 'Tropical Paradise Escape',
      destination: 'Bali, Indonesia',
      duration: '7 Days / 6 Nights',
      flight: 'Emirates via Dubai - $680',
      hotel: 'Seminyak Beach Resort',
      activities: 'Temple tours, beach clubs, volcano hiking',
      budget: '~$1,200',
      description: 'Experience the magic of Bali with pristine beaches, ancient temples, and vibrant culture.',
      price: '$1,299',
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
      id: 'tokyo',
      title: 'Cultural Heritage Journey',
      destination: 'Tokyo, Japan',
      duration: '6 Days / 5 Nights',
      flight: 'ANA Direct - $850',
      hotel: 'Traditional Tokyo Ryokan',
      activities: 'Sushi tours, temples, shopping districts',
      budget: '~$1,500',
      description: 'Immerse yourself in traditional Japan with historic temples, gardens, and authentic cuisine.',
      price: '$1,599',
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
        name: 'Traditional Tokyo Ryokan',
        type: 'Authentic Ryokan',
        rating: 4.7,
        amenities: ['Onsen Bath', 'Tatami Rooms', 'Garden Views', 'Tea Ceremony']
      },
      itinerary: [
        'Day 1: Arrival & traditional welcome ceremony',
        'Day 2: Fushimi Inari & temples tours',
        'Day 3: Arashiyama bamboo grove & monkey park',
        'Day 4: Tea ceremony & kimono experience',
        'Day 5: Nijo Castle & Gion district exploration',
        'Day 6: Departure with farewell breakfast'
      ]
    },
    {
      id: 'paris',
      title: 'European Romantic Getaway',
      destination: 'Paris, France',
      duration: '5 Days / 4 Nights',
      flight: 'Air France Direct - $720',
      hotel: 'Marais District Boutique',
      activities: 'Museums, cafes, Seine river cruise',
      budget: '~$1,400',
      description: 'Discover the stunning beauty of Paris with breathtaking architecture and world-class cuisine.',
      price: '$1,199',
      features: [
        'Daily breakfast',
        'Museum passes included',
        'Seine cruise',
        'Photography session'
      ],
      flightInfo: {
        airline: 'Air France',
        duration: '12h 15m',
        stops: '1 stop via London'
      },
      accommodationInfo: {
        name: 'Marais Boutique Hotel',
        type: 'Boutique Hotel',
        rating: 4.8,
        amenities: ['City Views', 'Concierge', 'WiFi', 'Restaurant']
      },
      itinerary: [
        'Day 1: Arrival & Eiffel Tower viewing',
        'Day 2: Louvre & Notre Dame tours',
        'Day 3: Versailles day trip',
        'Day 4: Montmartre & Seine cruise',
        'Day 5: Final shopping & departure'
      ]
    }
  ]

  const DEFAULT_RESPONSES = [
    "That sounds like an amazing destination! Have you considered the best time to visit?",
    "I'd be happy to help you plan that trip! What's your budget range?",
    "Great choice! I can help you find the best deals for flights and accommodations.",
    "That destination is popular! Would you like me to suggest some must-see attractions?",
    "Perfect! Let me help you create an itinerary. How many days are you planning to stay?",
    "I can help you with that! Are you looking for adventure activities or cultural experiences?",
    "That's a fantastic idea! What type of accommodation are you preferring - hotel, resort, or local stays?",
    "💡 Tip: Type 'start' to see 3 curated holiday itinerary options with flights included!"
  ]

  export function useChatbot() {
    const [messages, setMessages] = useState<Message[]>([
      {
        id: '1',
        text: 'Hello! I\'m your AI travel assistant. Ask me anything about your trip planning needs! 🤖✈️\n\n💡 **Quick tip**: Type "start" to see 3 curated holiday itinerary options with flights!',
        sender: 'bot',
        timestamp: new Date()
      }
    ])
    const [inputMessage, setInputMessage] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [isProcessingBooking, setIsProcessingBooking] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
      scrollToBottom()
    }, [messages])

    const generateBookingDetails = (optionId: string): DemoBookingDetails => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 3);

      switch (optionId) {
        case 'bali':
          return {
            id: 'booking_bali_001',
            packageId: 'bali',
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
        default:
          // Generic booking for other destinations
          return {
            id: `booking_${optionId}_001`,
            packageId: optionId,
            packageTitle: `${HOLIDAY_OPTIONS.find(opt => opt.id === optionId)?.title} - ${HOLIDAY_OPTIONS.find(opt => opt.id === optionId)?.destination}`,
            totalPrice: HOLIDAY_OPTIONS.find(opt => opt.id === optionId)?.price || '$999',
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
    };

    const getDetailedResponse = (optionId: string): string => {
      switch (optionId) {
        case 'bali':
          return `🏝️ **Excellent choice! Bali Tropical Paradise**\n\n**Day-by-Day Itinerary:**\n\n**Day 1-2: Arrival & Seminyak**\n🏨 Check into Seminyak Beach Resort\n🍽️ Sunset dinner at Potato Head Beach Club\n🏖️ Relax on Seminyak Beach\n\n**Day 3-4: Ubud Cultural Experience**\n🐒 Sacred Monkey Forest Sanctuary\n🌾 Tegallalang Rice Terraces\n🧘 Traditional Balinese spa treatment\n\n**Day 5-6: Mount Batur Adventure**\n🌋 Sunrise volcano hiking\n☕ Coffee plantation tour\n🎭 Traditional Kecak fire dance\n\n**Day 7: Departure**\n🛍️ Last-minute shopping in Denpasar\n✈️ Flight back via Dubai\n\n**What's included:**\n• Round-trip Emirates flights\n• 6 nights accommodation\n• Daily breakfast\n• Airport transfers\n• All mentioned activities\n\nWould you like me to help you book this package or modify any part of the itinerary?`
        case 'tokyo':
          return `🗾 **Great pick! Tokyo Cultural Adventure**\n\n**Day-by-Day Itinerary:**\n\n**Day 1: Arrival & Shibuya**\n🏨 Check into Shibuya District Hotel\n🌃 Shibuya Crossing experience\n🍜 Authentic ramen dinner in Memory Lane\n\n**Day 2: Traditional Tokyo**\n⛩️ Senso-ji Temple in Asakusa\n🍣 Tsukiji Outer Market sushi tour\n🌸 East Gardens of Imperial Palace\n\n**Day 3: Modern Tokyo**\n🗼 Tokyo Skytree observation deck\n🛍️ Shopping in Harajuku & Omotesando\n🎌 TeamLab digital art museum\n\n**Day 4: Day Trip to Nikko**\n🚄 Bullet train to Nikko\n⛩️ Toshogu Shrine complex\n🍃 Lake Chuzenji scenic area\n\n**Day 5: Departure**\n🎁 Souvenir shopping in Ginza\n✈️ Direct ANA flight home\n\n**What's included:**\n• Round-trip ANA flights\n• 4 nights hotel accommodation\n• JR Pass for unlimited train travel\n• Guided temple tours\n• Traditional kaiseki dinner\n\nShall I proceed with booking details or would you like to customize this itinerary?`
        case 'paris':
          return `🇫🇷 **Magnifique! Paris European Charm**\n\n**Day-by-Day Itinerary:**\n\n**Day 1: Arrival & Marais**\n🏨 Check into Marais District Boutique Hotel\n🥐 Welcome breakfast at local café\n🏛️ Evening stroll along Seine River\n\n**Day 2: Classic Paris**\n🗼 Eiffel Tower & Trocadéro Gardens\n🖼️ Louvre Museum with skip-the-line tickets\n⛵ Seine River dinner cruise\n\n**Day 3: Montmartre & Sacré-Cœur**\n🎨 Artists' studios in Montmartre\n⛪ Sacré-Cœur Basilica\n🍷 Wine tasting in local bistro\n\n**Day 4: Palace of Versailles**\n🚄 Train to Versailles\n👑 Palace and Gardens tour\n🌺 Marie Antoinette's estate\n\n**Day 5: Modern Paris**\n🏛️ Musée d'Orsay\n🛍️ Shopping on Champs-Élysées\n☕ Farewell café au lait\n\n**Day 6: Departure**\n🥖 Final French breakfast\n✈️ Air France direct flight\n\n**What's included:**\n• Round-trip Air France flights\n• 5 nights boutique accommodation\n• Metro passes for city transport\n• Skip-the-line museum tickets\n• Seine dinner cruise\n• Day trip to Versailles\n\nReady to book this romantic Parisian adventure or need any adjustments?`
        default:
          return "I'm sorry, I don't have detailed information about that option."
      }
    }

    const sendMessage = (message: string) => {
      if (!message.trim()) return

      const userMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: 'user',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, userMessage])
      setInputMessage('')
      setIsTyping(true)

      const currentInput = message.toLowerCase().trim()

      setTimeout(() => {
        if (currentInput === 'start') {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: '🌟 Here are 3 amazing holiday itinerary options for you! Click on any option below to get detailed day-by-day itineraries:',
            sender: 'bot',
            timestamp: new Date(),
            options: HOLIDAY_OPTIONS
          }
          setMessages(prev => [...prev, botMessage])
        } else {
          const randomResponse = DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)]
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: randomResponse,
            sender: 'bot',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, botMessage])
        }
        setIsTyping(false)
      }, 1500 + Math.random() * 1500)
    }

    const selectOption = (option: HolidayOption) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: `I want to book the ${option.title} package to ${option.destination}`,
        sender: 'user',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, userMessage])
      setIsTyping(true)

      setTimeout(() => {
        const bookingDetails = generateBookingDetails(option.id)
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `🎯 **Great choice!** Here are the detailed booking information for your selected package:\n\n📋 Please review all details below and confirm your booking.`,
          sender: 'bot',
          timestamp: new Date(),
          bookingDetails: bookingDetails
        }

        setMessages(prev => [...prev, botMessage])
        setIsTyping(false)
      }, 2000 + Math.random() * 1000)
    }

    const confirmBooking = (bookingId: string) => {
      setIsProcessingBooking(true)
      
      setTimeout(() => {
        const confirmationMessage: Message = {
          id: `confirm_${Date.now()}`,
          text: `🎉 **Booking Confirmed!** \n\nThank you for choosing us! Your booking has been successfully confirmed.\n\n📧 **Confirmation Details:**\n• Booking ID: ${bookingId}\n• Confirmation email sent\n• E-tickets will arrive within 24 hours\n• Hotel vouchers included in confirmation\n\n📞 **Need Help?** Our 24/7 support team is ready to assist you at support@aistronaut.com\n\nWe wish you an amazing trip! ✈️🌍`,
          sender: 'bot',
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, confirmationMessage])
        setIsProcessingBooking(false)
      }, 2000 + Math.random() * 2000)
    }

    const cancelBooking = (bookingId: string) => {
      const cancelMessage: Message = {
        id: `cancel_${Date.now()}`,
        text: `🔄 **Booking Cancelled**\n\nNo worries! Your booking has been cancelled and no charges were made.\n\n💭 Feel free to:\n• Browse other travel packages\n• Modify your preferences\n• Ask me for different recommendations\n\nI'm here to help you find the perfect trip! What would you like to explore next?`,
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, cancelMessage])
    }

    return {
      messages,
      inputMessage,
      setInputMessage,
      isTyping,
      isProcessingBooking,
      messagesEndRef,
      sendMessage,
      selectOption,
      confirmBooking,
      cancelBooking
    }
  }

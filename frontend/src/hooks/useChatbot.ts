  // src/hooks/useChatbot.ts
  import { useState, useRef, useEffect } from 'react'
  import { Message, HolidayOption } from '../types'

  const HOLIDAY_OPTIONS: HolidayOption[] = [
    {
      id: 'bali',
      title: 'Tropical Paradise',
      destination: 'Bali, Indonesia',
      duration: '7 Days / 6 Nights',
      flight: 'Emirates via Dubai - $680',
      hotel: 'Seminyak Beach Resort',
      activities: 'Temple tours, beach clubs, volcano hiking',
      budget: '~$1,200'
    },
    {
      id: 'tokyo',
      title: 'Cultural Adventure',
      destination: 'Tokyo, Japan',
      duration: '5 Days / 4 Nights',
      flight: 'ANA Direct - $850',
      hotel: 'Shibuya District Hotel',
      activities: 'Sushi tours, temples, shopping districts',
      budget: '~$1,500'
    },
    {
      id: 'paris',
      title: 'European Charm',
      destination: 'Paris, France',
      duration: '6 Days / 5 Nights',
      flight: 'Air France Direct - $720',
      hotel: 'Marais District Boutique',
      activities: 'Museums, cafes, Seine river cruise',
      budget: '~$1,400'
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
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
      scrollToBottom()
    }, [messages])

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
        text: `I'm interested in ${option.title} - ${option.destination}`,
        sender: 'user',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, userMessage])
      setIsTyping(true)

      setTimeout(() => {
        const detailedResponse = getDetailedResponse(option.id)
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: detailedResponse,
          sender: 'bot',
          timestamp: new Date()
        }

        setMessages(prev => [...prev, botMessage])
        setIsTyping(false)
      }, 2000 + Math.random() * 1000)
    }

    return {
      messages,
      inputMessage,
      setInputMessage,
      isTyping,
      messagesEndRef,
      sendMessage,
      selectOption
    }
  }

// src/hooks/useApiChat.ts

import { useState, useRef, useEffect, useCallback } from 'react';
import { chatApiService, LegacyChatResponse, TravelOption, BookingDetails, TripObject, FlightOption, TripOption, AccommodationOption } from '../services/chatApi';
import { conversationStorage } from '../lib/conversation';
import { useAuth } from '../contexts/AuthContext';

export interface ApiMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  options?: TravelOption[];
  flightOptions?: FlightOption[];
  tripOptions?: TripOption[];
  accommodationOptions?: AccommodationOption[];
  bookingDetails?: BookingDetails;
  tripData?: TripObject;
  metadata?: {
    confidence: number;
    intent: string;
    entities?: any[];
  };
  isError?: boolean;
}

export interface ChatError {
  message: string;
  type: 'network' | 'api' | 'unknown';
}

export function useApiChat() {
  const { isAuthenticated, user } = useAuth();
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isProcessingBooking, setIsProcessingBooking] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<TripOption | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation when authenticated
  useEffect(() => {
    if (isAuthenticated && !conversationId) {
      initializeConversation();
    } else if (!isAuthenticated) {
      // Show authentication required message
      setMessages([
        {
          id: 'auth_required',
          text: '🔒 **Authentication Required**\n\nPlease sign in to start chatting with your AI travel assistant. Once signed in, I can help you:\n\n• Find personalized travel packages\n• Compare prices and options\n• Plan detailed itineraries\n• Answer travel questions',
          sender: 'bot',
          timestamp: new Date(),
          metadata: {
            confidence: 1.0,
            intent: 'auth_required'
          }
        }
      ]);
    }
  }, [isAuthenticated, conversationId]);

  const initializeConversation = async () => {
    try {
      // Check for existing conversation
      const existingConversationId = conversationStorage.getCurrentConversationId();
      if (existingConversationId) {
        const storedConversation = conversationStorage.getConversation(existingConversationId);
        if (storedConversation) {
          setConversationId(existingConversationId);
          // Load stored messages
          const storedMessages = storedConversation.messages.map(msg => ({
            id: msg.id,
            text: msg.content,
            sender: msg.isUser ? 'user' as const : 'bot' as const,
            timestamp: new Date(msg.timestamp),
            tripData: msg.tripData,
            metadata: {
              confidence: 1.0,
              intent: msg.isUser ? 'user_message' : 'bot_response'
            }
          }));
          setMessages(storedMessages);
          return;
        }
      }

      // Create new conversation
      const response = await chatApiService.createConversation();
      const newConversationId = response.conversation_id;
      setConversationId(newConversationId);
      
      // Create conversation in storage
      conversationStorage.createConversation(newConversationId);
      
      // Add welcome message
      const welcomeMessage: ApiMessage = {
        id: 'welcome',
        text: `Hello ${user?.username || 'there'}! 👋 I'm your AI travel assistant powered by our advanced backend system. 🤖✈️\n\nI can help you:\n• Find personalized travel packages\n• Compare prices and options\n• Plan detailed itineraries\n• Answer travel questions\n\n💡 **Try asking**: "I want to travel to Japan tomorrow alone" or "Show me beach destinations"`,
        sender: 'bot',
        timestamp: new Date(),
        metadata: {
          confidence: 1.0,
          intent: 'greeting'
        }
      };
      
      setMessages([welcomeMessage]);
      
    } catch (err) {
      console.error('Failed to initialize conversation:', err);
      setError({
        message: 'Failed to start conversation. Please check your connection.',
        type: 'network'
      });
    }
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const addMessage = useCallback((message: ApiMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const convertApiResponseToMessage = useCallback((response: LegacyChatResponse): ApiMessage => {
    return {
      id: response.id,
      text: response.message,
      sender: 'bot',
      timestamp: new Date(response.timestamp),
      options: response.options,
      flightOptions: response.flightOptions,
      tripOptions: response.tripOptions,
      accommodationOptions: response.accommodationOptions,
      bookingDetails: response.bookingDetails,
      metadata: response.metadata
    };
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading || !conversationId || !isAuthenticated) return;

    // Clear any previous errors
    clearError();

    // Add user message
    const userMessage: ApiMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    addMessage(userMessage);
    setInputMessage('');
    setIsLoading(true);

    // Store user message in conversation
    conversationStorage.addMessage(conversationId, {
      id: userMessage.id,
      content: userMessage.text,
      isUser: true,
      timestamp: userMessage.timestamp.toISOString()
    });

    try {
      const response = await chatApiService.sendLegacyMessage({
        message: message,
        conversationId: conversationId || undefined
      });

      const botMessage = convertApiResponseToMessage(response);
      addMessage(botMessage);

      // Store bot message in conversation
      conversationStorage.addMessage(conversationId, {
        id: botMessage.id,
        content: botMessage.text,
        isUser: false,
        timestamp: botMessage.timestamp.toISOString(),
        tripData: botMessage.tripData
      });

    } catch (err) {
      console.error('Chat API error:', err);
      
      // Determine error type
      let errorType: ChatError['type'] = 'unknown';
      let errorMessage = 'Something went wrong. Please try again.';

      if (err instanceof Error) {
        errorMessage = err.message;
        if (err.message.includes('connect') || err.message.includes('network')) {
          errorType = 'network';
        } else if (err.message.includes('HTTP') || err.message.includes('API')) {
          errorType = 'api';
        }
      }

      setError({ message: errorMessage, type: errorType });

      // Add error message to chat
      const errorBotMessage: ApiMessage = {
        id: (Date.now() + 1).toString(),
        text: `❌ I'm sorry, I encountered an error: ${errorMessage}\n\nPlease try again in a moment. If the problem persists, make sure the backend server is running.`,
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
        metadata: {
          confidence: 0,
          intent: 'error_response'
        }
      };

      addMessage(errorBotMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, clearError, addMessage, conversationId, convertApiResponseToMessage, isAuthenticated]);

  const selectOption = useCallback(async (option: TravelOption) => {
    const userMessage: ApiMessage = {
      id: Date.now().toString(),
      text: `I'm interested in "${option.title}" - ${option.destination}`,
      sender: 'user',
      timestamp: new Date()
    };

    addMessage(userMessage);
    setIsLoading(true);
    clearError();

    try {
      // Send option selection to get booking details
      const detailedMessage = `I want to book the ${option.title} package to ${option.destination}.`;
      
      const response = await chatApiService.sendOptionSelection(option.id, {
        message: detailedMessage,
        conversationId: conversationId || undefined
      });

      const botMessage = convertApiResponseToMessage(response);
      addMessage(botMessage);

    } catch (err) {
      console.error('Option selection error:', err);
      
      // Create a detailed response based on the selected option
      const detailedResponse = getDetailedOptionResponse(option);
      const fallbackMessage: ApiMessage = {
        id: (Date.now() + 1).toString(),
        text: detailedResponse,
        sender: 'bot',
        timestamp: new Date(),
        metadata: {
          confidence: 0.8,
          intent: 'option_details_fallback'
        }
      };

      addMessage(fallbackMessage);
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, conversationId, clearError, convertApiResponseToMessage]);

  const selectFlight = useCallback(async (flight: FlightOption) => {
    const userMessage: ApiMessage = {
      id: Date.now().toString(),
      text: `I'd like to select the ${flight.mode} mode flight with ${flight.airline} for $${flight.price}`,
      sender: 'user',
      timestamp: new Date()
    };

    addMessage(userMessage);
    setIsLoading(true);
    clearError();

    try {
      const detailedMessage = `I want to book the ${flight.mode} mode flight option with ${flight.airline} departing on ${flight.outboundFlight.departureDate} and returning on ${flight.returnFlight.departureDate} for $${flight.price}.`;
      
      const response = await chatApiService.sendLegacyMessage({
        message: detailedMessage,
        conversationId: conversationId || undefined
      });

      const botMessage = convertApiResponseToMessage(response);
      addMessage(botMessage);

      // Store messages in conversation
      if (conversationId) {
        conversationStorage.addMessage(conversationId, {
          id: userMessage.id,
          content: userMessage.text,
          isUser: true,
          timestamp: userMessage.timestamp.toISOString()
        });
        
        conversationStorage.addMessage(conversationId, {
          id: botMessage.id,
          content: botMessage.text,
          isUser: false,
          timestamp: botMessage.timestamp.toISOString()
        });
      }

    } catch (err) {
      console.error('Flight selection error:', err);
      
      const fallbackMessage: ApiMessage = {
        id: (Date.now() + 1).toString(),
        text: `✈️ **Flight Selection Confirmed!**\n\nYou've selected:\n• **${flight.mode.toUpperCase()} Mode** with ${flight.airline}\n• **Price**: $${flight.price} ${flight.currency}\n• **Outbound**: ${flight.outboundFlight.route} on ${flight.outboundFlight.departureDate}\n• **Return**: ${flight.returnFlight.route} on ${flight.returnFlight.departureDate}\n\n${flight.reason}\n\n🎯 **Next Steps:**\nWould you like me to:\n• Find accommodation for your destination?\n• Show you activities and attractions?\n• Help you plan your itinerary?\n• Proceed to booking?`,
        sender: 'bot',
        timestamp: new Date(),
        metadata: {
          confidence: 0.9,
          intent: 'flight_selection_fallback'
        }
      };

      addMessage(fallbackMessage);
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, conversationId, clearError, convertApiResponseToMessage]);

  const selectTrip = useCallback(async (trip: TripOption) => {
    console.log('selectTrip called with:', trip);
    
    const userMessage: ApiMessage = {
      id: Date.now().toString(),
      text: `I'd like to select the ${trip.title} package to ${trip.destination}, ${trip.country} for $${trip.totalPrice}`,
      sender: 'user',
      timestamp: new Date()
    };

    addMessage(userMessage);
    setIsLoading(true);
    clearError();
    setCurrentTrip(trip); // Store the selected trip
    console.log('Current trip set to:', trip);

    try {
      // Generate accommodation options for the selected destination
      const accommodationOptions = chatApiService.generateAccommodationOptions(
        trip.destination,
        trip.flightInfo.outboundFlight.arrivalDate,
        trip.flightInfo.returnFlight.departureDate
      );
      
      const botMessage: ApiMessage = {
        id: (Date.now() + 1).toString(),
        text: `🎉 **Fantastic Choice!** You've selected the **${trip.title}** adventure!\n\n✅ **Your Trip Summary:**\n📍 **Destination**: ${trip.destination}, ${trip.country}\n🗺️ **Duration**: ${trip.duration}\n✈️ **Airline**: ${trip.flightInfo.airline} (${trip.flightInfo.mode} mode)\n💵 **Flight Cost**: $${trip.flightInfo.price}\n\n🏨 **Next Step: Choose Your Perfect Accommodation!**\n\nI've handpicked **3 amazing hotels** in ${trip.destination} that match your travel dates perfectly. From luxury to budget-friendly, each offers unique experiences:\n\n👇 **Select your preferred accommodation style:**`,
        sender: 'bot',
        timestamp: new Date(),
        accommodationOptions,
        metadata: {
          confidence: 0.9,
          intent: 'trip_selected_show_accommodation'
        }
      };

      addMessage(botMessage);

      // Store messages in conversation
      if (conversationId) {
        conversationStorage.addMessage(conversationId, {
          id: userMessage.id,
          content: userMessage.text,
          isUser: true,
          timestamp: userMessage.timestamp.toISOString()
        });
        
        conversationStorage.addMessage(conversationId, {
          id: botMessage.id,
          content: botMessage.text,
          isUser: false,
          timestamp: botMessage.timestamp.toISOString()
        });
      }

    } catch (err) {
      console.error('Trip selection error:', err);
      
      const fallbackMessage: ApiMessage = {
        id: (Date.now() + 1).toString(),
        text: `🎯 **Trip Selected!** You've chosen the ${trip.title} package to ${trip.destination}!\n\nNext, I'll help you find accommodation. Please let me know your preferences or I can show you some recommended options.`,
        sender: 'bot',
        timestamp: new Date(),
        metadata: {
          confidence: 0.8,
          intent: 'trip_selection_fallback'
        }
      };

      addMessage(fallbackMessage);
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, conversationId, clearError, setCurrentTrip]);

  const selectAccommodation = useCallback(async (accommodation: AccommodationOption, selectedTrip?: TripOption) => {
    console.log('=== selectAccommodation START ===');
    console.log('selectAccommodation called with accommodation:', accommodation);
    console.log('Current trip in selectAccommodation:', currentTrip);
    console.log('selectedTrip parameter:', selectedTrip);
    
    const userMessage: ApiMessage = {
      id: Date.now().toString(),
      text: `I'd like to book ${accommodation.name} for ${accommodation.nights} nights at $${accommodation.totalPrice}`,
      sender: 'user',
      timestamp: new Date()
    };

    addMessage(userMessage);
    setIsLoading(true);
    clearError();

    try {
      // Generate booking details using current trip and selected accommodation
      let bookingDetails: BookingDetails | undefined;
      
      // Use the currentTrip state or fallback to selectedTrip parameter
      const tripToUse = currentTrip || selectedTrip;
      console.log('Trip to use for booking details:', tripToUse);
      
      if (tripToUse) {
        try {
          console.log('Calling generateBookingDetails with:', { trip: tripToUse, accommodation });
          bookingDetails = chatApiService.generateBookingDetails(tripToUse, accommodation);
          console.log('Generated booking details successfully:', bookingDetails);
          console.log('Booking details valid:', !!bookingDetails);
        } catch (error) {
          console.error('Error generating booking details:', error);
          console.error('Error stack:', error instanceof Error ? error.stack : 'No stack available');
          bookingDetails = undefined;
        }
      } else {
        console.warn('No current trip found for booking details generation');
        console.warn('currentTrip:', currentTrip);
        console.warn('selectedTrip:', selectedTrip);
      }

      const tripForCalculation = tripToUse || currentTrip;
      const totalPrice = tripForCalculation ? tripForCalculation.flightInfo.price + accommodation.totalPrice + 150 : accommodation.totalPrice;
      
      console.log('Creating booking message with:');
      console.log('- tripForCalculation:', tripForCalculation);
      console.log('- totalPrice:', totalPrice);
      console.log('- bookingDetails:', bookingDetails);
      console.log('- bookingDetails exists:', !!bookingDetails);
      
      const bookingMessage: ApiMessage = {
        id: (Date.now() + 1).toString(),
        text: `🎆 **Excellent Selection!** You've chosen the **${accommodation.name}**!\n\n🏆 **Your Complete Asian Adventure Package:**\n\n🎯 **Trip**: ${tripForCalculation?.title || 'Selected Asian Trip'}\n🏨 **Hotel**: ${accommodation.name} (${accommodation.type})\n🕑 **Duration**: ${tripForCalculation?.duration || 'Multi-day trip'}\n⭐ **Rating**: ${accommodation.rating}/5 stars\n💰 **Total Package**: $${totalPrice}\n\n📊 **Ready for Final Review!**\n\nYour complete booking details are displayed below. Review all the information carefully, then confirm to secure your amazing Asian adventure!\n\n👇 **Scroll down to see full booking details and payment options:**`,
        sender: 'bot',
        timestamp: new Date(),
        bookingDetails,
        metadata: {
          confidence: 0.95,
          intent: 'accommodation_selected_show_booking'
        }
      };
      
      console.log('Final BookingMessage created:');
      console.log('- Message ID:', bookingMessage.id);
      console.log('- Has bookingDetails:', !!bookingMessage.bookingDetails);
      console.log('- BookingDetails object:', bookingMessage.bookingDetails);
      console.log('=== selectAccommodation about to addMessage ===');

      addMessage(bookingMessage);

      // Store messages in conversation
      if (conversationId) {
        conversationStorage.addMessage(conversationId, {
          id: userMessage.id,
          content: userMessage.text,
          isUser: true,
          timestamp: userMessage.timestamp.toISOString()
        });
        
        conversationStorage.addMessage(conversationId, {
          id: bookingMessage.id,
          content: bookingMessage.text,
          isUser: false,
          timestamp: bookingMessage.timestamp.toISOString()
        });
      }

    } catch (err) {
      console.error('Accommodation selection error:', err);
      
      const fallbackMessage: ApiMessage = {
        id: (Date.now() + 1).toString(),
        text: `🏨 **Accommodation Confirmed!** You've selected ${accommodation.name}.\n\nYour booking is almost complete. What would you like to do next?`,
        sender: 'bot',
        timestamp: new Date(),
        metadata: {
          confidence: 0.8,
          intent: 'accommodation_selection_fallback'
        }
      };

      addMessage(fallbackMessage);
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, conversationId, clearError, currentTrip]);

  const retryLastMessage = useCallback(async () => {
    const lastUserMessage = messages
      .slice()
      .reverse()
      .find(msg => msg.sender === 'user' && !msg.isError);

    if (lastUserMessage) {
      await sendMessage(lastUserMessage.text);
    }
  }, [messages, sendMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  }, [inputMessage, sendMessage]);

  const confirmBooking = useCallback(async (bookingId: string) => {
    setIsProcessingBooking(true);
    
    try {
      // Simulate booking confirmation delay
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
      
      const confirmationMessage: ApiMessage = {
        id: `confirm_${Date.now()}`,
        text: `🎉 **Booking Confirmed Successfully!** \n\n🚀 **Congratulations!** Your amazing ${currentTrip?.destination || 'Asian'} adventure is officially booked!\n\n🏷️ **Booking Summary:**\n• **Booking ID**: ${bookingId}\n• **Destination**: ${currentTrip?.destination}, ${currentTrip?.country}\n• **Duration**: ${currentTrip?.duration || '5 days'}\n• **Flights**: ${currentTrip?.flightInfo.airline} (${currentTrip?.flightInfo.mode} mode)\n• **Hotel**: Confirmed accommodation\n• **Total Paid**: ${currentTrip ? `$${currentTrip.flightInfo.price + 750}` : 'Confirmed'}\n\n📧 **What's Next:**\n• Confirmation email sent to your inbox\n• E-tickets arriving within 24 hours\n• Hotel vouchers included\n• Digital itinerary with local tips\n• 24/7 travel support activated\n\n📞 **Questions?** Contact us at support@aistronaut.com\n\n✨ **Have an incredible trip!** Your ${currentTrip?.destination || 'Asian'} adventure awaits! ✈️🌍`,
        sender: 'bot',
        timestamp: new Date(),
        metadata: {
          confidence: 1.0,
          intent: 'booking_confirmed_detailed'
        }
      };
      
      addMessage(confirmationMessage);
      
    } catch (err) {
      console.error('Booking confirmation error:', err);
      
      const errorMessage: ApiMessage = {
        id: `error_${Date.now()}`,
        text: `❌ **Booking Error**\n\nWe encountered an issue while processing your booking. Please try again or contact our support team.\n\nYour payment has not been charged.`,
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
        metadata: {
          confidence: 0,
          intent: 'booking_error'
        }
      };
      
      addMessage(errorMessage);
    } finally {
      setIsProcessingBooking(false);
    }
  }, [addMessage, currentTrip]);

  const cancelBooking = useCallback(async (bookingId?: string) => {
    const cancelMessage: ApiMessage = {
      id: `cancel_${Date.now()}`,
      text: `🔄 **Booking Cancelled**\n\nNo worries! Your booking has been cancelled and no charges were made.\n\n💭 Feel free to:\n• Browse other travel packages\n• Modify your preferences\n• Ask me for different recommendations\n\nI'm here to help you find the perfect trip! What would you like to explore next?`,
      sender: 'bot',
      timestamp: new Date(),
      metadata: {
        confidence: 1.0,
        intent: 'booking_cancelled'
      }
    };
    
    addMessage(cancelMessage);
  }, [addMessage]);

  const createNewConversation = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      
      // Create conversation via API
      const response = await chatApiService.createConversation();
      const apiConversationId = response.conversation_id;
      
      // Create conversation in storage using API conversation ID
      conversationStorage.createConversation(apiConversationId, 'New Trip Planning');
      
      // Update state
      setConversationId(apiConversationId);
      setMessages([]);
      setInputMessage('');
      setCurrentTrip(null); // Reset current trip for new conversation
      clearError();
      
      // Add welcome message for new conversation
      const welcomeMessage: ApiMessage = {
        id: 'welcome_new',
        text: `Hello ${user?.username || 'there'}! 👋 Welcome to your new conversation! \n\nI'm ready to help you plan another amazing trip. What destination are you thinking about this time?`,
        sender: 'bot',
        timestamp: new Date(),
        metadata: {
          confidence: 1.0,
          intent: 'new_conversation_greeting'
        }
      };
      
      setMessages([welcomeMessage]);
      
      // Store welcome message
      conversationStorage.addMessage(apiConversationId, {
        id: welcomeMessage.id,
        content: welcomeMessage.text,
        isUser: false,
        timestamp: welcomeMessage.timestamp.toISOString()
      });
      
    } catch (err) {
      console.error('Failed to create new conversation:', err);
      setError({
        message: 'Failed to create new conversation. Please try again.',
        type: 'api'
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, clearError, addMessage]);

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    isProcessingBooking,
    error,
    messagesEndRef,
    sendMessage,
    selectOption,
    selectFlight,
    selectTrip,
    selectAccommodation,
    retryLastMessage,
    clearError,
    handleKeyPress,
    confirmBooking,
    cancelBooking,
    createNewConversation,
    conversationId: conversationId || 'not_initialized'
  };
}

// Helper function to generate detailed responses for options
function getDetailedOptionResponse(option: TravelOption): string {
  return `🎯 **${option.title} - ${option.destination}**

📅 **Duration**: ${option.duration}
💰 **Price**: ${option.price}

${option.description}

✨ **What's included**:
${option.features.map(feature => `• ${feature}`).join('\n')}

This package offers excellent value and includes everything you need for an unforgettable experience. Would you like me to help you customize this itinerary or check availability for specific dates?

💡 **Next steps**: You can ask me about:
• Best time to visit ${option.destination}
• What to pack for this trip
• Local customs and traditions
• Additional activities or extensions`;
}
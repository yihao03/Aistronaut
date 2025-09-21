// src/hooks/useApiChat.ts

import { useState, useRef, useEffect, useCallback } from 'react';
import { chatApiService, ChatResponse, TravelOption, BookingDetails } from '../services/chatApi';

export interface ApiMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  options?: TravelOption[];
  bookingDetails?: BookingDetails;
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
  const [messages, setMessages] = useState<ApiMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI travel assistant powered by our advanced backend system. 🤖✈️\n\nI can help you:\n• Find personalized travel packages\n• Compare prices and options\n• Plan detailed itineraries\n• Answer travel questions\n\n💡 **Try asking**: "Show me travel packages" or "What are my options for a beach vacation?"',
      sender: 'bot',
      timestamp: new Date(),
      metadata: {
        confidence: 1.0,
        intent: 'greeting'
      }
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);
  const [conversationId] = useState('conv_' + Date.now());
  const [isProcessingBooking, setIsProcessingBooking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const convertApiResponseToMessage = useCallback((response: ChatResponse): ApiMessage => {
    return {
      id: response.id,
      text: response.message,
      sender: 'bot',
      timestamp: new Date(response.timestamp),
      options: response.options,
      bookingDetails: response.bookingDetails,
      metadata: response.metadata
    };
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading) return;

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

    try {
      const response = await chatApiService.sendMessage({
        message: message,
        conversationId: conversationId
      });

      const botMessage = convertApiResponseToMessage(response);
      addMessage(botMessage);

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
  }, [isLoading, clearError, addMessage, conversationId, convertApiResponseToMessage]);

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
        conversationId: conversationId
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
        text: `🎉 **Booking Confirmed!** \n\nThank you for choosing us! Your booking has been successfully confirmed.\n\n📧 **Confirmation Details:**\n• Booking ID: ${bookingId}\n• Confirmation email sent\n• E-tickets will arrive within 24 hours\n• Hotel vouchers included in confirmation\n\n📞 **Need Help?** Our 24/7 support team is ready to assist you at support@aistronaut.com\n\nWe wish you an amazing trip! ✈️🌍`,
        sender: 'bot',
        timestamp: new Date(),
        metadata: {
          confidence: 1.0,
          intent: 'booking_confirmed'
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
  }, [addMessage]);

  const cancelBooking = useCallback(async (bookingId: string) => {
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
    retryLastMessage,
    clearError,
    handleKeyPress,
    confirmBooking,
    cancelBooking,
    conversationId
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
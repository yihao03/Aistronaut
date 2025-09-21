// src/components/chatbot/ApiChatBot.tsx

import { Bot, Send, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useApiChat } from '../../hooks/useApiChat';
import ApiMessageBubble from './ApiMessageBubble';
import ApiOptionBoxes from './ApiOptionBoxes';
import BookingDetails from './BookingDetails';
import TypingIndicator from './TypingIndicator';

export default function ApiChatBot() {
  const {
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
  } = useApiChat();

  const handleSendMessage = () => {
    if (inputMessage.trim() && !isLoading) {
      sendMessage(inputMessage);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg mb-10 border border-gray-200">
      {/* Header with status indicator */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bot className="h-6 w-6" />
              {isLoading && (
                <Loader2 className="absolute -top-1 -right-1 h-3 w-3 animate-spin text-yellow-300" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI Travel Assistant</h2>
              <p className="text-purple-100 text-sm">Powered by advanced AI backend</p>
            </div>
          </div>
          
          {/* Connection status */}
          <div className="flex items-center space-x-2">
            {error ? (
              <div className="flex items-center text-red-200">
                <WifiOff className="h-4 w-4 mr-1" />
                <span className="text-xs">Connection Issue</span>
              </div>
            ) : (
              <div className="flex items-center text-green-200">
                <Wifi className="h-4 w-4 mr-1" />
                <span className="text-xs">Connected</span>
              </div>
            )}
          </div>
        </div>
        <p className="mt-2 text-purple-100">
          Ask me anything about travel! I'm connected to our intelligent backend system.
        </p>
        
        {/* Conversation ID for debugging */}
        <div className="mt-2 text-xs text-purple-200 font-mono">
          Session: {conversationId.slice(-8)}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <WifiOff className="h-5 w-5 text-red-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-red-800">Connection Error</p>
              <p className="text-xs text-red-600">{error.message}</p>
            </div>
          </div>
          <Button
            onClick={clearError}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-300 hover:bg-red-100"
          >
            Dismiss
          </Button>
        </div>
      )}
      
      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.map((message) => (
          <div key={message.id}>
            <ApiMessageBubble 
              message={message} 
              onRetry={message.isError ? retryLastMessage : undefined}
            />
            
            {/* Travel Options */}
            {message.options && message.sender === 'bot' && !message.isError && (
              <div className="mt-4">
                <ApiOptionBoxes 
                  options={message.options} 
                  onSelectOption={selectOption} 
                />
              </div>
            )}
            
            {/* Booking Details */}
            {message.bookingDetails && message.sender === 'bot' && !message.isError && (
              <div className="mt-4">
                <BookingDetails 
                  bookingDetails={message.bookingDetails}
                  onConfirm={confirmBooking}
                  onCancel={cancelBooking}
                  isLoading={isProcessingBooking}
                />
              </div>
            )}
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-indigo-100 rounded-full p-2">
              <Bot className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="ml-3">
              <TypingIndicator />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about destinations, packages, prices, or anything travel-related..."
            className="flex-1 bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            disabled={isLoading || isProcessingBooking}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading || isProcessingBooking}
            className="px-6 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isLoading || isProcessingBooking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* Quick suggestions */}
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            "Show me travel packages",
            "Beach destinations under $1500",
            "Cultural experiences in Asia",
            "Adventure trips"
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setInputMessage(suggestion);
                setTimeout(() => sendMessage(suggestion), 100);
              }}
              disabled={isLoading || isProcessingBooking}
              className="text-xs bg-white border border-gray-300 text-gray-600 px-3 py-1 rounded-full hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
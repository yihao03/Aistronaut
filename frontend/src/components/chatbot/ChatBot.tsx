// src/components/chatbot/ChatBot.tsx
import { Bot, Send } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useChatbot } from '../../hooks/useChatbot'
import MessageBubble from './MessageBubble'
import EnhancedOptionBoxes from './EnhancedOptionBoxes'
import DemoBookingDetails from './DemoBookingDetails'
import TypingIndicator from './TypingIndicator'

export default function ChatBot() {
  const {
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
  } = useChatbot()

  const handleSendMessage = () => {
    sendMessage(inputMessage)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg mb-10">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <Bot className="h-6 w-6" />
          <h2 className="text-2xl font-bold">AI Travel Assistant</h2>
        </div>
        <p className="mt-2 text-indigo-100">Ask me anything about your travel plans!</p>
      </div>
      
      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            <MessageBubble message={message} />
            
            {/* Holiday Options */}
            {message.options && message.sender === 'bot' && (
              <EnhancedOptionBoxes 
                options={message.options} 
                onSelectOption={selectOption} 
              />
            )}
            
            {/* Booking Details */}
            {message.bookingDetails && message.sender === 'bot' && (
              <DemoBookingDetails 
                bookingDetails={message.bookingDetails}
                onConfirm={confirmBooking}
                onCancel={cancelBooking}
                isLoading={isProcessingBooking}
              />
            )}
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about destinations, budgets, activities..."
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping || isProcessingBooking}
            className="px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// src/components/chatbot/TypingIndicator.tsx
import { Bot } from 'lucide-react'

export default function TypingIndicator() {
  return (
    <div className="flex items-start space-x-3 justify-start">
      <div className="bg-indigo-100 rounded-full p-2 flex-shrink-0">
        <Bot className="h-4 w-4 text-indigo-600" />
      </div>
      <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  )
}

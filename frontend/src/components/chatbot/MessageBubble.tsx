// src/components/chatbot/MessageBubble.tsx
import { Bot, User } from 'lucide-react'
import { format } from 'date-fns'
import { Message } from '../../types'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={`flex items-start space-x-3 ${
      message.sender === 'user' ? 'justify-end' : 'justify-start'
    }`}>
      {message.sender === 'bot' && (
        <div className="bg-indigo-100 rounded-full p-2 flex-shrink-0">
          <Bot className="h-4 w-4 text-indigo-600" />
        </div>
      )}
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        message.sender === 'user'
          ? 'bg-indigo-500 text-white rounded-br-none'
          : 'bg-gray-100 text-gray-800 rounded-bl-none'
      }`}>
        <div className="text-sm whitespace-pre-line">
          {message.text.split('\n').map((line, index) => {
            // Handle bold text with **text**
            const parts = line.split(/\*\*(.*?)\*\*/)
            return (
              <div key={index} className={index > 0 ? 'mt-1' : ''}>
                {parts.map((part, partIndex) => {
                  // Odd indices are the bold parts
                  if (partIndex % 2 === 1) {
                    return <strong key={partIndex}>{part}</strong>
                  }
                  return <span key={partIndex}>{part}</span>
                })}
              </div>
            )
          })}
        </div>
        <p className="text-xs mt-2 opacity-70">
          {format(message.timestamp, 'HH:mm')}
        </p>
      </div>
      {message.sender === 'user' && (
        <div className="bg-indigo-100 rounded-full p-2 flex-shrink-0">
          <User className="h-4 w-4 text-indigo-600" />
        </div>
      )}
    </div>
  )
}

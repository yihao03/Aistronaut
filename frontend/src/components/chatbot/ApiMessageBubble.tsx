// src/components/chatbot/ApiMessageBubble.tsx

import { User, Bot, AlertTriangle, RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { ApiMessage } from '../../hooks/useApiChat';

interface ApiMessageBubbleProps {
  message: ApiMessage;
  onRetry?: () => void;
}

export default function ApiMessageBubble({ message, onRetry }: ApiMessageBubbleProps) {
  const isUser = message.sender === 'user';
  const isError = message.isError;

  const formatMessage = (text: string) => {
    // Convert markdown-like formatting to JSX
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|💡|\🌟|\🎯|\📅|\💰|\✨|\🗺️|\🏖️|\🏔️|\🏛️|\🌆|\❌)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
        return <em key={index} className="italic">{part.slice(1, -1)}</em>;
      }
      if (/^[\🌟🎯📅💰✨🗺️🏖️🏔️🏛️🌆❌💡]$/.test(part)) {
        return <span key={index} className="text-lg mr-1">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Bot Avatar */}
      {!isUser && (
        <div className={`flex-shrink-0 ${isError ? 'bg-red-100' : 'bg-indigo-100'} rounded-full p-2`}>
          {isError ? (
            <AlertTriangle className="h-5 w-5 text-red-600" />
          ) : (
            <Bot className="h-5 w-5 text-indigo-600" />
          )}
        </div>
      )}

      {/* Message Content */}
      <div className={`max-w-[70%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-indigo-600 text-white rounded-br-md'
              : isError
              ? 'bg-red-50 border border-red-200 text-red-800 rounded-bl-md'
              : 'bg-gray-100 text-gray-800 rounded-bl-md'
          }`}
        >
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {formatMessage(message.text)}
          </div>
          
          {/* Metadata for bot messages */}
          {!isUser && message.metadata && !isError && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Confidence: {Math.round((message.metadata.confidence || 0) * 100)}%</span>
                </div>
                {message.metadata.intent && (
                  <span className="bg-gray-200 px-2 py-1 rounded-full">
                    {message.metadata.intent.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Retry button for error messages */}
        {isError && onRetry && (
          <div className="mt-2">
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </div>
        )}

        {/* Timestamp */}
        <div className={`mt-1 text-xs text-gray-500 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 bg-gray-200 rounded-full p-2">
          <User className="h-5 w-5 text-gray-600" />
        </div>
      )}
    </div>
  );
}
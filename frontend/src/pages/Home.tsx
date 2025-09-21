// src/pages/Home.tsx
import { useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import Hero from '../components/common/Hero'
import ChatBot from '../components/chatbot/ChatBot'
import ApiChatBot from '../components/chatbot/ApiChatBot'

export default function Home() {
  const [chatMode, setChatMode] = useState<'original' | 'api'>('api')

  return (
    <MainLayout>
      <Hero />
      
      {/* Chat Mode Toggle */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Choose Your Chat Experience</h3>
              <p className="text-sm text-gray-600 mt-1">
                Switch between our original demo chat and the new API-powered intelligent assistant
              </p>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setChatMode('original')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  chatMode === 'original'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Original Demo
              </button>
              <button
                onClick={() => setChatMode('api')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  chatMode === 'api'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                API Powered ✨
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="max-w-4xl mx-auto px-4">
        {chatMode === 'original' ? <ChatBot /> : <ApiChatBot />}
      </div>
    </MainLayout>
  )
}

// src/pages/Home.tsx
import { useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import Hero from '../components/common/Hero'
import ChatBot from '../components/chatbot/ChatBot'

export default function Home() {

  return (
    <MainLayout>
      <Hero />
      <ChatBot />
    </MainLayout>
  )
}

// src/layouts/MainLayout.tsx
import { ReactNode } from 'react'
import Header from '../components/common/Header'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <Header />
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  )
}

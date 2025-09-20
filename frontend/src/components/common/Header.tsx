// src/components/common/Header.tsx
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="p-4 border-b bg-white/50 rounded-lg mb-6">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="font-bold text-xl">
          <Link to="/">Aistronaut</Link>
        </div>
        <div className="space-x-4">
          <Link to="/signin" className="hover:text-indigo-600">Sign In</Link>
          <Link to="/register" className="hover:text-indigo-600">Register</Link>
        </div>
      </nav>
    </header>
  )
}

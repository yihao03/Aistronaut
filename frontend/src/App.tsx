import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Home from './pages/Home'
import Register from './pages/Register'
import SignIn from './pages/SignIn'
import TripDetails from './pages/TripDetails'
import MyTrips from './pages/MyTrips'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/trip/:bookingId" element={<TripDetails />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

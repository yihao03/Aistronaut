// src/pages/MyTrips.tsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Plane, 
  Building, 
  CheckCircle, 
  Clock,
  Eye
} from 'lucide-react';
import { Button } from '../components/ui/button';

// Mock data - in real app, this would come from API/user state
const mockTrips = [
  {
    id: 'booking_bali_001',
    packageTitle: 'Tropical Paradise Escape - Bali, Indonesia',
    destination: 'Bali, Indonesia',
    totalPrice: '$1,299',
    status: 'confirmed',
    checkIn: '2024-02-16',
    checkOut: '2024-02-22',
    guests: 2,
    nights: 6,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=250&fit=crop',
    nextActivity: 'Flight departure in 25 days',
    hotel: 'Seminyak Beach Resort & Spa',
    airline: 'Emirates'
  },
  {
    id: 'booking_kyoto_002',
    packageTitle: 'Cultural Heritage Journey - Kyoto, Japan',
    destination: 'Kyoto, Japan',
    totalPrice: '$1,599',
    status: 'upcoming',
    checkIn: '2024-03-20',
    checkOut: '2024-03-25',
    guests: 2,
    nights: 5,
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=250&fit=crop',
    nextActivity: 'Flight departure in 58 days',
    hotel: 'Traditional Kyoto Ryokan',
    airline: 'ANA'
  },
  {
    id: 'booking_paris_003',
    packageTitle: 'European Romance - Paris, France',
    destination: 'Paris, France',
    totalPrice: '$1,450',
    status: 'completed',
    checkIn: '2024-01-10',
    checkOut: '2024-01-15',
    guests: 2,
    nights: 5,
    image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=250&fit=crop',
    nextActivity: 'Trip completed successfully',
    hotel: 'Hotel des Arts Montmartre',
    airline: 'Air France'
  }
];

export default function MyTrips() {
  const [trips] = useState(mockTrips);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  const filteredTrips = trips.filter(trip => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return trip.status === 'confirmed' || trip.status === 'upcoming';
    if (filter === 'completed') return trip.status === 'completed';
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            Upcoming
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Trips</h1>
          <p className="text-gray-600">Manage and view all your travel bookings</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'all', label: 'All Trips', count: trips.length },
                { id: 'upcoming', label: 'Upcoming', count: trips.filter(t => t.status === 'confirmed' || t.status === 'upcoming').length },
                { id: 'completed', label: 'Completed', count: trips.filter(t => t.status === 'completed').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Trip Image */}
              <div className="relative h-48 bg-gray-200">
                <img 
                  src={trip.image} 
                  alt={trip.destination}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  {getStatusBadge(trip.status)}
                </div>
              </div>

              {/* Trip Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {trip.packageTitle}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {trip.destination}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(trip.checkIn)} - {formatDate(trip.checkOut)}
                  </div>
                </div>

                {/* Trip Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      {trip.guests} travelers
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {trip.totalPrice}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Plane className="h-4 w-4 mr-1" />
                    {trip.airline}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="h-4 w-4 mr-1" />
                    {trip.hotel}
                  </div>
                </div>

                {/* Next Activity */}
                <div className="bg-indigo-50 rounded-lg p-3 mb-4">
                  <div className="text-sm text-indigo-800 font-medium">
                    {trip.nextActivity}
                  </div>
                </div>

                {/* Action Button */}
                <Link to={`/trip/${trip.id}`}>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTrips.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plane className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all' 
                ? "You haven't booked any trips yet." 
                : `No ${filter} trips found.`
              }
            </p>
            <Link to="/">
              <Button>Start Planning Your Trip</Button>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
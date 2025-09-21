// src/pages/TripDetails.tsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Plane, 
  Building, 
  Users, 
  Star, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Phone,
  Mail,
  Download,
  Share2,
  Edit,
  AlertTriangle,
  CreditCard,
  Briefcase
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { BookingDetails } from '../services/chatApi';

// Mock data - in real app, this would come from API/state management
const mockTripDetails: BookingDetails = {
  id: 'booking_bali_001',
  packageId: 'pkg_bali_001',
  packageTitle: 'Tropical Paradise Escape - Bali, Indonesia',
  totalPrice: '$1,299',
  currency: 'USD',
  validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  outboundFlight: {
    id: 'flight_out_001',
    airline: 'Emirates',
    flightNumber: 'EK 368',
    departure: {
      airport: 'JFK',
      city: 'New York',
      time: '11:30 PM',
      date: '2024-02-15'
    },
    arrival: {
      airport: 'DPS',
      city: 'Denpasar, Bali',
      time: '11:45 PM (+1)',
      date: '2024-02-16'
    },
    duration: '18h 15m (1 stop)',
    class: 'Economy',
    price: '$680',
    baggage: '2 x 23kg checked, 7kg carry-on'
  },
  returnFlight: {
    id: 'flight_ret_001',
    airline: 'Emirates',
    flightNumber: 'EK 369',
    departure: {
      airport: 'DPS',
      city: 'Denpasar, Bali',
      time: '12:40 AM',
      date: '2024-02-22'
    },
    arrival: {
      airport: 'JFK',
      city: 'New York',
      time: '6:55 AM',
      date: '2024-02-22'
    },
    duration: '17h 15m (1 stop)',
    class: 'Economy',
    price: '$680',
    baggage: '2 x 23kg checked, 7kg carry-on'
  },
  accommodation: {
    id: 'hotel_bali_001',
    name: 'Seminyak Beach Resort & Spa',
    type: 'Resort',
    rating: 4.5,
    address: 'Jl. Laksmana, Seminyak, Kuta, Badung Regency, Bali 80361, Indonesia',
    checkIn: '2024-02-16',
    checkOut: '2024-02-22',
    roomType: 'Deluxe Ocean View Room',
    guests: 2,
    nights: 6,
    pricePerNight: '$85',
    totalPrice: '$510',
    amenities: [
      'Free WiFi',
      'Swimming Pool',
      'Spa Services',
      'Beach Access',
      'Restaurant & Bar',
      'Fitness Center',
      'Room Service',
      'Airport Shuttle'
    ]
  },
  inclusions: [
    'Round-trip flights (Economy class)',
    '6 nights accommodation with breakfast',
    'Airport transfers',
    'Temple tour with guide',
    'Balinese cooking class',
    '90-minute spa treatment',
    'Travel insurance',
    '24/7 customer support'
  ],
  terms: [
    'Valid passport required (6+ months)',
    'Visa on arrival available for most countries',
    'Full payment required within 24 hours',
    'Cancellation: 50% refund if cancelled 7+ days before travel',
    'Travel insurance included, additional coverage available',
    'Prices subject to availability and currency fluctuations'
  ]
};

const detailedItinerary = [
  {
    day: 1,
    date: '2024-02-16',
    title: 'Arrival Day',
    activities: [
      { time: '11:45 PM', description: 'Arrive at Ngurah Rai International Airport (DPS)', location: 'Denpasar' },
      { time: '12:30 AM', description: 'Airport transfer to hotel', location: 'In Transit' },
      { time: '1:30 AM', description: 'Check-in at Seminyak Beach Resort & Spa', location: 'Seminyak' }
    ]
  },
  {
    day: 2,
    date: '2024-02-17',
    title: 'Seminyak Beach & Welcome',
    activities: [
      { time: '8:00 AM', description: 'Welcome breakfast at hotel', location: 'Hotel Restaurant' },
      { time: '10:00 AM', description: 'Beach relaxation and swimming', location: 'Seminyak Beach' },
      { time: '1:00 PM', description: 'Lunch at beachfront restaurant', location: 'Seminyak' },
      { time: '4:00 PM', description: 'Hotel spa treatment (90 minutes)', location: 'Hotel Spa' },
      { time: '7:00 PM', description: 'Sunset dinner at Potato Head Beach Club', location: 'Seminyak' }
    ]
  },
  {
    day: 3,
    date: '2024-02-18',
    title: 'Ubud Cultural Experience',
    activities: [
      { time: '7:00 AM', description: 'Early breakfast and checkout for day trip', location: 'Hotel' },
      { time: '8:00 AM', description: 'Drive to Ubud (1.5 hours)', location: 'In Transit' },
      { time: '10:00 AM', description: 'Visit Sacred Monkey Forest Sanctuary', location: 'Ubud' },
      { time: '12:00 PM', description: 'Traditional Balinese lunch', location: 'Ubud Village' },
      { time: '2:00 PM', description: 'Tegallalang Rice Terraces tour', location: 'Tegallalang' },
      { time: '4:00 PM', description: 'Visit local art market', location: 'Ubud Market' },
      { time: '6:00 PM', description: 'Return to Seminyak', location: 'In Transit' }
    ]
  },
  {
    day: 4,
    date: '2024-02-19',
    title: 'Temple Tours & Culture',
    activities: [
      { time: '8:00 AM', description: 'Breakfast at hotel', location: 'Hotel' },
      { time: '9:00 AM', description: 'Visit Tanah Lot Temple', location: 'Tanah Lot' },
      { time: '11:30 AM', description: 'Explore temple grounds and take photos', location: 'Tanah Lot' },
      { time: '1:00 PM', description: 'Traditional Indonesian lunch', location: 'Local Restaurant' },
      { time: '3:00 PM', description: 'Visit Uluwatu Temple', location: 'Uluwatu' },
      { time: '6:00 PM', description: 'Kecak Fire Dance performance', location: 'Uluwatu' },
      { time: '8:00 PM', description: 'Seafood dinner with ocean view', location: 'Jimbaran Beach' }
    ]
  },
  {
    day: 5,
    date: '2024-02-20',
    title: 'Cooking Class & Relaxation',
    activities: [
      { time: '8:00 AM', description: 'Breakfast at hotel', location: 'Hotel' },
      { time: '9:30 AM', description: 'Balinese cooking class (4 hours)', location: 'Cooking School' },
      { time: '9:45 AM', description: 'Visit traditional market with chef', location: 'Local Market' },
      { time: '11:00 AM', description: 'Hands-on cooking experience', location: 'Cooking School' },
      { time: '1:30 PM', description: 'Enjoy the meal you prepared', location: 'Cooking School' },
      { time: '3:00 PM', description: 'Return to hotel for relaxation', location: 'Hotel' },
      { time: '5:00 PM', description: 'Free time at hotel pool and beach', location: 'Hotel' },
      { time: '7:30 PM', description: 'Farewell dinner with traditional dance', location: 'Cultural Restaurant' }
    ]
  },
  {
    day: 6,
    date: '2024-02-21',
    title: 'Last Day & Shopping',
    activities: [
      { time: '8:00 AM', description: 'Final breakfast at hotel', location: 'Hotel' },
      { time: '10:00 AM', description: 'Last-minute shopping in Seminyak', location: 'Seminyak Village' },
      { time: '12:00 PM', description: 'Lunch at favorite local spot', location: 'Seminyak' },
      { time: '2:00 PM', description: 'Final beach time and relaxation', location: 'Seminyak Beach' },
      { time: '4:00 PM', description: 'Pack and prepare for departure', location: 'Hotel' },
      { time: '6:00 PM', description: 'Check-out and dinner', location: 'Hotel' },
      { time: '8:00 PM', description: 'Last evening in Bali - sunset viewing', location: 'Beach' }
    ]
  },
  {
    day: 7,
    date: '2024-02-22',
    title: 'Departure Day',
    activities: [
      { time: '10:00 PM', description: 'Airport transfer (3 hours before flight)', location: 'In Transit' },
      { time: '11:00 PM', description: 'Check-in for return flight', location: 'DPS Airport' },
      { time: '12:40 AM', description: 'Departure to New York', location: 'DPS Airport' }
    ]
  }
];

export default function TripDetails() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'documents'>('overview');
  const [tripDetails] = useState<BookingDetails>(mockTripDetails);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getDayOfWeek = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { weekday: 'short' });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tripDetails.packageTitle,
        text: `Check out my upcoming trip: ${tripDetails.packageTitle}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Trip link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    alert('Trip itinerary PDF download would start here');
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {tripDetails.packageTitle}
              </h1>
              <div className="flex items-center text-gray-600 space-x-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(tripDetails.accommodation.checkIn)} - {formatDate(tripDetails.accommodation.checkOut)}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{tripDetails.accommodation.guests} travelers</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span className="font-semibold text-green-600">{tripDetails.totalPrice}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleShare} variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Modify
              </Button>
            </div>
          </div>
        </div>

        {/* Status Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-green-800">Trip Confirmed</p>
              <p className="text-sm text-green-600">
                Booking ID: {tripDetails.id} • All documents have been sent to your email
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: MapPin },
              { id: 'itinerary', label: 'Detailed Itinerary', icon: Calendar },
              { id: 'documents', label: 'Travel Documents', icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Flight Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Plane className="h-5 w-5 mr-2 text-blue-600" />
                  Flight Information
                </h3>
                
                {/* Outbound Flight */}
                <div className="mb-6 bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3">✈️ Outbound Flight</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Departure</div>
                      <div className="font-semibold">{tripDetails.outboundFlight.departure.city}</div>
                      <div className="text-sm text-gray-600">{tripDetails.outboundFlight.departure.airport}</div>
                      <div className="text-sm font-medium">{formatDate(tripDetails.outboundFlight.departure.date)}</div>
                      <div className="text-sm font-medium text-blue-600">{tripDetails.outboundFlight.departure.time}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-600">{tripDetails.outboundFlight.airline}</div>
                      <div className="font-semibold text-blue-600">{tripDetails.outboundFlight.flightNumber}</div>
                      <div className="text-sm text-gray-600">{tripDetails.outboundFlight.duration}</div>
                      <div className="text-sm text-gray-600">{tripDetails.outboundFlight.class}</div>
                    </div>
                    
                    <div className="text-right md:text-left">
                      <div className="text-sm text-gray-600">Arrival</div>
                      <div className="font-semibold">{tripDetails.outboundFlight.arrival.city}</div>
                      <div className="text-sm text-gray-600">{tripDetails.outboundFlight.arrival.airport}</div>
                      <div className="text-sm font-medium">{formatDate(tripDetails.outboundFlight.arrival.date)}</div>
                      <div className="text-sm font-medium text-blue-600">{tripDetails.outboundFlight.arrival.time}</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-blue-200 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {tripDetails.outboundFlight.baggage}
                    </div>
                  </div>
                </div>

                {/* Return Flight */}
                {tripDetails.returnFlight && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-3">🔄 Return Flight</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Departure</div>
                        <div className="font-semibold">{tripDetails.returnFlight.departure.city}</div>
                        <div className="text-sm text-gray-600">{tripDetails.returnFlight.departure.airport}</div>
                        <div className="text-sm font-medium">{formatDate(tripDetails.returnFlight.departure.date)}</div>
                        <div className="text-sm font-medium text-green-600">{tripDetails.returnFlight.departure.time}</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-600">{tripDetails.returnFlight.airline}</div>
                        <div className="font-semibold text-green-600">{tripDetails.returnFlight.flightNumber}</div>
                        <div className="text-sm text-gray-600">{tripDetails.returnFlight.duration}</div>
                        <div className="text-sm text-gray-600">{tripDetails.returnFlight.class}</div>
                      </div>
                      
                      <div className="text-right md:text-left">
                        <div className="text-sm text-gray-600">Arrival</div>
                        <div className="font-semibold">{tripDetails.returnFlight.arrival.city}</div>
                        <div className="text-sm text-gray-600">{tripDetails.returnFlight.arrival.airport}</div>
                        <div className="text-sm font-medium">{formatDate(tripDetails.returnFlight.arrival.date)}</div>
                        <div className="text-sm font-medium text-green-600">{tripDetails.returnFlight.arrival.time}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Accommodation */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2 text-purple-600" />
                  Accommodation
                </h3>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-purple-900 text-lg">{tripDetails.accommodation.name}</h4>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center mr-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(tripDetails.accommodation.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-sm text-gray-600">
                            {tripDetails.accommodation.rating}
                          </span>
                        </div>
                        <span className="text-sm bg-purple-200 text-purple-800 px-2 py-1 rounded">
                          {tripDetails.accommodation.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {tripDetails.accommodation.address}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        Check-in: {formatDate(tripDetails.accommodation.checkIn)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        Check-out: {formatDate(tripDetails.accommodation.checkOut)}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Users className="h-4 w-4 mr-1" />
                        {tripDetails.accommodation.guests} guests • {tripDetails.accommodation.nights} nights
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        Room: {tripDetails.accommodation.roomType}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total: {tripDetails.accommodation.totalPrice} ({tripDetails.accommodation.pricePerNight}/night)
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-purple-900 mb-2">Amenities</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {tripDetails.accommodation.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Summary & Actions */}
            <div className="space-y-6">
              {/* Price Summary */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Price Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Flights (Round-trip)</span>
                    <span>$1,360</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accommodation (6 nights)</span>
                    <span>{tripDetails.accommodation.totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Activities & Tours</span>
                    <span>$240</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Travel Insurance</span>
                    <span>$89</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-green-600">{tripDetails.totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Contact & Support */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-indigo-600" />
                    <div>
                      <div className="font-medium">24/7 Support</div>
                      <div className="text-sm text-gray-600">+1 (555) 123-4567</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-indigo-600" />
                    <div>
                      <div className="font-medium">Email Support</div>
                      <div className="text-sm text-gray-600">support@aistronaut.com</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* What's Included */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">What's Included</h3>
                <div className="space-y-2">
                  {tripDetails.inclusions.map((inclusion, index) => (
                    <div key={index} className="flex items-start text-sm">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                      {inclusion}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Itinerary Tab */}
        {activeTab === 'itinerary' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">7-Day Bali Adventure</h2>
              <p className="text-gray-600">Complete day-by-day itinerary with timings and locations</p>
            </div>

            {detailedItinerary.map((day, index) => (
              <div key={day.day} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">Day {day.day}: {day.title}</h3>
                      <p className="text-indigo-100">{formatDate(day.date)} • {getDayOfWeek(day.date)}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{day.day}</div>
                      <div className="text-sm text-indigo-100">of 7</div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {day.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="flex items-start">
                        <div className="flex-shrink-0 w-16">
                          <div className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded text-sm font-medium">
                            {activity.time}
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="font-medium text-gray-900">{activity.description}</div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {activity.location}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Travel Documents Tab */}
        {activeTab === 'documents' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Flight Tickets</h3>
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="font-medium">Outbound Flight - EK 368</div>
                    <div className="text-sm text-gray-600">E-ticket sent to your email</div>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="font-medium">Return Flight - EK 369</div>
                    <div className="text-sm text-gray-600">E-ticket sent to your email</div>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Hotel Vouchers</h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="font-medium">{tripDetails.accommodation.name}</div>
                  <div className="text-sm text-gray-600">Confirmation sent to your email</div>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Download className="h-4 w-4 mr-2" />
                    Download Voucher
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Travel Requirements</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium">Passport Valid</div>
                      <div className="text-sm text-gray-600">Valid for 6+ months from travel date</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium">Visa on Arrival</div>
                      <div className="text-sm text-gray-600">Available for most countries at DPS airport</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium">Travel Insurance</div>
                      <div className="text-sm text-gray-600">Comprehensive coverage included</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Important Reminders</h4>
                    <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                      <li>• Check-in online 24 hours before departure</li>
                      <li>• Arrive at airport 3 hours before international flights</li>
                      <li>• Carry printed copies of all documents</li>
                      <li>• Keep emergency contacts handy</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
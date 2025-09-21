// src/components/chatbot/BookingDetails.tsx

import { 
  Plane, 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  CheckCircle, 
  XCircle,
  CreditCard,
  AlertTriangle,
  Briefcase,
  Bed
} from 'lucide-react';
import { Button } from '../ui/button';
import { BookingDetails as BookingDetailsType } from '../../services/chatApi';

interface BookingDetailsProps {
  bookingDetails: BookingDetailsType;
  onConfirm: (bookingId: string) => void;
  onCancel: (bookingId: string) => void;
  isLoading?: boolean;
}

export default function BookingDetails({ 
  bookingDetails, 
  onConfirm, 
  onCancel, 
  isLoading = false 
}: BookingDetailsProps) {
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  const timeUntilExpiry = () => {
    const now = new Date().getTime();
    const expiry = new Date(bookingDetails.validUntil).getTime();
    const hoursLeft = Math.max(0, Math.ceil((expiry - now) / (1000 * 60 * 60)));
    return hoursLeft;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{bookingDetails.packageTitle}</h2>
            <p className="text-green-100 mt-1">Booking ID: {bookingDetails.id}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{bookingDetails.totalPrice}</div>
            <div className="text-green-100 text-sm">{bookingDetails.currency}</div>
          </div>
        </div>
        
        {/* Expiry Warning */}
        <div className="mt-4 bg-yellow-500 bg-opacity-20 border border-yellow-300 rounded-lg p-3">
          <div className="flex items-center text-yellow-100">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">
              ⏰ Price valid for {timeUntilExpiry()} more hours - Book now to secure this deal!
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Flight Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Plane className="h-5 w-5 mr-2 text-blue-600" />
            Flight Information
          </h3>
          
          {/* Outbound Flight */}
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-blue-900 mb-3">✈️ Outbound Flight</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600">Departure</div>
                <div className="font-semibold">{bookingDetails.outboundFlight.departure.city}</div>
                <div className="text-sm text-gray-600">{bookingDetails.outboundFlight.departure.airport}</div>
                <div className="text-sm font-medium">{formatDate(bookingDetails.outboundFlight.departure.date)}</div>
                <div className="text-sm font-medium text-blue-600">{bookingDetails.outboundFlight.departure.time}</div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-600">{bookingDetails.outboundFlight.airline}</div>
                <div className="font-semibold text-blue-600">{bookingDetails.outboundFlight.flightNumber}</div>
                <div className="text-sm text-gray-600">{bookingDetails.outboundFlight.duration}</div>
                <div className="text-sm text-gray-600">{bookingDetails.outboundFlight.class}</div>
              </div>
              
              <div className="text-right md:text-left">
                <div className="text-sm text-gray-600">Arrival</div>
                <div className="font-semibold">{bookingDetails.outboundFlight.arrival.city}</div>
                <div className="text-sm text-gray-600">{bookingDetails.outboundFlight.arrival.airport}</div>
                <div className="text-sm font-medium">{formatDate(bookingDetails.outboundFlight.arrival.date)}</div>
                <div className="text-sm font-medium text-blue-600">{bookingDetails.outboundFlight.arrival.time}</div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200 flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase className="h-4 w-4 mr-1" />
                {bookingDetails.outboundFlight.baggage}
              </div>
              <div className="font-semibold text-green-600">{bookingDetails.outboundFlight.price}</div>
            </div>
          </div>

          {/* Return Flight */}
          {bookingDetails.returnFlight && (
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-3">🔄 Return Flight</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Departure</div>
                  <div className="font-semibold">{bookingDetails.returnFlight.departure.city}</div>
                  <div className="text-sm text-gray-600">{bookingDetails.returnFlight.departure.airport}</div>
                  <div className="text-sm font-medium">{formatDate(bookingDetails.returnFlight.departure.date)}</div>
                  <div className="text-sm font-medium text-green-600">{bookingDetails.returnFlight.departure.time}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-gray-600">{bookingDetails.returnFlight.airline}</div>
                  <div className="font-semibold text-green-600">{bookingDetails.returnFlight.flightNumber}</div>
                  <div className="text-sm text-gray-600">{bookingDetails.returnFlight.duration}</div>
                  <div className="text-sm text-gray-600">{bookingDetails.returnFlight.class}</div>
                </div>
                
                <div className="text-right md:text-left">
                  <div className="text-sm text-gray-600">Arrival</div>
                  <div className="font-semibold">{bookingDetails.returnFlight.arrival.city}</div>
                  <div className="text-sm text-gray-600">{bookingDetails.returnFlight.arrival.airport}</div>
                  <div className="text-sm font-medium">{formatDate(bookingDetails.returnFlight.arrival.date)}</div>
                  <div className="text-sm font-medium text-green-600">{bookingDetails.returnFlight.arrival.time}</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-green-200 flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="h-4 w-4 mr-1" />
                  {bookingDetails.returnFlight.baggage}
                </div>
                <div className="font-semibold text-green-600">{bookingDetails.returnFlight.price}</div>
              </div>
            </div>
          )}
        </div>

        {/* Accommodation Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Bed className="h-5 w-5 mr-2 text-purple-600" />
            Accommodation
          </h3>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-purple-900 text-lg">{bookingDetails.accommodation.name}</h4>
                <div className="flex items-center mt-1">
                  <div className="flex items-center mr-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(bookingDetails.accommodation.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm text-gray-600">
                      {bookingDetails.accommodation.rating}
                    </span>
                  </div>
                  <span className="text-sm bg-purple-200 text-purple-800 px-2 py-1 rounded">
                    {bookingDetails.accommodation.type}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl text-purple-600">{bookingDetails.accommodation.totalPrice}</div>
                <div className="text-sm text-gray-600">{bookingDetails.accommodation.pricePerNight}/night</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {bookingDetails.accommodation.address}
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  Check-in: {formatDate(bookingDetails.accommodation.checkIn)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  Check-out: {formatDate(bookingDetails.accommodation.checkOut)}
                </div>
              </div>
              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Users className="h-4 w-4 mr-1" />
                  {bookingDetails.accommodation.guests} guests • {bookingDetails.accommodation.nights} nights
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  Room: {bookingDetails.accommodation.roomType}
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h5 className="font-semibold text-purple-900 mb-2">Amenities</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {bookingDetails.accommodation.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Inclusions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">✨ What's Included</h3>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {bookingDetails.inclusions.map((inclusion, index) => (
                <div key={index} className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                  {inclusion}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">📋 Terms & Conditions</h3>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="space-y-2">
              {bookingDetails.terms.map((term, index) => (
                <div key={index} className="flex items-start text-sm text-gray-700">
                  <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500 flex-shrink-0 mt-0.5" />
                  {term}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <Button
            onClick={() => onConfirm(bookingDetails.id)}
            disabled={isLoading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5 mr-2" />
                Confirm & Pay {bookingDetails.totalPrice}
              </>
            )}
          </Button>
          
          <Button
            onClick={() => onCancel(bookingDetails.id)}
            disabled={isLoading}
            variant="outline"
            className="flex-1 border-red-300 text-red-600 hover:bg-red-50 py-3 text-lg font-semibold"
          >
            <XCircle className="h-5 w-5 mr-2" />
            Cancel Booking
          </Button>
        </div>
      </div>
    </div>
  );
}
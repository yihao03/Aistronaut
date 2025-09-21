// src/components/chatbot/AccommodationOptionBoxes.tsx

import { Building, Star, MapPin, Users, Calendar, DollarSign, Wifi, Car, Coffee, Dumbbell } from 'lucide-react';
import { Button } from '../ui/button';
import { AccommodationOption } from '../../services/chatApi';

interface AccommodationOptionBoxesProps {
  accommodationOptions: AccommodationOption[];
  onSelectAccommodation: (accommodation: AccommodationOption) => void;
}

export default function AccommodationOptionBoxes({ 
  accommodationOptions, 
  onSelectAccommodation 
}: AccommodationOptionBoxesProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return <Wifi className="h-3 w-3" />;
    if (amenityLower.includes('parking')) return <Car className="h-3 w-3" />;
    if (amenityLower.includes('breakfast') || amenityLower.includes('restaurant')) return <Coffee className="h-3 w-3" />;
    if (amenityLower.includes('gym') || amenityLower.includes('fitness')) return <Dumbbell className="h-3 w-3" />;
    return <span className="w-3 h-3 text-xs">•</span>;
  };

  return (
    <div className="mt-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Building className="h-5 w-5 mr-2 text-purple-600" />
          Choose Your Accommodation
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Select from our carefully curated accommodation options for your trip
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accommodationOptions.map((accommodation) => (
          <div
            key={accommodation.id}
            className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-xl hover:shadow-xl transition-all duration-300 hover:border-purple-400 hover:scale-105 flex flex-col h-full"
          >
            {/* Content Area */}
            <div className="p-6 flex-1 flex flex-col">
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-800 mb-1">{accommodation.name}</h4>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center mr-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(accommodation.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-sm text-gray-600">
                          {accommodation.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    {accommodation.type}
                  </span>
                </div>
                
                <div className="flex items-center text-purple-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{accommodation.location}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                {accommodation.description}
              </p>

              {/* Booking Details */}
              <div className="mb-4 bg-gray-50 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Check-in: {formatDate(accommodation.checkIn)}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Check-out: {formatDate(accommodation.checkOut)}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {accommodation.guests} guests
                  </div>
                  <div className="flex items-center">
                    <Building className="h-3 w-3 mr-1" />
                    {accommodation.nights} nights
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-600">
                    Room: <span className="font-medium">{accommodation.roomType}</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-4">
                <h5 className="font-semibold text-sm text-gray-800 mb-2">🏨 Amenities</h5>
                <div className="grid grid-cols-2 gap-1">
                  {accommodation.amenities.slice(0, 6).map((amenity, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-600">
                      {getAmenityIcon(amenity)}
                      <span className="ml-1">{amenity}</span>
                    </div>
                  ))}
                  {accommodation.amenities.length > 6 && (
                    <div className="text-xs text-gray-500 italic col-span-2">
                      +{accommodation.amenities.length - 6} more amenities
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer with Price and Button */}
            <div className="p-6 pt-3 border-t border-purple-100 bg-purple-50 rounded-b-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs text-gray-500">Per night</div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-bold text-lg text-green-600">
                      ${accommodation.pricePerNight}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Total ({accommodation.nights} nights)</div>
                  <div className="font-bold text-xl text-green-600">
                    ${accommodation.totalPrice}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => onSelectAccommodation(accommodation)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
              >
                Select This Hotel
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
// src/components/chatbot/TripOptionBoxes.tsx

import { Plane, Clock, DollarSign, Calendar, ArrowRight, MapPin, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { TripOption } from '../../services/chatApi';

interface TripOptionBoxesProps {
  tripOptions: TripOption[];
  onSelectTrip: (trip: TripOption) => void;
}

export default function TripOptionBoxes({ tripOptions, onSelectTrip }: TripOptionBoxesProps) {
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

  const formatTime = (timeString: string) => {
    try {
      // Extract just the time part if it's in full datetime format
      const timePart = timeString.split('T')[1] || timeString;
      return timePart.substring(0, 5); // Format as HH:mm
    } catch {
      return timeString;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
      {tripOptions.map((trip) => (
        <div
          key={trip.id}
          className="bg-gradient-to-br from-slate-50 to-white border border-gray-200 rounded-xl hover:shadow-xl transition-all duration-300 hover:border-indigo-300 hover:scale-105 flex flex-col h-full"
        >
          {/* Content Area */}
          <div className="p-6 flex-1 flex flex-col">
            {/* Header */}
            <div className="mb-4">
              <h3 className="font-bold text-lg text-gray-800 mb-2">{trip.title}</h3>
              <div className="flex items-center text-indigo-600 mb-1">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="font-medium">{trip.destination}, {trip.country}</span>
              </div>
              <div className="flex items-center text-gray-600 mb-3">
                <Clock className="h-4 w-4 mr-2" />
                <span>{trip.duration}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-sm mb-4 leading-relaxed">
              {trip.description}
            </p>

            {/* Flight Information */}
            <div className="mb-4 bg-blue-50 rounded-lg p-3">
              <h4 className="font-semibold text-sm text-blue-800 mb-2 flex items-center">
                <Plane className="h-4 w-4 mr-1" />
                Flight Details ({trip.flightInfo.mode} mode)
              </h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div>✈️ {trip.flightInfo.airline}</div>
                <div>📅 Outbound: {formatDate(trip.flightInfo.outboundFlight.departureDate)} - {formatTime(trip.flightInfo.outboundFlight.departureTime)}</div>
                <div>🔄 Return: {formatDate(trip.flightInfo.returnFlight.departureDate)} - {formatTime(trip.flightInfo.returnFlight.departureTime)}</div>
                <div>🛑 {trip.flightInfo.outboundFlight.stops}</div>
              </div>
            </div>

            {/* Itinerary */}
            <div className="mb-4">
              <h4 className="font-semibold text-sm text-gray-800 mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                📅 Itinerary:
              </h4>
              <ul className="space-y-1">
                {trip.itinerary.slice(0, 4).map((item, index) => (
                  <li key={index} className="text-xs text-gray-600 flex items-start">
                    <span className="inline-block w-4 h-4 bg-indigo-100 text-indigo-600 rounded-full text-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
                {trip.itinerary.length > 4 && (
                  <li className="text-xs text-gray-500 italic ml-6">
                    +{trip.itinerary.length - 4} more activities...
                  </li>
                )}
              </ul>
            </div>

            {/* Features */}
            <div className="mb-4">
              <h4 className="font-semibold text-sm text-gray-800 mb-2">✨ Included:</h4>
              <div className="flex flex-wrap gap-1">
                {trip.features.map((feature, index) => (
                  <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer with Price and Button */}
          <div className="p-6 pt-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <div className="flex items-center mb-3">
              <DollarSign className="h-5 w-5 text-green-600 mr-1" />
              <span className="font-bold text-xl text-green-600">${trip.totalPrice}</span>
              <span className="text-xs text-gray-500 ml-1">per person</span>
            </div>
            <Button
              onClick={() => onSelectTrip(trip)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              Choose This Package
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
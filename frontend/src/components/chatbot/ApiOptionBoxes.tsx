// src/components/chatbot/ApiOptionBoxes.tsx

import { MapPin, Clock, DollarSign, Star, Plane, Building, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { TravelOption } from '../../services/chatApi';

interface ApiOptionBoxesProps {
  options: TravelOption[];
  onSelectOption: (option: TravelOption) => void;
}

export default function ApiOptionBoxes({ options, onSelectOption }: ApiOptionBoxesProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
      {options.map((option) => (
        <div
          key={option.id}
          className="bg-gradient-to-br from-slate-50 to-white border border-gray-200 rounded-xl hover:shadow-xl transition-all duration-300 hover:border-indigo-300 hover:scale-105 flex flex-col h-full"
        >
          {/* 👇 Scrollable Content Area — Grows to push footer down */}
          <div className="p-6 flex-1 flex flex-col">
            {/* Header */}
            <div className="mb-4">
              <h3 className="font-bold text-lg text-gray-800 mb-2">{option.title}</h3>
              <div className="flex items-center text-indigo-600 mb-1">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="font-medium">{option.destination}</span>
              </div>
              <div className="flex items-center text-gray-600 mb-3">
                <Clock className="h-4 w-4 mr-2" />
                <span>{option.duration}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-sm mb-4 leading-relaxed">
              {option.description}
            </p>

            {/* Flight Information */}
            {option.flightInfo && (
              <div className="mb-4 bg-blue-50 rounded-lg p-3">
                <h4 className="font-semibold text-sm text-blue-800 mb-2 flex items-center">
                  <Plane className="h-4 w-4 mr-1" />
                  Flight Details
                </h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>✈️ {option.flightInfo.airline}</div>
                  <div>⏱️ {option.flightInfo.duration}</div>
                  <div>🛑 {option.flightInfo.stops}</div>
                </div>
              </div>
            )}

            {/* Accommodation Information */}
            {option.accommodationInfo && (
              <div className="mb-4 bg-purple-50 rounded-lg p-3">
                <h4 className="font-semibold text-sm text-purple-800 mb-2 flex items-center">
                  <Building className="h-4 w-4 mr-1" />
                  Accommodation
                </h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="font-medium">{option.accommodationInfo.name}</div>
                  <div className="flex items-center">
                    <span className="mr-2">{option.accommodationInfo.type}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(option.accommodationInfo!.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-xs">{option.accommodationInfo.rating}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {option.accommodationInfo.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                        {amenity}
                      </span>
                    ))}
                    {option.accommodationInfo.amenities.length > 3 && (
                      <span className="text-xs text-gray-500">+{option.accommodationInfo.amenities.length - 3} more</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Itinerary */}
            <div className="mb-4">
              <h4 className="font-semibold text-sm text-gray-800 mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                📅 Itinerary:
              </h4>
              <ul className="space-y-1">
                {option.itinerary.slice(0, 4).map((item, index) => (
                  <li key={index} className="text-xs text-gray-600 flex items-start">
                    <span className="inline-block w-4 h-4 bg-indigo-100 text-indigo-600 rounded-full text-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
                {option.itinerary.length > 4 && (
                  <li className="text-xs text-gray-500 italic ml-6">
                    +{option.itinerary.length - 4} more activities...
                  </li>
                )}
              </ul>
            </div>

            {/* Features */}
            <div className="mb-4">
              <h4 className="font-semibold text-sm text-gray-800 mb-2">✨ Included:</h4>
              <div className="flex flex-wrap gap-1">
                {option.features.map((feature, index) => (
                  <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 pt-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <div className="flex items-center mb-3">
              <DollarSign className="h-5 w-5 text-green-600 mr-1" />
              <span className="font-bold text-xl text-green-600">{option.price}</span>
              <span className="text-xs text-gray-500 ml-1">per person</span>
            </div>
            <Button
              onClick={() => onSelectOption(option)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              Choose This
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
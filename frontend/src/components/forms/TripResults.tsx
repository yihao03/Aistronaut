// src/components/forms/TripResults.tsx
import { TripPlanResults } from '../../types'

interface TripResultsProps {
  results: TripPlanResults
}

export default function TripResults({ results }: TripResultsProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Your Trip Plan</h2>

      {/* Flights */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">✈️ Flights</h3>
        {results.flights.map((flight, i) => (
          <div key={i} className="border-b py-3 last:border-0">
            <div className="flex justify-between items-center">
              <span>{flight.airline} • {flight.duration}</span>
              <span className="font-bold">{flight.price}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Hotels */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">🏨 Accommodations</h3>
        {results.hotels.map((hotel, i) => (
          <div key={i} className="border-b py-3 last:border-0">
            <div className="flex justify-between items-center">
              <span>{hotel.name} ⭐ {hotel.rating}</span>
              <span className="font-bold">{hotel.price}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Activities */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">🎉 Recommended Activities</h3>
        <ul className="space-y-2">
          {results.activities.map((activity, i) => (
            <li key={i} className="flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
              {activity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// src/components/forms/TripPlannerForm.tsx
import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { TripPlanResults } from '../../types'

interface TripPlannerFormProps {
  onSearchResults: (results: TripPlanResults) => void
}

export default function TripPlannerForm({ onSearchResults }: TripPlannerFormProps) {
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!destination.trim()) return

    setIsLoading(true)

    try {
      const res = await fetch('/api/trip-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, date })
      })
      const data = await res.json()
      onSearchResults(data)
    } catch (error) {
      console.error('Error planning trip:', error)
      // Mock data for development
      const mockResults: TripPlanResults = {
        flights: [{ airline: 'Delta', price: '$245', duration: '5h 30m' }],
        hotels: [{ name: 'Hilton Garden Inn', price: '$120/night', rating: 4.5 }],
        activities: ['City Walking Tour', 'Museum Pass', 'Sunset Cruise']
      }
      onSearchResults(mockResults)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Destination */}
        <div className="space-y-2">
          <Label htmlFor="destination">Destination</Label>
          <Input
            id="destination"
            placeholder="e.g., Bali, Tokyo, Paris..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label>Travel Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="mt-6">
        <Button 
          onClick={handleSearch} 
          className="w-full"
          disabled={!destination.trim() || isLoading}
        >
          {isLoading ? '🔍 Searching...' : '🧳 Plan My Trip'}
        </Button>
      </div>
    </div>
  )
}

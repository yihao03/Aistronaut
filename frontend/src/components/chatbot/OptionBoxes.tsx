// src/components/chatbot/OptionBoxes.tsx
import { HolidayOption } from '../../types'

interface OptionBoxesProps {
  options: HolidayOption[]
  onSelectOption: (option: HolidayOption) => void
}

export default function OptionBoxes({ options, onSelectOption }: OptionBoxesProps) {
  return (
    <div className="ml-12 mt-4 space-y-3">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelectOption(option)}
          className="w-full text-left p-4 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200 rounded-lg transition-all duration-200 hover:shadow-md group"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-semibold text-indigo-900 group-hover:text-indigo-700 mb-1">
                ✈️ {option.title}
              </h4>
              <p className="text-sm text-indigo-700 font-medium mb-2">
                📍 {option.destination}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                <div>📅 {option.duration}</div>
                <div>🛫 {option.flight}</div>
                <div>🏨 {option.hotel}</div>
                <div>🎯 {option.activities}</div>
              </div>
            </div>
            <div className="ml-4 text-right">
              <div className="font-bold text-green-600 text-lg">
                💰 {option.budget}
              </div>
              <div className="text-xs text-indigo-500 mt-1">
                Click for details
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

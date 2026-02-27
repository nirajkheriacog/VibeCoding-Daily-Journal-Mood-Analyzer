import type { Mood } from '../types'
import { MOODS, MOOD_LIST } from '../constants'

interface MoodPickerProps {
  value: Mood | null
  onChange: (mood: Mood) => void
}

export default function MoodPicker({ value, onChange }: MoodPickerProps) {
  return (
    <div role="radiogroup" aria-label="Select your mood" className="grid grid-cols-3 sm:flex sm:flex-row gap-2">
      {MOOD_LIST.map((mood) => {
        const config = MOODS[mood]
        const selected = value === mood
        return (
          <button
            key={mood}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={config.label}
            onClick={() => onChange(mood)}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-3 text-sm font-medium transition-all cursor-pointer
              ${selected ? 'ring-2 ring-offset-2 scale-105 bg-white shadow-md' : 'bg-gray-50 hover:bg-gray-100'}
            `}
            style={selected ? { borderColor: config.color, boxShadow: `0 0 0 2px ${config.color}` } : undefined}
          >
            <span className="text-2xl" aria-hidden="true">{config.emoji}</span>
            <span>{config.label}</span>
          </button>
        )
      })}
    </div>
  )
}

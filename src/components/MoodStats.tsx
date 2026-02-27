import type { Mood } from '../types'
import { MOODS } from '../constants'

interface MoodStatsProps {
  totalEntries: number
  currentStreak: number
  mostCommonMood: Mood | null
}

export default function MoodStats({ totalEntries, currentStreak, mostCommonMood }: MoodStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
        <p className="text-3xl font-bold text-indigo-600">{totalEntries}</p>
        <p className="text-sm text-gray-500 mt-1">Total Entries</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
        <p className="text-3xl font-bold text-orange-500">{currentStreak}</p>
        <p className="text-sm text-gray-500 mt-1">Day Streak</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
        {mostCommonMood ? (
          <>
            <p className="text-3xl font-bold">
              <span aria-hidden="true">{MOODS[mostCommonMood].emoji}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">Most Common: {MOODS[mostCommonMood].label}</p>
          </>
        ) : (
          <>
            <p className="text-3xl font-bold text-gray-300">—</p>
            <p className="text-sm text-gray-500 mt-1">Most Common Mood</p>
          </>
        )}
      </div>
    </div>
  )
}

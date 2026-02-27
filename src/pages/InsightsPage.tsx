import { Link, useOutletContext } from 'react-router'
import type { EntriesContextType } from '../types'
import { useMoodData } from '../hooks/useMoodData'
import MoodChart from '../components/MoodChart'
import MoodStats from '../components/MoodStats'

export default function InsightsPage() {
  const { entries } = useOutletContext<EntriesContextType>()
  const { chartData, totalEntries, currentStreak, mostCommonMood } = useMoodData(entries)

  if (entries.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg mb-4">No data to show yet.</p>
        <p className="text-gray-400 text-sm mb-6">Start journaling to see your mood insights!</p>
        <Link
          to="/"
          className="inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-white font-medium hover:bg-indigo-700 transition"
        >
          Write Your First Entry
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Mood Insights</h2>

      <MoodStats
        totalEntries={totalEntries}
        currentStreak={currentStreak}
        mostCommonMood={mostCommonMood}
      />

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood Over Time</h3>
        <MoodChart data={chartData} />
      </div>
    </div>
  )
}

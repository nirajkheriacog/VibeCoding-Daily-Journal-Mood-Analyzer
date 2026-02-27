import { Link, useNavigate, useOutletContext } from 'react-router'
import type { EntriesContextType } from '../types'
import { getLocalDateString, MOODS } from '../constants'
import EntryForm from '../components/EntryForm'

export default function TodayPage() {
  const { addEntry, getEntryByDate } = useOutletContext<EntriesContextType>()
  const navigate = useNavigate()
  const today = getLocalDateString()
  const existingEntry = getEntryByDate(today)

  if (existingEntry) {
    const moodConfig = MOODS[existingEntry.mood]
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-4" aria-hidden="true">{moodConfig.emoji}</p>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">You already journaled today!</h2>
        <p className="text-gray-500 mb-6">
          You're feeling <strong>{moodConfig.label}</strong> — "{existingEntry.title}"
        </p>
        <Link
          to={`/entries/${existingEntry.id}`}
          className="inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-white font-medium hover:bg-indigo-700 transition"
        >
          View or Edit Entry
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">How's your day going?</h2>
      <EntryForm
        onSubmit={(data) => {
          const entry = addEntry(data)
          navigate(`/entries/${entry.id}`)
        }}
      />
    </div>
  )
}

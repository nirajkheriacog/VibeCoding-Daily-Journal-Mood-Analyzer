import { Link } from 'react-router'
import type { JournalEntry } from '../types'
import { MOODS } from '../constants'

interface EntryCardProps {
  entry: JournalEntry
}

export default function EntryCard({ entry }: EntryCardProps) {
  const moodConfig = MOODS[entry.mood]
  const displayDate = new Date(entry.date + 'T00:00:00').toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <li>
      <Link
        to={`/entries/${entry.id}`}
        className="block rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors border-l-4"
        style={{ borderLeftColor: moodConfig.color }}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-500">{displayDate}</span>
          <span className="flex items-center gap-1 text-sm" aria-label={`Mood: ${moodConfig.label}`}>
            <span aria-hidden="true">{moodConfig.emoji}</span>
            <span className="text-gray-600">{moodConfig.label}</span>
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">{entry.title}</h3>
        {entry.body && (
          <p className="text-gray-500 text-sm line-clamp-2">{entry.body}</p>
        )}
      </Link>
    </li>
  )
}

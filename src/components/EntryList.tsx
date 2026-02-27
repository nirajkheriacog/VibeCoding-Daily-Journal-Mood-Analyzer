import { Link } from 'react-router'
import type { JournalEntry } from '../types'
import EntryCard from './EntryCard'

interface EntryListProps {
  entries: JournalEntry[]
}

export default function EntryList({ entries }: EntryListProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg mb-4">No journal entries yet.</p>
        <Link
          to="/"
          className="inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-white font-medium hover:bg-indigo-700 transition"
        >
          Start Writing Today
        </Link>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </ul>
  )
}

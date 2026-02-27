import { useState } from 'react'
import { useParams, useNavigate, Link, useOutletContext } from 'react-router'
import type { EntriesContextType } from '../types'
import { MOODS } from '../constants'
import EntryForm from '../components/EntryForm'
import ConfirmDialog from '../components/ConfirmDialog'

export default function EntryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getEntryById, updateEntry, deleteEntry } = useOutletContext<EntriesContextType>()
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const entry = getEntryById(id!)
  if (!entry) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Entry not found</h2>
        <p className="text-gray-500 mb-6">This journal entry doesn't exist or was deleted.</p>
        <Link
          to="/entries"
          className="inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-white font-medium hover:bg-indigo-700 transition"
        >
          Back to History
        </Link>
      </div>
    )
  }

  const moodConfig = MOODS[entry.mood]
  const displayDate = new Date(entry.date + 'T00:00:00').toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  if (isEditing) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Entry</h2>
        <EntryForm
          initialData={entry}
          onSubmit={(data) => {
            updateEntry(entry.id, data)
            setIsEditing(false)
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    )
  }

  return (
    <div>
      <Link to="/entries" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-4 inline-block">
        &larr; Back to History
      </Link>

      <article className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <time className="text-sm text-gray-500">{displayDate}</time>
          <span
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
            style={{ backgroundColor: moodConfig.color + '20', color: moodConfig.color }}
          >
            <span aria-hidden="true">{moodConfig.emoji}</span>
            {moodConfig.label}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">{entry.title}</h2>

        {entry.body && (
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{entry.body}</p>
        )}

        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-white font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300 focus:outline-none transition cursor-pointer"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteDialog(true)}
            className="rounded-lg border border-red-300 px-5 py-2 text-red-600 font-medium hover:bg-red-50 focus:ring-2 focus:ring-red-200 focus:outline-none transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      </article>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Entry"
        message="Are you sure you want to delete this journal entry? This action cannot be undone."
        onConfirm={() => {
          deleteEntry(entry.id)
          navigate('/entries')
        }}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  )
}

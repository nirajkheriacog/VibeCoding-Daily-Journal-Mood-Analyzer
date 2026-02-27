import { useState, type FormEvent } from 'react'
import type { Mood, JournalEntry } from '../types'
import MoodPicker from './MoodPicker'
import { getLocalDateString } from '../constants'

interface EntryFormProps {
  initialData?: JournalEntry
  onSubmit: (data: { date: string; mood: Mood; title: string; body: string }) => void
  onCancel?: () => void
}

export default function EntryForm({ initialData, onSubmit, onCancel }: EntryFormProps) {
  const [mood, setMood] = useState<Mood | null>(initialData?.mood ?? null)
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [body, setBody] = useState(initialData?.body ?? '')
  const [submitted, setSubmitted] = useState(false)

  const date = initialData?.date ?? getLocalDateString()
  const isValid = mood !== null && title.trim().length > 0

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    if (!isValid) return
    onSubmit({ date, mood: mood!, title: title.trim(), body: body.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
        <p className="text-lg font-semibold text-gray-900">
          {new Date(date + 'T00:00:00').toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">How are you feeling?</label>
        <MoodPicker value={mood} onChange={setMood} />
        {submitted && mood === null && (
          <p className="text-red-500 text-sm mt-1">Please select a mood</p>
        )}
      </div>

      <div>
        <label htmlFor="entry-title" className="block text-sm font-medium text-gray-600 mb-1">
          Title
        </label>
        <input
          id="entry-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your entry a title..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition"
        />
        {submitted && title.trim().length === 0 && (
          <p className="text-red-500 text-sm mt-1">Title is required</p>
        )}
      </div>

      <div>
        <label htmlFor="entry-body" className="block text-sm font-medium text-gray-600 mb-1">
          Journal Entry
        </label>
        <textarea
          id="entry-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write about your day..."
          rows={6}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition resize-y"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-white font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300 focus:outline-none transition cursor-pointer"
        >
          {initialData ? 'Update Entry' : 'Save Entry'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:outline-none transition cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

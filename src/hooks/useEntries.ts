import { useState, useCallback, useMemo } from 'react'
import type { JournalEntry, Mood } from '../types'
import { loadEntries, saveEntries } from '../utils/storage'

export function useEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>(loadEntries)

  const persist = useCallback((updated: JournalEntry[]) => {
    setEntries(updated)
    saveEntries(updated)
  }, [])

  const addEntry = useCallback(
    (data: { date: string; mood: Mood; title: string; body: string }): JournalEntry => {
      const newEntry: JournalEntry = {
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date().toISOString(),
      }
      const updated = [...loadEntries(), newEntry]
      persist(updated)
      return newEntry
    },
    [persist],
  )

  const updateEntry = useCallback(
    (id: string, data: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>) => {
      const current = loadEntries()
      const updated = current.map((e) => (e.id === id ? { ...e, ...data } : e))
      persist(updated)
    },
    [persist],
  )

  const deleteEntry = useCallback(
    (id: string) => {
      const current = loadEntries()
      const updated = current.filter((e) => e.id !== id)
      persist(updated)
    },
    [persist],
  )

  const getEntryByDate = useCallback(
    (date: string): JournalEntry | undefined => {
      return entries.find((e) => e.date === date)
    },
    [entries],
  )

  const getEntryById = useCallback(
    (id: string): JournalEntry | undefined => {
      return entries.find((e) => e.id === id)
    },
    [entries],
  )

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => b.date.localeCompare(a.date)),
    [entries],
  )

  return { entries: sortedEntries, addEntry, updateEntry, deleteEntry, getEntryByDate, getEntryById }
}

export type Mood = 'happy' | 'calm' | 'neutral' | 'anxious' | 'sad' | 'excited'

export interface JournalEntry {
  id: string
  date: string // YYYY-MM-DD local date
  mood: Mood
  title: string
  body: string
  createdAt: string // ISO 8601 timestamp
}

export interface MoodConfig {
  emoji: string
  label: string
  color: string
  score: number
}

export interface EntriesContextType {
  entries: JournalEntry[]
  addEntry: (data: { date: string; mood: Mood; title: string; body: string }) => JournalEntry
  updateEntry: (id: string, data: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>) => void
  deleteEntry: (id: string) => void
  getEntryByDate: (date: string) => JournalEntry | undefined
  getEntryById: (id: string) => JournalEntry | undefined
}

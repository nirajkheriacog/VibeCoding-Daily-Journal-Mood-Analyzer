import type { Mood, MoodConfig } from './types'

export const STORAGE_KEY = 'journal_entries'

export const MOODS: Record<Mood, MoodConfig> = {
  excited: { emoji: '🎉', label: 'Excited', color: '#FF6B6B', score: 6 },
  happy: { emoji: '😊', label: 'Happy', color: '#FFD700', score: 5 },
  calm: { emoji: '😌', label: 'Calm', color: '#87CEEB', score: 4 },
  neutral: { emoji: '😐', label: 'Neutral', color: '#C0C0C0', score: 3 },
  anxious: { emoji: '😰', label: 'Anxious', color: '#FFA500', score: 2 },
  sad: { emoji: '😢', label: 'Sad', color: '#6B7280', score: 1 },
}

// Display order: positive to negative
export const MOOD_LIST: Mood[] = ['excited', 'happy', 'calm', 'neutral', 'anxious', 'sad']

export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

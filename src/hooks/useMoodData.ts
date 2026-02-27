import { useMemo } from 'react'
import type { JournalEntry, Mood } from '../types'
import { MOODS, getLocalDateString } from '../constants'

export interface ChartDataPoint {
  date: string
  score: number
  mood: Mood
  label: string
}

export function useMoodData(entries: JournalEntry[]) {
  const chartData = useMemo((): ChartDataPoint[] => {
    const now = new Date()
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const cutoff = getLocalDateString(thirtyDaysAgo)

    return entries
      .filter((e) => e.date >= cutoff)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((e) => ({
        date: e.date,
        score: MOODS[e.mood].score,
        mood: e.mood,
        label: MOODS[e.mood].label,
      }))
  }, [entries])

  const totalEntries = entries.length

  const currentStreak = useMemo((): number => {
    if (entries.length === 0) return 0

    const dates = new Set(entries.map((e) => e.date))
    const today = new Date()
    const todayStr = getLocalDateString(today)

    // Start counting from today or yesterday
    let checkDate = new Date(today)
    if (!dates.has(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1)
      if (!dates.has(getLocalDateString(checkDate))) return 0
    }

    let streak = 0
    while (dates.has(getLocalDateString(checkDate))) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    }
    return streak
  }, [entries])

  const mostCommonMood = useMemo((): Mood | null => {
    if (entries.length === 0) return null
    const counts: Record<string, number> = {}
    for (const e of entries) {
      counts[e.mood] = (counts[e.mood] || 0) + 1
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as Mood
  }, [entries])

  return { chartData, totalEntries, currentStreak, mostCommonMood }
}

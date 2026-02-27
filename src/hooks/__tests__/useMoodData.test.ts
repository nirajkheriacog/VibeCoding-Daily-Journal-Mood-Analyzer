import { renderHook } from '@testing-library/react'
import { useMoodData } from '../useMoodData'
import type { JournalEntry } from '../../types'
import { getLocalDateString } from '../../constants'

function makeEntry(date: string, mood: JournalEntry['mood'] = 'happy'): JournalEntry {
  return {
    id: `id-${date}`,
    date,
    mood,
    title: `Entry for ${date}`,
    body: '',
    createdAt: `${date}T10:00:00.000Z`,
  }
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return getLocalDateString(d)
}

describe('useMoodData', () => {
  it('returns empty data for no entries', () => {
    const { result } = renderHook(() => useMoodData([]))
    expect(result.current.chartData).toEqual([])
    expect(result.current.totalEntries).toBe(0)
    expect(result.current.currentStreak).toBe(0)
    expect(result.current.mostCommonMood).toBeNull()
  })

  it('filters chart data to last 30 days', () => {
    const entries = [
      makeEntry(daysAgo(0)),
      makeEntry(daysAgo(15)),
      makeEntry(daysAgo(40)), // older than 30 days, should be excluded
    ]
    const { result } = renderHook(() => useMoodData(entries))
    expect(result.current.chartData).toHaveLength(2)
  })

  it('sorts chart data chronologically (oldest first)', () => {
    const entries = [
      makeEntry(daysAgo(0)),
      makeEntry(daysAgo(5)),
      makeEntry(daysAgo(2)),
    ]
    const { result } = renderHook(() => useMoodData(entries))
    expect(result.current.chartData[0].date).toBe(daysAgo(5))
    expect(result.current.chartData[2].date).toBe(daysAgo(0))
  })

  it('calculates current streak from today', () => {
    const entries = [
      makeEntry(daysAgo(0)),
      makeEntry(daysAgo(1)),
      makeEntry(daysAgo(2)),
      // gap at daysAgo(3)
      makeEntry(daysAgo(4)),
    ]
    const { result } = renderHook(() => useMoodData(entries))
    expect(result.current.currentStreak).toBe(3)
  })

  it('streak starts from yesterday if today has no entry', () => {
    const entries = [
      makeEntry(daysAgo(1)),
      makeEntry(daysAgo(2)),
    ]
    const { result } = renderHook(() => useMoodData(entries))
    expect(result.current.currentStreak).toBe(2)
  })

  it('streak is 0 when latest entry is older than yesterday', () => {
    const entries = [makeEntry(daysAgo(5))]
    const { result } = renderHook(() => useMoodData(entries))
    expect(result.current.currentStreak).toBe(0)
  })

  it('returns the most common mood', () => {
    const entries = [
      makeEntry(daysAgo(0), 'happy'),
      makeEntry(daysAgo(1), 'sad'),
      makeEntry(daysAgo(2), 'happy'),
      makeEntry(daysAgo(3), 'calm'),
    ]
    const { result } = renderHook(() => useMoodData(entries))
    expect(result.current.mostCommonMood).toBe('happy')
  })

  it('returns total entries count', () => {
    const entries = [makeEntry(daysAgo(0)), makeEntry(daysAgo(1)), makeEntry(daysAgo(2))]
    const { result } = renderHook(() => useMoodData(entries))
    expect(result.current.totalEntries).toBe(3)
  })
})

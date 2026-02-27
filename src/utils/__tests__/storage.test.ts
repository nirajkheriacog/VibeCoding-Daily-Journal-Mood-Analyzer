import { loadEntries, saveEntries } from '../storage'
import type { JournalEntry } from '../../types'
import { STORAGE_KEY } from '../../constants'

const mockEntry: JournalEntry = {
  id: 'test-id-1',
  date: '2026-02-27',
  mood: 'happy',
  title: 'Test Entry',
  body: 'Test body',
  createdAt: '2026-02-27T10:00:00.000Z',
}

beforeEach(() => {
  localStorage.clear()
})

describe('loadEntries', () => {
  it('returns empty array when localStorage is empty', () => {
    expect(loadEntries()).toEqual([])
  })

  it('returns parsed entries from valid JSON', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([mockEntry]))
    expect(loadEntries()).toEqual([mockEntry])
  })

  it('returns empty array for corrupted JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json')
    expect(loadEntries()).toEqual([])
  })

  it('returns empty array when stored value is not an array', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ foo: 'bar' }))
    expect(loadEntries()).toEqual([])
  })
})

describe('saveEntries', () => {
  it('writes entries to localStorage', () => {
    saveEntries([mockEntry])
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(stored).toEqual([mockEntry])
  })

  it('round-trips correctly', () => {
    const entries = [mockEntry]
    saveEntries(entries)
    expect(loadEntries()).toEqual(entries)
  })
})

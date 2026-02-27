import { renderHook, act } from '@testing-library/react'
import { useEntries } from '../useEntries'
import { STORAGE_KEY } from '../../constants'

beforeEach(() => {
  localStorage.clear()
})

describe('useEntries', () => {
  it('starts with empty entries', () => {
    const { result } = renderHook(() => useEntries())
    expect(result.current.entries).toEqual([])
  })

  it('addEntry creates and persists an entry', () => {
    const { result } = renderHook(() => useEntries())

    let newEntry: ReturnType<typeof result.current.addEntry>
    act(() => {
      newEntry = result.current.addEntry({
        date: '2026-02-27',
        mood: 'happy',
        title: 'My Day',
        body: 'Great day!',
      })
    })

    expect(result.current.entries).toHaveLength(1)
    expect(result.current.entries[0].title).toBe('My Day')
    expect(result.current.entries[0].mood).toBe('happy')
    expect(newEntry!.id).toBeTruthy()

    // Verify localStorage persistence
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(stored).toHaveLength(1)
  })

  it('updateEntry modifies an existing entry', () => {
    const { result } = renderHook(() => useEntries())

    let id: string
    act(() => {
      const entry = result.current.addEntry({
        date: '2026-02-27',
        mood: 'happy',
        title: 'Original',
        body: '',
      })
      id = entry.id
    })

    act(() => {
      result.current.updateEntry(id, { title: 'Updated', mood: 'calm' })
    })

    expect(result.current.entries[0].title).toBe('Updated')
    expect(result.current.entries[0].mood).toBe('calm')
  })

  it('deleteEntry removes an entry', () => {
    const { result } = renderHook(() => useEntries())

    let id: string
    act(() => {
      const entry = result.current.addEntry({
        date: '2026-02-27',
        mood: 'happy',
        title: 'To Delete',
        body: '',
      })
      id = entry.id
    })

    act(() => {
      result.current.deleteEntry(id)
    })

    expect(result.current.entries).toHaveLength(0)
  })

  it('getEntryByDate finds the correct entry', () => {
    const { result } = renderHook(() => useEntries())

    act(() => {
      result.current.addEntry({ date: '2026-02-27', mood: 'happy', title: 'Today', body: '' })
      result.current.addEntry({ date: '2026-02-26', mood: 'sad', title: 'Yesterday', body: '' })
    })

    expect(result.current.getEntryByDate('2026-02-27')?.title).toBe('Today')
    expect(result.current.getEntryByDate('2026-02-25')).toBeUndefined()
  })

  it('getEntryById finds the correct entry', () => {
    const { result } = renderHook(() => useEntries())

    let id: string
    act(() => {
      const entry = result.current.addEntry({ date: '2026-02-27', mood: 'happy', title: 'Find me', body: '' })
      id = entry.id
    })

    expect(result.current.getEntryById(id!)).toBeDefined()
    expect(result.current.getEntryById('nonexistent')).toBeUndefined()
  })

  it('entries are sorted newest-first', () => {
    const { result } = renderHook(() => useEntries())

    act(() => {
      result.current.addEntry({ date: '2026-02-25', mood: 'sad', title: 'Oldest', body: '' })
      result.current.addEntry({ date: '2026-02-27', mood: 'happy', title: 'Newest', body: '' })
      result.current.addEntry({ date: '2026-02-26', mood: 'calm', title: 'Middle', body: '' })
    })

    expect(result.current.entries[0].date).toBe('2026-02-27')
    expect(result.current.entries[1].date).toBe('2026-02-26')
    expect(result.current.entries[2].date).toBe('2026-02-25')
  })
})

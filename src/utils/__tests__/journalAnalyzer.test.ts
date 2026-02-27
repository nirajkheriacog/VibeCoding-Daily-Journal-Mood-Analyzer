import { analyzeQuery } from '../journalAnalyzer'
import type { JournalEntry } from '../../types'
import { getLocalDateString } from '../../constants'

function makeEntry(
  daysAgo: number,
  mood: JournalEntry['mood'] = 'happy',
  title = 'Test Entry',
  body = 'Some body text',
): JournalEntry {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return {
    id: `id-${daysAgo}-${mood}`,
    date: getLocalDateString(d),
    mood,
    title,
    body,
    createdAt: d.toISOString(),
  }
}

const sampleEntries: JournalEntry[] = [
  makeEntry(1, 'excited', 'Got a promotion!', 'Incredible day at work'),
  makeEntry(2, 'calm', 'Meditation morning', 'Felt centered and peaceful'),
  makeEntry(3, 'sad', 'Missing home', 'Feeling homesick today'),
  makeEntry(4, 'happy', 'Lunch with friend', 'Great conversations and laughs'),
  makeEntry(5, 'neutral', 'Back to routine', 'Nothing remarkable'),
  makeEntry(7, 'anxious', 'Deadline approaching', 'Feeling the pressure at work'),
  makeEntry(10, 'happy', 'Good news', 'Positive feedback on presentation'),
]

describe('analyzeQuery', () => {
  it('returns summary for summary questions', () => {
    const result = analyzeQuery('Give me a summary', sampleEntries)
    expect(result.content).toContain('total entries')
    expect(result.content).toContain('Average mood score')
  })

  it('returns happiest entries for happiness questions', () => {
    const result = analyzeQuery('When was I happiest?', sampleEntries)
    expect(result.content).toContain('happiest entries')
    expect(result.citations.length).toBeGreaterThan(0)
  })

  it('returns sad entries for worst day questions', () => {
    const result = analyzeQuery('What were my worst days?', sampleEntries)
    expect(result.content).toContain('difficult days')
    expect(result.citations.length).toBeGreaterThan(0)
  })

  it('returns anxiety analysis for trigger questions', () => {
    const result = analyzeQuery('What triggers my anxiety?', sampleEntries)
    expect(result.content).toContain('anxious')
    expect(result.citations.length).toBeGreaterThan(0)
  })

  it('returns pattern analysis for pattern questions', () => {
    const result = analyzeQuery('What patterns do you see in my mood?', sampleEntries)
    expect(result.content).toContain('average score')
  })

  it('returns week summary for week questions', () => {
    const result = analyzeQuery('How was my week?', sampleEntries)
    expect(result.content).toMatch(/week|entries/)
  })

  it('handles keyword search as fallback', () => {
    const result = analyzeQuery('promotion', sampleEntries)
    expect(result.citations.length).toBeGreaterThan(0)
  })

  it('handles empty entries gracefully', () => {
    const result = analyzeQuery('How am I doing?', [])
    expect(result.content).toContain('empty')
    expect(result.citations).toEqual([])
  })

  it('citations include valid entry IDs', () => {
    const result = analyzeQuery('summary', sampleEntries)
    for (const c of result.citations) {
      expect(sampleEntries.find((e) => e.id === c.id)).toBeDefined()
    }
  })

  it('responds to mood-specific queries', () => {
    const result = analyzeQuery('Tell me about my calm days', sampleEntries)
    expect(result.content).toContain('Calm')
    expect(result.citations.length).toBeGreaterThan(0)
  })
})

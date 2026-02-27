import type { JournalEntry, Mood, CitedEntry } from '../types'
import { MOODS, getLocalDateString } from '../constants'

interface AnalysisResult {
  content: string
  citations: CitedEntry[]
}

function cite(entry: JournalEntry): string {
  const d = new Date(entry.date + 'T00:00:00')
  const display = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  return `[[cite:${entry.id}|${display}: ${entry.title}]]`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

function moodCounts(entries: JournalEntry[]): Record<Mood, number> {
  const counts = {} as Record<Mood, number>
  for (const m of Object.keys(MOODS) as Mood[]) counts[m] = 0
  for (const e of entries) counts[e.mood]++
  return counts
}

function avgScore(entries: JournalEntry[]): number {
  if (entries.length === 0) return 0
  return entries.reduce((sum, e) => sum + MOODS[e.mood].score, 0) / entries.length
}

function streak(entries: JournalEntry[]): number {
  if (entries.length === 0) return 0
  const dates = new Set(entries.map((e) => e.date))
  const today = new Date()
  const todayStr = getLocalDateString(today)
  let check = new Date(today)
  if (!dates.has(todayStr)) {
    check.setDate(check.getDate() - 1)
    if (!dates.has(getLocalDateString(check))) return 0
  }
  let s = 0
  while (dates.has(getLocalDateString(check))) {
    s++
    check.setDate(check.getDate() - 1)
  }
  return s
}

function entriesInRange(entries: JournalEntry[], days: number): JournalEntry[] {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  const cutoffStr = getLocalDateString(cutoff)
  return entries.filter((e) => e.date >= cutoffStr).sort((a, b) => a.date.localeCompare(b.date))
}

function searchEntries(entries: JournalEntry[], keywords: string[]): JournalEntry[] {
  const lower = keywords.map((k) => k.toLowerCase())
  return entries.filter((e) => {
    const text = `${e.title} ${e.body}`.toLowerCase()
    return lower.some((k) => text.includes(k))
  })
}

// --- Handlers for different question types ---

function handleMoodPattern(entries: JournalEntry[]): AnalysisResult {
  const recent = entriesInRange(entries, 14)
  if (recent.length < 2) {
    return { content: 'You need at least a couple of entries to see patterns. Keep journaling!', citations: [] }
  }

  const counts = moodCounts(recent)
  const sorted = (Object.entries(counts) as [Mood, number][])
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1])

  const avg = avgScore(recent)
  const trend = avg >= 4.5 ? 'quite positive' : avg >= 3.5 ? 'generally good' : avg >= 2.5 ? 'mixed' : 'on the lower side'

  const topMood = sorted[0]
  const topEntries = recent.filter((e) => e.mood === topMood[0]).slice(0, 3)

  let response = `Over the past two weeks (${recent.length} entries), your mood has been **${trend}** with an average score of ${avg.toFixed(1)}/6.\n\n`
  response += `Your most frequent mood was **${MOODS[topMood[0]].emoji} ${MOODS[topMood[0]].label}** (${topMood[1]} times). `

  if (sorted.length > 1) {
    response += `Followed by **${MOODS[sorted[1][0]].emoji} ${MOODS[sorted[1][0]].label}** (${sorted[1][1]} times).`
  }

  response += '\n\nHere are some entries that reflect your dominant mood:\n'
  for (const e of topEntries) {
    response += `- ${cite(e)}\n`
  }

  const citations = topEntries.map((e) => ({ id: e.id, date: e.date, title: e.title }))
  return { content: response, citations }
}

function handleHappiest(entries: JournalEntry[]): AnalysisResult {
  if (entries.length === 0) {
    return { content: 'No entries yet! Start journaling to discover your happiest moments.', citations: [] }
  }

  const sorted = [...entries].sort((a, b) => {
    const diff = MOODS[b.mood].score - MOODS[a.mood].score
    return diff !== 0 ? diff : b.date.localeCompare(a.date)
  })

  const top = sorted.slice(0, 3)
  let response = `Your happiest entries were:\n\n`
  for (const e of top) {
    response += `- **${MOODS[e.mood].emoji} ${MOODS[e.mood].label}** on ${formatDate(e.date)} — ${cite(e)}`
    if (e.body) response += `\n  _"${e.body.slice(0, 100)}${e.body.length > 100 ? '...' : ''}"_`
    response += '\n\n'
  }

  const citations = top.map((e) => ({ id: e.id, date: e.date, title: e.title }))
  return { content: response, citations }
}

function handleSaddest(entries: JournalEntry[]): AnalysisResult {
  if (entries.length === 0) {
    return { content: 'No entries yet to analyze.', citations: [] }
  }

  const sorted = [...entries].sort((a, b) => {
    const diff = MOODS[a.mood].score - MOODS[b.mood].score
    return diff !== 0 ? diff : b.date.localeCompare(a.date)
  })

  const top = sorted.slice(0, 3)
  let response = `Your most difficult days were:\n\n`
  for (const e of top) {
    response += `- **${MOODS[e.mood].emoji} ${MOODS[e.mood].label}** on ${formatDate(e.date)} — ${cite(e)}`
    if (e.body) response += `\n  _"${e.body.slice(0, 100)}${e.body.length > 100 ? '...' : ''}"_`
    response += '\n\n'
  }
  response += `Remember, difficult days are a normal part of life. The fact that you're reflecting on them shows real self-awareness.`

  const citations = top.map((e) => ({ id: e.id, date: e.date, title: e.title }))
  return { content: response, citations }
}

function handleAnxiousTriggers(entries: JournalEntry[]): AnalysisResult {
  const anxious = entries.filter((e) => e.mood === 'anxious' || e.mood === 'sad')
  if (anxious.length === 0) {
    return { content: "Great news — you don't have any anxious or sad entries! Keep it up.", citations: [] }
  }

  let response = `I found **${anxious.length}** entries where you felt anxious or sad:\n\n`
  const show = anxious.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)
  for (const e of show) {
    response += `- **${MOODS[e.mood].emoji} ${MOODS[e.mood].label}** — ${cite(e)}`
    if (e.body) response += `: _"${e.body.slice(0, 80)}${e.body.length > 80 ? '...' : ''}"_`
    response += '\n'
  }

  // Look for common words in anxious entries
  const words = anxious
    .flatMap((e) => `${e.title} ${e.body}`.toLowerCase().split(/\W+/))
    .filter((w) => w.length > 4)
  const wordCounts: Record<string, number> = {}
  for (const w of words) wordCounts[w] = (wordCounts[w] || 0) + 1
  const commonWords = Object.entries(wordCounts)
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  if (commonWords.length > 0) {
    response += `\nRecurring themes in these entries: **${commonWords.map(([w]) => w).join('**, **')}**`
  }

  const citations = show.map((e) => ({ id: e.id, date: e.date, title: e.title }))
  return { content: response, citations }
}

function handleSummary(entries: JournalEntry[]): AnalysisResult {
  if (entries.length === 0) {
    return { content: 'Your journal is empty. Write your first entry to get started!', citations: [] }
  }

  const counts = moodCounts(entries)
  const sorted = (Object.entries(counts) as [Mood, number][])
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1])
  const avg = avgScore(entries)
  const s = streak(entries)
  const newest = [...entries].sort((a, b) => b.date.localeCompare(a.date))[0]
  const oldest = [...entries].sort((a, b) => a.date.localeCompare(b.date))[0]

  let response = `Here's your journal summary:\n\n`
  response += `- **${entries.length}** total entries, from ${formatDate(oldest.date)} to ${formatDate(newest.date)}\n`
  response += `- **Current streak:** ${s} day${s !== 1 ? 's' : ''}\n`
  response += `- **Average mood score:** ${avg.toFixed(1)}/6\n`
  response += `- **Most common mood:** ${MOODS[sorted[0][0]].emoji} ${MOODS[sorted[0][0]].label} (${sorted[0][1]} times)\n\n`

  response += `**Mood breakdown:**\n`
  for (const [mood, count] of sorted) {
    const pct = Math.round((count / entries.length) * 100)
    response += `- ${MOODS[mood].emoji} ${MOODS[mood].label}: ${count} (${pct}%)\n`
  }

  response += `\nYour most recent entry: ${cite(newest)}`

  const citations = [{ id: newest.id, date: newest.date, title: newest.title }]
  return { content: response, citations }
}

function handleSearch(entries: JournalEntry[], query: string): AnalysisResult {
  // Extract meaningful words from query (skip common words)
  const stopWords = new Set(['what', 'when', 'where', 'how', 'why', 'did', 'was', 'were', 'the', 'about', 'write', 'wrote', 'entry', 'entries', 'journal', 'any', 'find', 'search', 'look', 'for', 'with', 'that', 'this', 'have', 'has', 'had', 'been', 'are', 'and', 'you', 'your', 'tell', 'show', 'mention', 'talk'])
  const keywords = query
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 2 && !stopWords.has(w))

  if (keywords.length === 0) {
    return { content: "I'm not sure what to search for. Try asking about a specific topic, mood, or time period!", citations: [] }
  }

  const matches = searchEntries(entries, keywords)
  if (matches.length === 0) {
    return { content: `I couldn't find any entries matching "${keywords.join(', ')}". Try different keywords or ask about your mood patterns instead.`, citations: [] }
  }

  const show = matches.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)
  let response = `I found **${matches.length}** ${matches.length === 1 ? 'entry' : 'entries'} related to "${keywords.join(', ')}":\n\n`
  for (const e of show) {
    response += `- **${MOODS[e.mood].emoji}** ${formatDate(e.date)} — ${cite(e)}`
    if (e.body) response += `\n  _"${e.body.slice(0, 100)}${e.body.length > 100 ? '...' : ''}"_`
    response += '\n\n'
  }
  if (matches.length > 5) {
    response += `_...and ${matches.length - 5} more._`
  }

  const citations = show.map((e) => ({ id: e.id, date: e.date, title: e.title }))
  return { content: response, citations }
}

function handleWeekSummary(entries: JournalEntry[]): AnalysisResult {
  const recent = entriesInRange(entries, 7)
  if (recent.length === 0) {
    return { content: 'No entries from the past week. Try writing one today!', citations: [] }
  }

  const avg = avgScore(recent)
  const trend = avg >= 4.5 ? 'a great' : avg >= 3.5 ? 'a good' : avg >= 2.5 ? 'a mixed' : 'a tough'

  let response = `You had **${trend} week** with ${recent.length} ${recent.length === 1 ? 'entry' : 'entries'} and an average mood of ${avg.toFixed(1)}/6.\n\n`

  for (const e of recent) {
    response += `- **${formatDate(e.date)}** — ${MOODS[e.mood].emoji} ${MOODS[e.mood].label} — ${cite(e)}\n`
  }

  const best = [...recent].sort((a, b) => MOODS[b.mood].score - MOODS[a.mood].score)[0]
  const worst = [...recent].sort((a, b) => MOODS[a.mood].score - MOODS[b.mood].score)[0]

  if (recent.length >= 2) {
    response += `\nBest day: ${cite(best)} (${MOODS[best.mood].emoji} ${MOODS[best.mood].label})`
    response += `\nToughest day: ${cite(worst)} (${MOODS[worst.mood].emoji} ${MOODS[worst.mood].label})`
  }

  const citations = recent.map((e) => ({ id: e.id, date: e.date, title: e.title }))
  return { content: response, citations }
}

// --- Main query router ---

export function analyzeQuery(query: string, entries: JournalEntry[]): AnalysisResult {
  const q = query.toLowerCase()

  // Pattern/trend questions
  if (q.match(/pattern|trend|over time|mood.*(change|track|progress)/)) {
    return handleMoodPattern(entries)
  }

  // Happiest / best days
  if (q.match(/happi(est|er)|best day|most (positive|excited|joyful)|when.*(happy|best|good)/)) {
    return handleHappiest(entries)
  }

  // Saddest / worst days
  if (q.match(/sad(dest|der)|worst day|most (negative|down|difficult)|low(est)? (point|mood)|when.*(sad|worst|bad|down)/)) {
    return handleSaddest(entries)
  }

  // Anxiety triggers
  if (q.match(/anxi(ous|ety)|trigger|stress|worried|nervous|recurr/)) {
    return handleAnxiousTriggers(entries)
  }

  // Weekly summary
  if (q.match(/week|past.*(7|seven) day|this week|last week/)) {
    return handleWeekSummary(entries)
  }

  // General summary
  if (q.match(/summar|overview|overall|how.*(doing|been|am i)|tell me about/)) {
    return handleSummary(entries)
  }

  // Mood-specific queries
  for (const mood of Object.keys(MOODS) as Mood[]) {
    if (q.includes(mood)) {
      const filtered = entries.filter((e) => e.mood === mood)
      if (filtered.length === 0) {
        return { content: `You don't have any entries with mood "${MOODS[mood].label}" yet.`, citations: [] }
      }
      const show = filtered.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)
      let response = `You've felt **${MOODS[mood].emoji} ${MOODS[mood].label}** ${filtered.length} time${filtered.length !== 1 ? 's' : ''}:\n\n`
      for (const e of show) {
        response += `- ${formatDate(e.date)} — ${cite(e)}\n`
      }
      if (filtered.length > 5) response += `\n_...and ${filtered.length - 5} more._`
      return { content: response, citations: show.map((e) => ({ id: e.id, date: e.date, title: e.title })) }
    }
  }

  // Default: keyword search
  return handleSearch(entries, query)
}

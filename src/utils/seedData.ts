import type { JournalEntry, Mood } from '../types'
import { getLocalDateString, STORAGE_KEY } from '../constants'

const SEED_KEY = 'journal_seeded'

const mockEntries: Array<{ daysAgo: number; mood: Mood; title: string; body: string }> = [
  { daysAgo: 13, mood: 'neutral', title: 'Starting the week', body: 'Nothing special today, just getting through the Monday routine. Made some progress on the project.' },
  { daysAgo: 12, mood: 'happy', title: 'Good news at work', body: 'Got positive feedback on my presentation. Feeling motivated to keep pushing forward.' },
  { daysAgo: 11, mood: 'calm', title: 'Quiet evening', body: 'Spent the evening reading a book and drinking tea. Sometimes the simple things are the best.' },
  { daysAgo: 10, mood: 'anxious', title: 'Big deadline approaching', body: 'The project deadline is coming up fast. Trying to stay focused but feeling the pressure.' },
  { daysAgo: 9, mood: 'anxious', title: 'Still stressed', body: 'Worked late again. Need to find a better balance. At least I got the hardest part done.' },
  { daysAgo: 8, mood: 'happy', title: 'Finished the project!', body: 'Finally submitted everything on time. Huge weight off my shoulders. Celebrated with friends.' },
  { daysAgo: 7, mood: 'excited', title: 'Weekend adventure', body: 'Went hiking with friends. The weather was perfect and the views were incredible.' },
  { daysAgo: 6, mood: 'calm', title: 'Lazy Sunday', body: 'Slept in, made pancakes, watched a movie. Recharged for the week ahead.' },
  { daysAgo: 5, mood: 'neutral', title: 'Back to routine', body: 'Monday again. Nothing remarkable but nothing bad either. Steady progress on new tasks.' },
  { daysAgo: 4, mood: 'happy', title: 'Lunch with old friend', body: 'Caught up with a friend I haven\'t seen in months. Great conversations and lots of laughs.' },
  { daysAgo: 3, mood: 'sad', title: 'Missing home', body: 'Feeling a bit homesick today. Called my family which helped, but still feeling down.' },
  { daysAgo: 2, mood: 'calm', title: 'Meditation morning', body: 'Started the day with a 20-minute meditation session. Felt centered and peaceful all day.' },
  { daysAgo: 1, mood: 'excited', title: 'Got a promotion!', body: 'Incredible day — got the promotion I\'ve been working toward. All the hard work paid off!' },
]

export function seedMockData(): void {
  if (localStorage.getItem(SEED_KEY)) return
  if (localStorage.getItem(STORAGE_KEY)) return

  const entries: JournalEntry[] = mockEntries.map((item) => {
    const date = new Date()
    date.setDate(date.getDate() - item.daysAgo)
    const dateStr = getLocalDateString(date)
    return {
      id: crypto.randomUUID(),
      date: dateStr,
      mood: item.mood,
      title: item.title,
      body: item.body,
      createdAt: new Date(date.getTime() + 10 * 60 * 60 * 1000).toISOString(), // 10am that day
    }
  })

  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  localStorage.setItem(SEED_KEY, 'true')
}

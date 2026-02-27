# Project Plan: Daily Journal & Mood Analyzer

## Tech Stack

| Concern | Choice | Reason |
|---|---|---|
| Framework | React + Vite | Fast dev server, wide ecosystem, component model suits this UI |
| Styling | Tailwind CSS | Utility-first, easy responsive design |
| Charts | Recharts | React-native charting, simple API for mood trends |
| Storage | localStorage | No backend needed; keeps data private and local |
| Language | TypeScript | Type safety for data models |
| Testing | Vitest + React Testing Library | Co-located with Vite, minimal config |

---

## Data Model

```ts
type Mood = 'happy' | 'calm' | 'neutral' | 'anxious' | 'sad' | 'excited';

interface JournalEntry {
  id: string;          // UUID
  date: string;        // ISO date string (YYYY-MM-DD)
  mood: Mood;
  title: string;
  body: string;
  createdAt: string;   // ISO timestamp
}
```

All entries stored as `JournalEntry[]` under a single `localStorage` key (`journal_entries`).

---

## Application Structure

```
src/
├── components/
│   ├── EntryForm.tsx        # New/edit journal entry form
│   ├── EntryCard.tsx        # Summary card for a past entry
│   ├── EntryList.tsx        # Scrollable list of EntryCards
│   ├── MoodPicker.tsx       # Mood selection UI (emoji + label)
│   ├── MoodChart.tsx        # Line/bar chart of mood over time
│   └── Layout.tsx           # App shell, nav
├── hooks/
│   ├── useEntries.ts        # CRUD operations + localStorage sync
│   └── useMoodData.ts       # Derives chart-ready data from entries
├── types.ts                 # Shared TypeScript types
├── utils/
│   └── storage.ts           # localStorage read/write helpers
└── App.tsx                  # Routing + top-level state
```

---

## Pages / Views

| Route | View | Description |
|---|---|---|
| `/` | Today | Quick-entry form pre-filled with today's date + mood picker |
| `/entries` | History | Paginated list of all past entries |
| `/entries/:id` | Entry Detail | Full entry view with edit/delete |
| `/insights` | Mood Insights | Mood-over-time chart + basic stats (streak, most common mood) |

---

## Build Phases

### Phase 1 — Scaffold & Data Layer
- [ ] Initialize Vite + React + TypeScript project
- [ ] Install and configure Tailwind CSS
- [ ] Define `JournalEntry` type and `Mood` enum
- [ ] Build `storage.ts` utilities (get, save, delete entries)
- [ ] Build `useEntries` hook with full CRUD

### Phase 2 — Core Journal UI
- [ ] Build `MoodPicker` component (6 moods, emoji + label, keyboard accessible)
- [ ] Build `EntryForm` (title, body textarea, mood picker, date, save button)
- [ ] Wire `EntryForm` to `useEntries` — entries persist to localStorage
- [ ] Build `EntryCard` and `EntryList`
- [ ] Build entry detail view with edit and delete

### Phase 3 — Mood Visualization
- [ ] Install Recharts
- [ ] Build `useMoodData` hook — maps entries to `{ date, moodScore }[]`
- [ ] Build `MoodChart` — line chart of mood over past 30 days
- [ ] Add summary stats: current streak, most frequent mood, total entries
- [ ] Build Insights page combining chart + stats

### Phase 4 — Polish & Validation
- [ ] Responsive layout (mobile-first)
- [ ] Empty states for no entries / no data
- [ ] Form validation (required fields, duplicate date warning)
- [ ] Accessible markup (ARIA labels, focus management)
- [ ] Basic unit tests: `useEntries` hook, `useMoodData` derivations, `storage.ts`
- [ ] Cross-browser smoke test

---

## Mood Score Mapping

For chart rendering, moods are mapped to a numeric scale:

| Mood | Score |
|---|---|
| sad | 1 |
| anxious | 2 |
| neutral | 3 |
| calm | 4 |
| happy | 5 |
| excited | 6 |

---

## Key Decisions

- **One entry per day**: If a user tries to create a second entry for the same date, prompt to edit the existing one rather than allow duplicates.
- **No accounts / sync**: Data lives in the browser only. No auth, no server.
- **No AI mood detection**: Mood is always manually selected by the user (per the brief).
- **Date handling**: Always use the device's local date, not UTC, to avoid off-by-one issues in daily tracking.

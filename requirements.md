# Requirements: Daily Journal & Mood Analyzer

## Functional Requirements

### FR-1: Journal Entry Management
- **FR-1.1** Users can create a journal entry containing a title, body text, date, and mood.
- **FR-1.2** Users can view a list of all past journal entries, ordered by date (newest first).
- **FR-1.3** Users can view the full content of a single journal entry.
- **FR-1.4** Users can edit an existing journal entry (title, body, mood).
- **FR-1.5** Users can delete a journal entry with a confirmation step.
- **FR-1.6** Only one entry is allowed per calendar day. Attempting to create a second entry for the same date prompts the user to edit the existing one.

### FR-2: Mood Tracking
- **FR-2.1** Each journal entry must have exactly one mood selected from a fixed predefined set.
- **FR-2.2** The predefined moods are: **Happy, Excited, Calm, Neutral, Anxious, Sad**.
- **FR-2.3** Mood selection is always manual — the app never infers or auto-assigns a mood.
- **FR-2.4** Each mood is displayed with a distinct visual indicator (emoji + label).

### FR-3: Mood Visualization
- **FR-3.1** The app displays a line chart showing the user's mood over time (default: last 30 days).
- **FR-3.2** Moods are mapped to a numeric scale for charting: Sad=1, Anxious=2, Neutral=3, Calm=4, Happy=5, Excited=6.
- **FR-3.3** The chart only plots days for which an entry exists (no gap-filling with defaults).
- **FR-3.4** The Insights view displays summary statistics:
  - Total number of entries
  - Current journaling streak (consecutive days with an entry)
  - Most frequently recorded mood

### FR-4: Data Persistence
- **FR-4.1** All journal entries are stored locally in the browser using `localStorage`.
- **FR-4.2** Data persists across page reloads and browser sessions.
- **FR-4.3** No data is transmitted to any server or third-party service.

---

## Non-Functional Requirements

### NFR-1: Usability
- **NFR-1.1** The primary entry creation flow (open app → write entry → save) must require no more than 3 interactions to complete.
- **NFR-1.2** All interactive elements must have visible focus states for keyboard navigation.
- **NFR-1.3** Mood picker must be operable via keyboard.
- **NFR-1.4** Empty states must be shown when there are no entries or no chart data.

### NFR-2: Responsiveness
- **NFR-2.1** The application must be fully usable on screens from 375px (mobile) to 1440px (desktop) wide.
- **NFR-2.2** Layout adapts between single-column (mobile) and multi-column (desktop) without horizontal scrolling.

### NFR-3: Performance
- **NFR-3.1** Initial page load must render within 3 seconds on a standard broadband connection.
- **NFR-3.2** Saving or deleting an entry must reflect in the UI without a full page reload.

### NFR-4: Privacy & Security
- **NFR-4.1** No user account, authentication, or registration is required.
- **NFR-4.2** No analytics, tracking scripts, or third-party data collection.
- **NFR-4.3** All data remains on the user's device.

### NFR-5: Accessibility
- **NFR-5.1** Semantic HTML elements are used throughout (headings, buttons, forms, lists).
- **NFR-5.2** All images and icons have appropriate `alt` text or `aria-label` attributes.
- **NFR-5.3** Color is not the sole means of conveying mood information (label or emoji accompanies color).

---

## Constraints

| Constraint | Detail |
|---|---|
| No backend | The app runs entirely in the browser; no server, database, or API calls |
| No AI/NLP | Mood is user-selected only; no text analysis or inference |
| Date handling | All dates use the device's local timezone, not UTC |
| Entry limit | One entry per calendar day (enforced in UI) |

---

## Out of Scope

- User accounts, login, or multi-user support
- Cloud sync or data export/import
- Push notifications or reminders
- AI-generated insights or mood detection from text
- Sharing entries with other users

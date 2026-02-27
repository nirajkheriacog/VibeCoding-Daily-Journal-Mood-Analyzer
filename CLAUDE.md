# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React + TypeScript web app for writing daily journal entries and manually tracking mood over time. Built with Vite, Tailwind CSS v4, Recharts, and React Router v7. All data is stored in localStorage — no backend.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — TypeScript check + production build
- `npm run test` — run tests in watch mode (Vitest)
- `npm run test:run` — run tests once
- `npm run lint` — run ESLint

## Architecture

- **State ownership**: `useEntries()` hook is called once in `Layout.tsx` and shared to all pages via React Router's `useOutletContext<EntriesContextType>()`
- **Data flow**: `storage.ts` (localStorage) → `useEntries` (CRUD + React state) → pages via Outlet context → components via props
- **Routing**: `createBrowserRouter` in `App.tsx` with `Layout` as root route. 5 routes: `/` (today), `/entries` (history), `/entries/:id` (detail), `/insights` (charts), `/chat` (Ask My Journal)
- **Mood config**: `constants.ts` holds `MOODS` record (emoji, label, color, score) and `MOOD_LIST` display order. Use inline `style` for mood colors — not dynamic Tailwind classes
- **Date handling**: `getLocalDateString()` in `constants.ts` produces YYYY-MM-DD in local timezone. Never use `toISOString().slice()` for local dates

## Ask My Journal (Chat Feature)

- **Fully local**: No API key or network calls. `journalAnalyzer.ts` uses pattern matching + statistical analysis over entries
- **Query routing**: `analyzeQuery()` matches user questions to handlers — patterns, happiest/worst days, anxiety triggers, weekly summary, mood-specific queries, keyword search fallback
- **Citations**: Responses include `[[cite:ENTRY_ID|DISPLAY_TEXT]]` markers. `parseChatContent.tsx` parses these into clickable `<CitationLink>` components linking to `/entries/:id`
- **Chat state**: Ephemeral (component state only, not persisted to localStorage)

## Key Constraints

- One journal entry per calendar day (enforced in TodayPage)
- Mood is always manually selected from 6 fixed options — no AI inference
- All data stays in the browser — no network calls, no API keys

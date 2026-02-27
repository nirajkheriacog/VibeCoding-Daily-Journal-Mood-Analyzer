# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A web application for writing daily journal entries and manually tracking mood over time. See [projectbrief.md](projectbrief.md) for full requirements. The key feature areas are:

- **Journal entries**: Create, save, and browse daily entries
- **Mood selection**: Predefined mood options attached to each entry
- **Mood visualization**: Charts/graphs showing mood trends over time
- **Privacy**: All data stays local to the user (no backend required unless added)

## Status

This project is not yet scaffolded. No framework, build tool, or package manager has been chosen. Before writing code, establish the tech stack and initialize the project.

## Architecture Expectations

When the project is built, it should follow these principles derived from the brief:

- **Local-first data**: Journal entries and mood data should be persisted in `localStorage` or IndexedDB unless a backend is explicitly added
- **Mood options**: Use a fixed set of predefined moods (e.g., happy, sad, anxious, calm, excited, neutral) — not free-text
- **Visualization**: Mood-over-time chart should be a core feature, not an afterthought — wire it up early to real data
- **Responsive**: Must work across different device sizes

## Commands

Once the project is initialized, update this section with the actual commands for:
- Running the dev server
- Building for production
- Running tests
- Linting

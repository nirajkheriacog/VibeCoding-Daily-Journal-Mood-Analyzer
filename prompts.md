# The Challenge: Daily Journal & Mood Analyzer App

## Init
/init

## Plan
Create a plan.md file for this project

## Requirements
create requirements.md which contains extracted and refined requirements

## Actual Implementation
Look at plan.md and create the application with the best practices and modern code standards

## Create mock data
Create mock historical data over a period of 2 weeks to be able see chart in insights tab


## Mission 5
Add following feature to the app
“Ask My Journal” chat:
   - Q&A over past entries with citations to dates/entries (“On Feb 12 you wrote…”)
   - Provide trends/patterns: triggers, recurring themes, best days, worst days

## Mission 6
Implement these features:
Add MCP tool integration for sentiment analysis (name: sentiment)
Add a hook: run lint after each file edit/write
Add a reusable Skill: /audit_accessibility (or /generate_mood_analysis_tests)
Document Plugin, Hook, Skill in prompts.md with “what + why”
Make changes in-repo and keep diffs clean.

---

## Claude Code Extensibility — What Was Added & Why

### 1. MCP Tool: `sentiment` (Plugin)

**What:** A local MCP (Model Context Protocol) server at `tools/sentiment-server.js` that provides a `sentiment` tool. It analyzes text and returns sentiment polarity (positive/negative/neutral/mixed), a numeric score from -1 to 1, and detected emotional keywords. Registered in `.mcp.json` so Claude Code discovers it automatically.

**Why:** Journal entries contain emotional language that the app's fixed 6-mood system can't fully capture. The sentiment tool gives Claude an objective, repeatable way to score the emotional tone of any entry text during conversations — useful for deeper analysis, comparing entries, or validating the manually-selected mood against the actual writing. It runs entirely locally with keyword-based scoring (no API calls), matching the app's privacy-first design.

**Files:** `tools/sentiment-server.js`, `.mcp.json`

### 2. Hook: Lint on Edit/Write

**What:** A Claude Code hook configured in `.claude/settings.json` that automatically runs ESLint on any file immediately after Claude edits or writes it. Uses the `PostToolUse` event with a matcher for `Edit|Write` tools.

**Why:** Without this, lint errors accumulate silently during a coding session and only surface at build time — often after many files have been changed. The hook provides instant feedback on every file modification, catching issues like unused variables, missing imports, or type errors right when they're introduced. This keeps the codebase clean throughout a session instead of requiring a separate lint-and-fix pass at the end.

**File:** `.claude/settings.json`

### 3. Skill: `/project:audit-accessibility`

**What:** A custom slash command at `.claude/commands/audit-accessibility.md` that instructs Claude to perform a full accessibility audit across all components and pages. It checks semantic HTML, ARIA attributes, keyboard navigation, focus management, color independence, and form accessibility — then reports findings grouped by severity (critical, warning, suggestion) with specific file paths and fix recommendations.

**Why:** The project's requirements (NFR-5) mandate accessibility compliance, but it's easy for issues to slip through during incremental development. This skill provides a one-command way to audit the entire codebase against WCAG standards at any point. It's reusable across sessions — any team member can run `/project:audit-accessibility` to get a current accessibility report without needing to remember what to check.

**File:** `.claude/commands/audit-accessibility.md`
Audit all components and pages in this project for accessibility compliance.

## Scope

Scan every file in `src/components/*.tsx` and `src/pages/*.tsx`.

## Checks

For each component, verify:

1. **Semantic HTML** — Headings use `<h1>`–`<h6>` in correct hierarchy. Lists use `<ul>`/`<ol>`/`<li>`. Buttons are `<button>`, not `<div onClick>`. Forms use `<form>`, `<label>`, `<fieldset>`.
2. **ARIA attributes** — Interactive elements have appropriate `role`, `aria-label`, `aria-checked`, `aria-modal`, `aria-labelledby`, `aria-describedby` where needed.
3. **Keyboard navigation** — All interactive elements are focusable. Modals trap focus. Escape key closes dialogs. Enter/Space activate buttons.
4. **Focus management** — Focus indicators are visible (`focus:ring-*` or `focus:outline-*`). Focus moves logically after navigation events.
5. **Color independence** — Mood information is never conveyed by color alone (emoji + label always accompanies color). Text has sufficient contrast.
6. **Alt text** — All decorative icons use `aria-hidden="true"`. Meaningful images/icons have `aria-label` or `alt` text.
7. **Form accessibility** — All inputs have associated `<label>` elements (via `htmlFor`/`id`). Required fields are indicated. Validation errors are announced.

## Cross-reference

Compare findings against the accessibility requirements in `requirements.md` (section NFR-5).

## Output format

Group findings by severity:
- **Critical** — Blocks keyboard-only or screen reader users
- **Warning** — Degrades experience but doesn't block usage
- **Suggestion** — Best-practice improvement

For each finding, include:
- File path and line number
- What the issue is
- How to fix it (specific code change)

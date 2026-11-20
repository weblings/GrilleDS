---
name: ui-lessons
description: Known Grille UI gotchas (React Aria focus/ARIA/popups/events/test queries; CSS cascade, specificity, shared tokens, focus rings) — check before adding or changing a component or its styles.
allowed-tools: Read, Grep, Glob
---

# UI lessons: components and CSS tokens

Before building or editing a Grille component, its styles, or its tests, check these lessons.

Lesson files this skill covers:

- [`docs/lessons/components.md`](../../../docs/lessons/components.md) — focus, ARIA, popups, events, test queries
- [`docs/lessons/css-tokens.md`](../../../docs/lessons/css-tokens.md) — cascade, specificity, shared tokens, focus rings

## How to use this skill

1. Skim the covered file(s) by headline: `grep -n '^## ' <file>`.
2. Grep `Tags:` and `Applies-when:` for the task at hand (e.g. `grep -n -A1 '^Tags:.*focus' <file>`)
   and read only the matching entries in full before proceeding. Don't skip this because the task
   "seems simple" — these gotchas often fail silently.
3. If you hit a new gotcha not covered, file it per [`docs/lessons/README.md`](../../../docs/lessons/README.md)
   (entry format, Tags/Applies-when contract, which file it belongs in). Keep entries tight.

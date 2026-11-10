---
name: engineering-hygiene-lessons
description: Grille verification and workflow habits, library-vs-consumer boundaries — check before verifying, handing off, or closing work that isn't about one component.
allowed-tools: Read, Grep, Glob
---

# Engineering hygiene lessons

Before verifying a change, handing off work, or deciding where a library/consumer boundary sits, check these lessons.

Lesson files this skill covers:

- [`docs/lessons/engineering-hygiene.md`](../../../docs/lessons/engineering-hygiene.md) — verification, workflow, boundaries

## How to use this skill

1. Skim the covered file(s) by headline: `grep -n '^## ' <file>`.
2. Grep `Tags:` and `Applies-when:` for the task at hand (e.g. `grep -n -A1 '^Tags:.*focus' <file>`)
   and read only the matching entries in full before proceeding. Don't skip this because the task
   "seems simple" — these gotchas often fail silently.
3. If you hit a new gotcha not covered, file it per [`docs/lessons/README.md`](../../../docs/lessons/README.md)
   (entry format, Tags/Applies-when contract, which file it belongs in). Keep entries tight.

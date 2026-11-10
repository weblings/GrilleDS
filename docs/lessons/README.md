# Lessons learned — index and filing rules

Gotchas, non-obvious findings, and hard-won decisions that aren't obvious from reading the code or
planning docs. Add here whenever something costs more than 30 minutes to diagnose.

**This directory is the only lessons-learned location in the repo.** Don't start a new
LessonsLearned elsewhere; if unsure whether one already exists, `find . -iname "*lesson*"` first.

## Index

| File | Scope | Entries | File here when |
|---|---|---|---|

Counts as of 2026-11-10. Bump the count when adding entries (`grep -c '^## '` per file). Rows are
added as lesson files are seeded (Grille-x08.4).

## Where a new lesson goes

1. About an agent's own verification/reliability habits, specific to this clone, not code/design?
   → `bd remember`, not the repo.
2. Otherwise → the lesson file whose scope row above matches; if none fits, add a file and a row.
3. Cross-cutting entry? File under whichever system *constrains the fix*, not whichever exhibited
   the symptom.
4. Destination file too long to skim (rough proxy: 15+ entries)? Split along a finer cut of the same
   activity, into a new sibling file, then update this index and any entry or comment that pointed
   at the old filename.

## Entry format

A `##` headline stating the general, reusable principle, immediately followed by `Tags:` and
`Applies-when:` lines (the retrieval contract), then a short root-cause paragraph and a bolded
**Fix:** (or **How to apply:**) line.

Cite entries by headline, never by filename — headlines survive splits, filenames don't.

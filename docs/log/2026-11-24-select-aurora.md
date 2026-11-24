# Select matches Aurora's Dropdown

Id: 2026-11-24-select-aurora

`Grille-0u5.3`, part of the Aurora dashboard and NUX controls epic (`Grille-0u5`, Aurora ask `Aurora-4nqt.5`).

`Select` (`src/Select.tsx`) gains `{id, label}` options, `isDisabled` and `fullWidth`.

- `options` is `(string | SelectOption)[]`. A string is shown and returned. `{id, label}` shows the label and returns the id.
  Existing `string[]` callers need no change. `SelectOption` is exported.
- `isDisabled` disables the trigger and dims it like a disabled `Button`.
- `fullWidth` stretches the trigger across the control column, chevron at the right edge (`data-full-width` on `.ui-select`).
- The commit rule (onChange only for a choice in the open list) is unchanged and already matches Aurora. No typeahead.

Fixtures `id and label options`, `disabled`, `full width` added.

## Open

- Layout not yet checked in a browser (`npm run review`).
- Dev prerelease for Aurora is held with the rest of the epic. The bead stays open until then.

## Verification

- Select tests (9) pass, `npx tsc --noEmit` and `npm run lint:boundary` pass. Full suite (197) passes.
- New tests: id/label shows label and returns id, disabled blocks opening and onChange, full-width marker.

## Lessons

- none

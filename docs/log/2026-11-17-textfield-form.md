# TextField: label-less form, multi-line form

Id: 2026-11-17-textfield-form

`Grille-83g.2`, `Grille-83g.11`. `TextField` takes `aria-label` instead of a visible `label` (typed as a union that
requires one), plus `placeholder`, `autoFocus`, `isInvalid` (aria-invalid and an inset error-coloured border) and
`aria-describedby` (the caller passes the error message's id, the field does not look for it). It fills its
container by default (`.ui-text-field > .ui-text-input`). Inside a `FieldList` a more specific rule reverts the
input's width, min-width, box-sizing and justify-self, so the existing Fields fixtures keep their layout.
`multiline` renders React Aria's `TextArea` (`rows`, default 3, vertical resize only) with the same classes, so
label, hover, focus ring and invalid styling match. Invalid uses an inset box-shadow so no border width shifts layout.

Fixtures: "TextField in a Dialog" and "TextField, multi-line in a Dialog" (`src/TextField.fixture.tsx`). Tests:
`src/ui.test.tsx` (aria-label form, textarea form, axe without a visible label).

## Verification

- `npm run build`, `npm run typecheck`, `npm run lint` and `npx vitest run` (168) pass. The fixtures use a real error MessageRow.
- Not checked: the fixture in Cosmos by eye. Not yet released: v0.1.0-dev.17 ships it.

## Follow-up

- The fill default stretched the bare TextFields in the Drawer fixtures (no FieldList, already so on `dev`); the
  branch review page showed it. They are now in a FieldList, the house layout. Aurora's only bare use is NameDialog,
  where filling is wanted.

## Lessons

- A new layout default changes every placement outside its usual container, so check each one (engineering-hygiene)

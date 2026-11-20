# Autocomplete search field fills its container

Id: 2026-11-11-autocomplete-field-width

`Grille-uqg.2`. In a fixed-width container (Aurora's 340px Add node menu) the Autocomplete's search
input overflowed. `SearchField` gives its `<input>` `size={40}`, and the grid's `1fr` column has an
automatic minimum, so the input's intrinsic width plus the label column exceeded the container.
`src/styles/ui.css` now scopes two rules under `.ui-autocomplete`: the column is
`max-content minmax(0, 1fr)` and the input is `justify-self: stretch; min-width: 0`. A standalone
`SearchField` is unchanged.

## Verification

- `npm run lint`, `npx tsc --noEmit` and `npx vitest run` (136) pass. jsdom does no layout, so there
  is no unit test. Not checked in a real browser: open the Cosmos fixture "in a 340px container" in
  `src/Autocomplete.fixture.tsx` and confirm the field stays inside the dashed outline.

## Lessons

- A grid `1fr` column holding a sized `<input>` overflows its container (css-tokens.md)

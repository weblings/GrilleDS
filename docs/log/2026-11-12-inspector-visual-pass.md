# Inspector visual pass

Id: 2026-11-12-inspector-visual-pass

`Grille-e5t.9`. The inspector toggle, panel and hover outline were light-mode literals; they now use
a neutral dark palette (still literals on purpose, so the overlay stays readable whatever tokens or
theme the fixture shows) that matches the Cosmos shell. One button style for both states, only the
label changes (`aria-pressed` carries the state). The first pass used a blue accent that exists
nowhere in Grille's grey palette; replaced with light neutral grey. Red/green stay for flagged/OK.
Stretch goal: value previews in the panel (`Preview` in `viewer/Inspector.tsx`): colour swatch on a
checkerboard, bars for padding and gap, a rounded square for radius, "Aa" for font-size, a line for
border and outline width. Not done: the token-grid squares from the Tokens page.

## Verification

- Typecheck and `vitest run viewer` pass. Not checked by eye in Cosmos by me; the light hover tint
  may be faint on light fixtures (the 2px outline should still show).

## Lessons

- none

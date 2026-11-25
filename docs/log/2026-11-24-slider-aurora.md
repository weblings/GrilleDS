# Slider matches Aurora's Tuning sliders

Id: 2026-11-24-slider-aurora

`Grille-0u5.2`, part of the Aurora dashboard and NUX controls epic (`Grille-0u5`, Aurora ask `Aurora-4nqt.5`).

`Slider` (`src/Slider.tsx`) gains `onChangeEnd` and `fullWidth`. `value` still follows `onChange`, so the thumb tracks the user.

- `onChangeEnd` fires once per gesture. Pointer drag ends once at release. React Aria ends a keyboard gesture on every
  key repeat, so the end is held until key up or `focusout`. Native listeners on the slider root do this because
  `AriaSlider` takes no key handlers.
- `fullWidth` gives a header row (bold 700 label left, value right), the track 10px below (`--ui-size-space-lg`),
  an 8px track at 100% width, and a 16px thumb. The default stays 4px and `--ui-size-slider-track-width`.
- Colours for all sliders: track `--ui-color-control-bg`, fill `--ui-color-strong-bg`, thumb `--ui-color-text-default`.
  No new tokens. The bar thickness is a `--ui-slider-bar` custom property.

Fixture `Slider, full width` added.

## Open

- Layout and colours not yet checked in a browser (`npm run review`).
- Dev prerelease for Aurora is held with the rest of the epic. The bead stays open until then.

## Verification

- `npx vitest run` (194), `npx tsc --noEmit` and `npm run lint` pass.
- New tests: tap gives 1 end, held key gives 1 end on release, blur flushes a held key, pointer drag gives 1 end,
  full-width header layout.
- A separate `userEvent.keyboard` call does not carry held keys, so the held-key test uses `userEvent.setup()`.

## Lessons

- none

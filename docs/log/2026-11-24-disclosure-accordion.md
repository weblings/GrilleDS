# Disclosure accordion variant and controlled use

Id: 2026-11-24-disclosure-accordion

`Grille-0u5.4`, part of the Aurora dashboard and NUX controls epic (`Grille-0u5`, Aurora ask `Aurora-4nqt.5`).

`Disclosure` (`src/Disclosure.tsx`) gains `variant`, `isExpanded`, `defaultExpanded` and `onExpandedChange`.

- `variant="accordion"` is a header pill matching Aurora's `.accordion-header`: surface fill, 8px radius, 12px by 21px padding, 14px white text, trailing chevron that flips when open.
- The pill overhangs its column by 21px a side (as Aurora does), so the parent needs that much room. `--ui-disclosure-overhang` (default 21px) sets it, so a consumer can shrink it on narrow screens (Aurora uses 6px under 650px).
- Expansion props pass straight through to React Aria. Collapsed content stays mounted (`hidden="until-found"`).
- Default `link` variant is unchanged.

Fixtures `accordion closed`, `accordion open`, `accordion driven from outside` added.

## Open

- Aurora's own narrow-viewport media query is left to the consumer through the custom property.
- Dev prerelease for Aurora is held with the rest of the epic. The bead stays open until then.

## Verification

- `npm run review` screenshots: pill 320px wide in a 278px column, text starts 21px in, 8px radius, chevron flips. Link-variant diff vs main is the earlier icon-chevron change, not this work.
- Full suite (198), `npx tsc --noEmit` and lint pass. New test: controlled open from outside, panel mounted while closed.

## Lessons

- none

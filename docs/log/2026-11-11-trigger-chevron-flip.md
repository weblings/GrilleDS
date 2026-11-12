# Open dropdown triggers flip their chevron

Id: 2026-11-11-trigger-chevron-flip

`Grille-uqg.6`. `Icon` tags `chevronDownIcon` with `data-chevron`; `ui.css` rotates it 180deg when its
parent has `aria-expanded="true"`. `Select` gets it unchanged, and any consumer trigger gets it by
setting the attribute and putting the icon directly inside the button. Documented in README
("Dropdown triggers"). Cosmos fixture "Trigger chevron states" in `src/Popup.fixture.tsx`.

## Verification

- New test in `src/ui.test.tsx` checks the marker on Select and on a plain expanded Button. jsdom
  has no CSS, so the rotation itself is not asserted and not checked in a browser.

## Lessons

- none

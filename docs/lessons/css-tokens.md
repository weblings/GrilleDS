# CSS and token lessons

Cascade, specificity, layering and shared tokens in Grille's styles. Seeded from Aurora and
RockyRoad. See [`README.md`](README.md) for filing rules.

---

## Focus rings come from shared tokens and one `:focus-visible` rule, so new controls need no ring CSS
Tags: focus, tokens, a11y, focus-visible
Applies-when: styling keyboard focus on a new control

Shared ring-width, offset and color tokens plus one `:focus-visible` rule give every control the
same outer ring. Before that, a single control had a ring and the rest showed the browser `auto`
ring, so new controls looked unrelated. `outline: none` on focus fails WCAG 2.4.7.

**Fix:** add no per-control ring. Inset it (`outline-offset: calc(-1 * width)`) on anything inside a
clipping container (list rows, menu items, segmented buttons), and put it on the row wrapper via
`:has()` when the focusable control is the row's inner element. A listbox whose active option is the
indicator keeps `outline: none`.

Origin: Aurora layout-css.md — Focus rings come from shared tokens and one :focus-visible rule in tokens.css, so new controls need no ring CSS of their own.

---

## Moving a scoped reset into a later-loaded stylesheet raises its precedence; wrap the scope in `:where()`
Tags: cascade, specificity, reset, load-order
Applies-when: relocating a `*` reset (or any low-precedence base rule) to another stylesheet, or scoping one under a class

`.scope *` scores (0,1,0), equal to single-class component rules, so loaded later it zeroed every
component's padding and margin. A bare `*` at (0,0,0) can never win, which is why it worked
before. Rule-content tests and byte-identity checks stayed green.

**Fix:** `:where(.scope) *` keeps the scope at zero specificity. For any CSS move or rescope,
compare a screenshot against the commit before the change; tests that read rule contents don't see
cascade order.

Origin: Aurora layout-css.md — Moving a scoped reset into a later-loaded stylesheet raises its precedence -- wrap the scope in `:where()`.

---

## A shared base class only wins over rules that come before it
Tags: cascade, shared-classes, specificity, source-order
Applies-when: moving per-screen styles onto a shared class such as `.btn`

Single-class selectors tie on specificity, so a consumer rule that sets `padding` or `font-size`
overrides the shared class only if it appears later. A shared `inline-flex` base also needs
`display: flex` for a full-width variant to sit on its own line.

**Fix:** keep the shared block first, leave only layout (position, width, margins) in the
consumer's classes, remove old color/size declarations rather than overriding them, and grep for the
old class before deleting it.

Origin: RockyRoad desktop-dom.md — A shared .btn base only wins over screen rules that come before it.

---

## A child-combinator selector must match where a component actually inserts itself
Tags: selectors, flexbox, components, dom-structure
Applies-when: writing a `>` selector against a reusable component's root class

A component that appends its root into the container it is given may be handed a slot div, not
the parent the call site implies. `.row > .component` then matches nothing, and the component's
base rule (`flex: 0 0 auto`) wins silently.

**Fix:** inspect the real resulting DOM; put the sizing class on the actual direct child (the slot)
and let the component fill it.

Origin: RockyRoad desktop-dom.md — A CSS child-combinator selector has to match where a component actually inserts itself, not where it's called from.

---

## An Icon is `display: block`, so any container that isn't flex stacks it under the label
Tags: icon, flex, button, layout
Applies-when: putting an `Icon` next to text inside a button, title or link

`.ui-icon` is a block so the overhang margin works. Inside an inline-block `.ui-button` or a plain `<strong>`
it breaks onto its own line. The Select trigger looked right only because it was already flex, which hid the
problem until the Popup trigger, Disclosure and Callout hit it.

**Fix:** make the container a flex row (`display: inline-flex; align-items: center; gap`). `.ui-button` now
does this for every button; give any other icon-plus-text container the same.

---

## An icon drawn edge to edge must opt out of the overhang or it renders oversized
Tags: icon, overhang, sizing, tokens
Applies-when: adding an icon whose artwork fills its viewBox (no built-in padding)

The overhang rule draws every glyph at box + 2x overhang (24px at md) and pulls it back with a negative margin.
That equals the visual weight of padded grids (Vidstack 32, Zest 24). Aurora's own warning mark (34x29, no
padding, since replaced by Zest's) came out 24px wide beside about 13px text and looked huge.

**Fix:** set `tight: true` on the `IconData`. `Icon` emits `data-tight` and `.ui-icon[data-tight]` takes the
layout box with no overhang or margin. No shipped icon uses it today; the flag stays for the next unpadded
artwork. Check any new icon by rendering it beside text at both sizes.

Origin: Grille-ky2.4, found in review of the Callout.

---

## An icon beside text needs the layout box and a cap-height offset, not the overhang or flex centring
Tags: icon, text, alignment, baseline, flex
Applies-when: placing an `Icon` inline with a label, title or status text

Two things make an icon look off next to text. The overhang draws it about 4px past each side, so at 13-16px text it is
taller than the line. And flex `align-items: center` or `flex-start` centres the box on the line, not on the capitals,
so the icon sits 1-2px high. Flex also ignores an SVG's margins when it finds a baseline (it uses the border box), so
a margin offset does nothing.

**Fix:** give the icon the layout box with no overhang, set the container to `align-items: baseline`, and
`translate: 0 calc(var(--ui-icon-box) / 2 - 0.36em)` so its centre meets the middle of the capitals (0.36em ~ Inter's
cap-height centre). In `ui.css` this is the `.ui-callout-title > .ui-icon, .ui-status-message > .ui-icon` rule. Measure
with a canvas `measureText('E')` cap height against the path's bounding box, not by eye; a headless browser without Inter
falls back to a similar font, so confirm in Cosmos.

Origin: Grille-ky2.4, owner review of Callout and StatusMessage.

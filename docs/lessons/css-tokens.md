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

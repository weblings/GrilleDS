# Engineering hygiene lessons

Verification and workflow habits that apply across the library. Seeded from RockyRoadImport. See
[`README.md`](README.md) for filing rules.

---

## Tests and a clean build don't prove correctness against real content
Tags: testing, fixtures, real-consumers
Applies-when: verifying a change to behavior a consumer depends on

Synthetic unit tests and a clean `tsc`/build all passed while one real input surfaced three
separate bugs no fixture exercised.

**Fix:** before calling a change done, run it against at least one real consumer (Aurora, or a
Cosmos fixture with real content) and check the actual downstream output, not just that types check
and hand-written fixtures pass.

Origin: RockyRoadImport engineering-hygiene.md — Tests and a clean build don't prove correctness against real content.

---

## A generated export is also the recovery path when its tool is unavailable
Tags: beads, workflow, recovery
Applies-when: updating beads without a working `bd` CLI

`.beads/issues.jsonl` is written by `bd export` yet also read by `bd import`, so it round-trips.

**Fix:** hand-edit it, keeping counts and id suffixes consistent, then
`bd import && bd export -o .beads/issues.jsonl` and review the `git diff`.

Origin: RockyRoadImport engineering-hygiene.md — A generated export is also the recovery path when its tool is unavailable.

---

## A library fix can change behavior a consumer's patch got right
Tags: upstream, consumers, upgrade
Applies-when: a consumer retires its local workaround because a Grille release "fixes the same thing"

A release that fixed the reported case passed every test yet changed behavior the consumer's
workaround handled (here: an upstream dynamics fix moved ~23 notes to the wrong value across 4 sweep
files). Green tests cover only what the patch was written for.

**Fix:** before telling a consumer to drop a workaround, diff its real output old-vs-new, and note
behavior changes in the release notes.

Origin: RockyRoadImport upstream-dependencies.md — An upstream fix for your patch can change behavior your patch got right.

---

## When the input can't distinguish two intents, keep the guess in the consumer
Tags: upstream, semantics, api-design
Applies-when: a consumer asks the library to guess "what the author meant"

Two inputs encoded identically but meaning different things, so no library rule fit both. The
dependency stayed spec-literal and the interpretation lived in the consumer, where it could be
tuned without upstream buy-in (the maintainer later made the call themselves: file the symptom, not
the semantics).

**Fix:** keep Grille components literal and predictable; let the consumer own heuristics about
intent.

Origin: RockyRoadImport upstream-dependencies.md — Same encoding, different intent: keep the guess in the consumer.

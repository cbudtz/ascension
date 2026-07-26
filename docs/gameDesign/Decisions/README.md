# Game-design decision records

Use these records only for player-facing mechanics and experience decisions. Technical and architectural choices belong in the [technical decision records](../../development/Decisions/README.md).

## Naming and status

Name records `NNN-kebab-case-title.md` with the next available three-digit number. Copy [`000-template.md`](000-template.md), rename it, and replace its instructional placeholders.

Allowed statuses are `Proposed`, `Accepted`, `Superseded`, and `Rejected`.

## Lifecycle

- A quiz or other exploration may produce a `Proposed` record only after a coherent option exists.
- `Accepted` means the decision was explicitly reviewed.
- Once accepted, decision content and reasoning are immutable; only status and supersession metadata may be updated.
- Replacing an accepted decision requires a new record, with the old and new records linked in both directions through `Supersedes` and `Superseded by`.
- Every decision must define falsifiable validation through a prototype, playtest, or metric.

## Current state

There are no accepted gameplay decisions yet. Fixed hex terrain and adjacency, and the research tree, remain exploratory ideas rather than decisions.

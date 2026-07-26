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

Eight **Proposed** records and the [planetary slice spec](../../superpowers/specs/2026-07-26-planetary-slice-design.md) capture the homeworld vertical slice. None are **Accepted** until explicitly reviewed.

| Record                                                | Topic                                            |
| ----------------------------------------------------- | ------------------------------------------------ |
| [001](001-planetary-slice-scope.md)                   | Slice scope, milestone victory, deferred systems |
| [002](002-homeworld-hex-map.md)                       | 37-hex revealed homeworld, terrain bonuses       |
| [003](003-worker-economy-and-capital.md)              | Capital baseline, 3 workers, R/I/P tracks        |
| [004](004-prosperity-growth-pool.md)                  | Prosperity pool, Farms, population growth        |
| [005](005-construction-and-industry-pacing.md)        | Queue, 5 industry cost, 2-turn first build       |
| [006](006-civ-style-research-tree.md)                 | Civ-style tree, eight techs, proposed names      |
| [007](007-solar-system-teaser.md)                     | Orbital Cartography, locked planets              |
| [008](008-ascendancy-inspired-2d-hex-presentation.md) | 2D hex art direction                             |

Adjacency synergies and interstellar travel remain future tech branches (`Ecological Synergy`, `Star Lane Anatomy`).

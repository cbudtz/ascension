# 001: Planetary slice scope and victory

- Status: Proposed
- Date: 2026-07-26
- Supersedes: None
- Superseded by: None

## Context

The project needs a first playable that proves the Ascendancy-inspired planetary loop without ship design, colonization, or diplomacy. Exploration of space should tease later scope without implementing travel.

## Decision

Slice 1 is a single homeworld with discrete turn-based days. The player wins by constructing a **Factory**, a **Lab**, and a **Farm**. The capital alone provides baseline R/I/P; there are no separate starting structures. An early research unlock opens a **solar system view** (sun, homeworld, locked planets only). Adjacency synergies, rich terrain, and interstellar play are deferred.

## Alternatives

- **Sandbox only:** rejected; a milestone gives agents and playtests a clear done condition.
- **Defer all space UI:** rejected; the design calls for an early orbital teaser.
- **Include ship design in slice 1:** rejected; too large for the first vertical slice.

## Consequences

- Implementation can focus on one planet scene plus one system scene.
- Content authoring targets one 37-hex map and eight visible tech nodes.
- PRs can be reviewed against a single milestone.

## Validation

A playtest completes Factory, Lab, and Farm on the homeworld, unlocks solar system view, and never requires ships or second colonies. Failure if players cannot reach the milestone within a reasonable turn count (~15–25) without debug cheats.

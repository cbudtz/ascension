# 007: Solar system teaser view

- Status: Proposed
- Date: 2026-07-26
- Supersedes: None
- Superseded by: None

## Context

Space exploration should arrive early in the player’s mental model, but slice 1 does not implement ships or colonization.

## Decision

Completing **Orbital Cartography** unlocks a **solar system view** only:

- Central **star**
- **Homeworld** — clickable, returns to planet view
- **Additional planets** — visible but **locked** (placeholders for future colonization)

No ships, star lanes, or transfer actions in slice 1.

## Alternatives

- **Homeworld-only orbital view:** rejected; locked planets sell the larger game.
- **Full galaxy:** rejected; scope too large.
- **Colonize one world in slice 1:** deferred.

## Consequences

- Second Phaser scene (or mode) for system view.
- Art needs inactive planet sprites and clear locked state.

## Validation

After unlocking the tech, player opens system view, returns to homeworld, and cannot interact with locked bodies. No ship UI appears.

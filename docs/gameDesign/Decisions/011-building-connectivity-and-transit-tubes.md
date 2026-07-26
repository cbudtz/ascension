# 011: Building connectivity and Transit Tubes

- Status: Accepted
- Date: 2026-07-26
- Supersedes: None
- Superseded by: None

## Context

Bonus hexes away from the capital should require infrastructure investment. Ascendancy-style transit tubes let the colony extend its footprint without granting production.

## Decision

### Connectivity

- From **turn 1**, every new building must be placed on a hex that **shares an edge** with the **capital** or with an **already completed** connected building.
- Incomplete (queued) buildings do **not** extend connectivity until completed.
- The capital hex is the root of the connected set.

### Transit Tubes (technology)

- **Root technology**, available from the start of the researchable set (after science unlock).
- **Research cost: 3 RP**.
- Unlocks the **Transit Tube** building blueprint.

### Transit Tube (building)

- **Industry cost: 2**.
- **No** research, industry, or prosperity effect.
- **Does not** participate in worker/building matching bonuses.
- **Does** extend connectivity so later Factory / Lab / Farm / tube placements can reach farther bonus hexes.
- Occupies one hex like any other building; subject to one-building-per-hex and capital-hex rules.

### Milestone buildings

Factory, Lab, and Farm still require their blueprint technologies. Tubes never substitute for those blueprints or for milestone victory.

## Alternatives

- Free placement until a late connectivity tech: rejected; user chose turn-1 connectivity.
- Tubes grant tiny production: rejected; keep them pure connectors.
- Tube cost 5: rejected; connectors must stay cheap versus milestone buildings.

## Consequences

- Homeworld map layout should place some strong bonus hexes more than one step from the capital so tubes matter.
- Tech tree gains a fifth early root: Transit Tubes (3 RP) alongside Colony Planning (3 RP).
- Core validation rejects disconnected placements with a typed error.

## Validation

Tests: cannot place a Factory two hexes from capital with an empty gap; can place after a completed tube bridges the gap; tube completion does not change R/I/P rates; tube costs 2 industry and tech costs 3 RP.

# 009: Research costs and capital baseline

- Status: Proposed
- Date: 2026-07-26
- Supersedes: None
- Superseded by: None

## Context

Research pacing must stay in step with the 5-industry construction loop. Costs should be easy to remember and keep Orbital Cartography near the first milestone building without finishing the whole tree.

## Decision

**Capital baseline (each turn, before workers):**

- **+1 research**
- **+1 industry**
- **+0 prosperity** until the first Farm exists

**Research point costs:**

| Tier          | Technologies                                                          | RP cost                           |
| ------------- | --------------------------------------------------------------------- | --------------------------------- |
| Root          | Colony Planning                                                       | **3**                             |
| Building      | Industrial Foundations, Research Methods, Environmental Encapsulation | **5 each**                        |
| Space         | Orbital Cartography                                                   | **7**                             |
| Locked leaves | Star Lane Anatomy, Xenobiological Dig, Mass Fabrication               | **12+** (display only in slice 1) |

**Building bonuses when constructed:** Lab **+1 research**, Factory **+1 industry**, Farm **+1 prosperity** (in addition to worker rules in decision 003).

Rhyme: **5 RP** to unlock a building type, **5 industry** to construct it.

With default **1/1/1** workers after Colony Planning, effective research is **2 RP/turn** (1 worker + capital). Colony Planning completes in ~2 turns; a building tech in ~3; Orbital Cartography in ~4, landing around when the first milestone structure finishes if the player alternates research and construction.

## Alternatives

- **Equal 5 RP for all techs:** rejected; Orbital arrives too early relative to building.
- **10+ RP for building techs:** rejected; tree lags behind industry.
- **No capital baseline:** rejected; turn 1 feels inert before worker focus unlocks.

## Consequences

- Content defines `researchCost` per technology.
- Balance tests use capital baseline + worker output together.
- UI should show capital contribution separately from worker contribution when teaching the economy.

## Validation

Deterministic tests: at 2 RP/turn, Colony Planning completes on turn 2; at 3 industry/turn focused, first 5-industry building completes on turn 2. Playtest: median time to first building + Orbital unlock within ~8–12 turns without cheats.

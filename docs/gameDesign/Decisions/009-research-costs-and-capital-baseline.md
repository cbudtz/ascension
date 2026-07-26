# 009: Research costs and capital baseline

- Status: Accepted
- Date: 2026-07-26
- Supersedes: None
- Superseded by: None

## Context

Research pacing must stay in step with the 5-industry construction loop. Costs should be easy to remember and keep Orbital Cartography near the first milestone building without finishing the whole tree.

## Decision

**Capital baseline (each turn, before workers):**

- **+1 research**
- **+1 industry**
- **+1 prosperity**

Worker matching, capital free slot, and excess half-rates are defined in decision 010 (010 wins if this record conflicts).

**Research point costs:**

| Tier          | Technologies                                                          | RP cost                           |
| ------------- | --------------------------------------------------------------------- | --------------------------------- |
| Root          | Colony Planning, Transit Tubes                                        | **3 each**                        |
| Building      | Industrial Foundations, Research Methods, Environmental Encapsulation | **5 each**                        |
| Space         | Orbital Cartography                                                   | **7**                             |
| Locked leaves | Star Lane Anatomy, Xenobiological Dig, Mass Fabrication               | **12+** (display only in slice 1) |

**Building bonuses when constructed:** Lab / Factory / Farm contribute through the matching rules in decision 010 (full +1 when matched; +0.5 when excess).

Rhyme: **5 RP** to unlock a building type, **5 industry** to construct it.

No tech is active at start. After round 1, science unlocks and banked turn-1 RP applies to the selected tech. With default **1/1/1** after Colony Planning, effective research is capital +1 plus one capital-matched research worker (+1) unless a Lab adds more.

## Alternatives

- **Equal 5 RP for all techs:** rejected; Orbital arrives too early relative to building.
- **10+ RP for building techs:** rejected; tree lags behind industry.
- **No capital baseline:** rejected; turn 1 feels inert before worker focus unlocks.

## Consequences

- Content defines `researchCost` per technology.
- Balance tests use capital baseline + worker output together.
- UI should show capital contribution separately from worker contribution when teaching the economy.

## Validation

Deterministic tests: at 2 RP/turn after selection, Colony Planning completes on turn 2 of research; focused industry without Factory yields 3 industry/turn and finishes a 5-cost build in 2 turns (see decision 010). Playtest: median time to first building + Orbital unlock within ~8–12 turns without cheats.

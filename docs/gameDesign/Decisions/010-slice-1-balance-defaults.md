# 010: Slice-1 balance defaults and rule clarifications

- Status: Proposed
- Date: 2026-07-26
- Supersedes: None
- Superseded by: None

## Context

Spec review found contradictions and missing rules. A design quiz locked the slice-1 defaults below.

## Decision

### Capital baseline

Each turn the capital provides:

- **+1 research**
- **+1 industry**
- **+1 prosperity**

### Capital free worker slot

Per track, the capital provides **1 free matched worker slot**:

- The first worker on a track counts as **matched** even with **0** track buildings and contributes **+1**.
- Starting **1 / 1 / 1** is fully efficient and incentivizes early balance.
- Further workers without a matching building are **excess** at **+0.5** each.

### Matched pairs (workers and buildings)

On each track (research / industry / farming):

1. `freeCapitalSlots = 1` (capital).
2. `effectiveBuildingSlots = buildings + freeCapitalSlots` for matching workers only; building bonuses still require real buildings.
3. Practical resolution used by the game:

- Let `matchedBuildings = min(workers, buildings)`.
- **Matched workers** (up to `buildings`) contribute **+1** each.
- **Capital-matched worker:** if `workers > buildings`, the next worker (at most one) is capital-matched at **+1**.
- Any remaining workers are **excess** at **+0.5** each.
- **Matched buildings** contribute **+1** each.
- **Excess buildings** (`buildings - matchedBuildings`) contribute **+0.5** each.

Examples (ignore terrain; add capital baseline separately):

| Workers | Buildings | Worker output   | Building output |
| ------- | --------- | --------------- | --------------- |
| 1       | 0         | 1 (capital)     | 0               |
| 3       | 0         | 1 + 0.5 + 0.5   | 0               |
| 1       | 1         | 1               | 1               |
| 2       | 1         | 1 + 1 (capital) | 1               |
| 1       | 2         | 1               | 1 + 0.5         |

### First-building industry math

After Colony Planning, **3 workers on industry**, no Factory:

- workers: **1 + 0.5 + 0.5 = 2**
- capital baseline: **+1**
- total industry/turn: **3**
- first tier-1 building costs **5** → completes on **turn 2** of focused construction (3 + 3 ≥ 5)

### Terrain bonuses

- Neutral hexes: **buildable**, **+0** terrain.
- Research / Industry / Prosperity hexes: when a **matching** building occupies the hex, add **+1** to that track.
- Mismatched buildings get **no** terrain bonus.
- Capital hex is **permanent capital** (not a normal build tile). Capital **upgrades** may come later; the hex remains a capital slot.

### Prosperity

- Threshold for **+1 worker**: **10**.
- On reach: add 1 worker, subtract 10, keep overflow.
- Pre-Farm: capital + farming workers fill the pool normally; “slow until Farm” means no Farm building bonus yet.
- First matched Farm adds building **+1** (plus terrain if on a prosperity hex).

### Research selection

- **No active technology** at game start.
- After the **first round** (first end-turn), science selection unlocks.
- **Turn-1 research is banked** and applies when the player selects a tech.
- Root costs stay **Colony Planning 3**, building blueprints **5** each; Orbital Cartography **7**.

### Construction queue

- Exactly **one** active construction project.
- The player may leave a building unfinished and return later; **progress is preserved** (same idea as research switching).

### Locked technologies

Xenobiological Dig, Star Lane Anatomy, and Mass Fabrication are **visible and greyed** with UI copy that they require a future update. They are **not researchable** in slice 1 even if prerequisites are met.

## Alternatives

- Understaffing that zeroes unmatched workers: rejected; capital free slot teaches opening balance.
- Equal 2 RP roots: rejected; keep 3/5/5/5 vs Orbital 7.
- Hidden locked techs: rejected; grey + “future update” sells the larger game.

## Consequences

- Content and core tests use these exact numbers and matching rules.
- Decisions 003, 005, and 009 are read together with this record; where they conflict, **this record wins** for slice 1.

## Validation

Unit tests encode capital +1/+1/+1; capital free slot; excess workers at 0.5; 3 industry/turn focused without Factory → 5-cost build in 2 turns; terrain +1 on match; prosperity threshold 10; banked turn-1 RP; unfinished build progress retained; locked techs reject research with future-update messaging.

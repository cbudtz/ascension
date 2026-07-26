# 004: Prosperity pool and population growth

- Status: Accepted
- Date: 2026-07-26
- Supersedes: None
- Superseded by: None

## Context

Prosperity must connect farming workers and Farm structures to population growth without overwhelming a three-worker start.

## Decision

- Prosperity accumulates in a **pool** each turn from farming workers and Farm buildings.
- Growth is **slow until the first Farm** is completed; tune the pre-Farm trickle to be meaningful but not fast.
- When the pool reaches a **threshold**, gain **+1 worker** (population) and reset or reduce the pool per design tuning.
- **+1 prosperity** per farming worker; **+1** from the first Farm; **+0.5** from a second Farm when understaffed.
- Future technologies or buildings may **lower the threshold** (Civ granary analogue) for faster growth.

## Alternatives

- **Fixed population in slice 1:** rejected; Farms should matter for growth.
- **Direct worker spawn from prosperity rate:** rejected; pool + threshold is easier to communicate in UI.

## Consequences

- UI shows prosperity pool progress toward next colonist.
- Balance knobs: threshold, pre-Farm rate, post-Farm bonuses.

## Validation

Simulation test: without a Farm, population does not exceed 3 within the first N turns under default 1/1/1 split; after Farm completion, a fourth worker arrives within a bounded turn range when farming is prioritized.

# 005: Construction queue and first-building pacing

- Status: Accepted
- Date: 2026-07-26
- Supersedes: None
- Superseded by: None

## Context

Industry must feel impactful from turn 1. The player should reach the first constructed building quickly when focusing workers on industry.

## Decision

- Construction uses a **turn-based queue**: industry output from workers and Factory bonuses applies to the active project each end-turn.
- First-tier **Factory**, **Lab**, and **Farm** each cost **5 industry** to complete.
- With Colony Planning complete, **3 workers all on industry** and no Factory, industry/turn is **3** (1 capital-matched worker + two excess at 0.5 + capital baseline +1); the **first** 5-cost structure completes in **2 turns**.
- Progress on an unfinished project is preserved if the player switches away and returns.
- One building per hex; placing a milestone structure on a bonus tile is encouraged but not required for the slice win.

## Alternatives

- **Instant build:** rejected; no role for industry workers during early game.
- **Higher first cost (10+):** rejected; slows the tutorial loop.

## Consequences

- Content defines `industryCost: 5` for tier-one production buildings.
- Balance must account for capital baseline industry and terrain bonuses when documenting expected turn counts.

## Validation

Deterministic test: 3 workers → industry, no Factory yet, matching rules from decision 010, project cost 5 → complete after two construction turns. Playtest: new player builds first structure in 2–3 focused industry turns after Colony Planning.

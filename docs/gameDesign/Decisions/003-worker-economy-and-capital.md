# 003: Capital, workers, and three-track economy

- Status: Accepted
- Date: 2026-07-26
- Supersedes: None
- Superseded by: None

## Context

Ascendancy separates Research, Industry, and Prosperity per planet. The slice must stay small (three workers) while still teaching tradeoffs between tracks.

## Decision

- **Capital** is the only structure at game start and provides baseline **+1 R / +1 I / +1 P** each turn, plus **1 free matched worker slot per track** (decision 010).
- **3 workers** populate the colony, fixed at **1 research / 1 industry / 1 farming** until **Colony Planning** is researched.
- **Colony Planning** unlocks **changing worker focus** (presets or sliders). Until then, allocation cannot be changed.
- Worker and building contributions use the **matched-pairs** rules in decision 010 (capital-matched worker +1; excess workers/buildings +0.5).
- Matching terrain adds **+1** when a matching building occupies a bonus hex.
- **Research** output fills the active technology bar after science unlocks.
- **Industry** output fills the single active construction project (unfinished progress kept).
- **Prosperity** output fills a pool toward population growth (see decision 004); threshold **10**.

## Alternatives

- **Per-building worker assignment:** deferred as too heavy for three workers.
- **Fully automatic workers forever:** rejected; allocation is core gameplay unlocked by research.
- **Separate industry pool:** rejected in favor of queue-only industry sink.

## Consequences

- Core simulation needs worker allocation, capital baseline, and per-track production resolution each turn.
- UI shows worker controls **disabled** until Colony Planning completes, then enables focus change.

## Validation

Table-driven tests: before Colony Planning, any attempt to change worker allocation fails. After it, 3/0/0 with no Factory yields worker industry 2 + capital 1 = 3/turn. Starting 1/1/1 with no track buildings yields one capital-matched +1 worker per track. Locked and science-unlock rules follow decision 010.

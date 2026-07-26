# 003: Capital, workers, and three-track economy

- Status: Proposed
- Date: 2026-07-26
- Supersedes: None
- Superseded by: None

## Context

Ascendancy separates Research, Industry, and Prosperity per planet. The slice must stay small (three workers) while still teaching tradeoffs between tracks.

## Decision

- **Capital** is the only structure at game start and provides baseline R/I/P each turn.
- **3 workers** populate the colony, fixed at **1 research / 1 industry / 1 farming** until **Colony Planning** is researched.
- **Colony Planning** unlocks **changing worker focus** (presets or sliders). Until then, allocation cannot be changed.
- Each assigned worker adds **+1** to its track per turn.
- **Capital baseline** each turn: **+1 research**, **+1 industry**, **+0 prosperity** until the first Farm exists (see decision 009).
- **Buildings add flat bonuses** on top: Lab **+1 research**, Factory **+1 industry**, Farm **+1 prosperity**; understaffing reduces building contribution (e.g. second Farm at **+0.5** prosperity when workers are scarce).
- **Research** output fills the active technology bar.
- **Industry** output fills the construction queue for the active project.
- **Prosperity** output fills a pool toward population growth (see decision 004).

## Alternatives

- **Per-building worker assignment:** deferred as too heavy for three workers.
- **Fully automatic workers forever:** rejected; allocation is core gameplay unlocked by research.
- **Separate industry pool:** rejected in favor of queue-only industry sink.

## Consequences

- Core simulation needs worker allocation, capital baseline, and per-track production resolution each turn.
- UI shows worker controls **disabled** until Colony Planning completes, then enables focus change.

## Validation

Table-driven tests: before Colony Planning, any attempt to change worker allocation fails. After it, 3/0/0 assignment yields research gain 0 from workers and industry gain 3 + Factory bonus when built. Capital baseline applies even with zero workers in a bucket. Switching allocation mid-turn is disallowed until end-turn resolution.

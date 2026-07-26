# 003: Capital, workers, and three-track economy

- Status: Proposed
- Date: 2026-07-26
- Supersedes: None
- Superseded by: None

## Context

Ascendancy separates Research, Industry, and Prosperity per planet. The slice must stay small (three workers) while still teaching tradeoffs between tracks.

## Decision

- **Capital** is the only structure at game start and provides baseline R/I/P each turn.
- **3 workers** populate the colony; default auto-allocation is **1 research / 1 industry / 1 farming**, with player override (presets or sliders).
- Each assigned worker adds **+1** to its track per turn.
- **Buildings add flat bonuses** on top; understaffing reduces building contribution (e.g. second Farm at **+0.5** prosperity when workers are scarce).
- **Research** output fills the active technology bar.
- **Industry** output fills the construction queue for the active project.
- **Prosperity** output fills a pool toward population growth (see decision 004).

## Alternatives

- **Per-building worker assignment:** deferred as too heavy for three workers.
- **Fully automatic workers:** rejected; allocation is core gameplay.
- **Separate industry pool:** rejected in favor of queue-only industry sink.

## Consequences

- Core simulation needs worker allocation, capital baseline, and per-track production resolution each turn.
- UI needs a simple three-way control, not per-hex staffing in slice 1.

## Validation

Table-driven tests: with 3/0/0 assignment, research gain is 3 + Lab bonus; with 0/3/0, industry gain is 3 + Factory bonus; switching assignment mid-turn is disallowed until end-turn resolution. Capital baseline is nonzero with zero workers assigned.

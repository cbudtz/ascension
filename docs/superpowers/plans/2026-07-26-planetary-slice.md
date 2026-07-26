# Planetary Slice 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the accepted homeworld vertical slice: workers, research, connected construction, milestone victory, Ascendancy-styled hex UI, and solar-system teaser.

**Architecture:** Pure `core` owns state and rules; `content` declares map/techs/buildings; `application` exposes use cases; Phaser scenes in `presentation` render and dispatch commands; `bootstrap` wires a new game.

**Tech Stack:** TypeScript, Vitest, Phaser 4, Vite (existing foundation)

**Design:** `docs/superpowers/specs/2026-07-26-planetary-slice-design.md` and Accepted decisions 001–011.

---

### Task 1: Core types, production matching, and turn economy

**Files:**

- Create: `src/core/types.ts`
- Create: `src/core/production.ts`
- Create: `src/core/production.test.ts`
- Create: `src/core/hex.ts`
- Create: `src/core/hex.test.ts`

- [ ] Define axial hex helpers (`neighbors`, key) with tests.
- [ ] Implement capital baseline + free-slot + matched/excess production per decision 010 with table-driven tests.
- [ ] Commit: `feat: add hex and production core rules`

### Task 2: Colony state — research, construction, connectivity, prosperity, victory

**Files:**

- Create: `src/core/colony.ts`
- Create: `src/core/colony.test.ts`
- Create: `src/core/research.ts`
- Create: `src/core/construction.ts`
- Create: `src/core/connectivity.ts`

- [ ] Model colony state: workers, buildings, techs, banked RP, active tech, project, prosperity, day, victory.
- [ ] Actions: endDay, setWorkers (gated), selectTech (gated after day≥1), queueBuild, clearActiveBuild (optional leave unfinished by switching).
- [ ] Enforce connectivity, blueprint unlocks, locked techs, science unlock, banked RP, threshold 10.
- [ ] Victory when Factory+Lab+Farm completed.
- [ ] Commit: `feat: add colony simulation core`

### Task 3: Content definitions and homeworld map

**Files:**

- Create: `src/content/technologies.ts`
- Create: `src/content/buildings.ts`
- Create: `src/content/homeworld.ts`
- Create: `src/content/homeworld.test.ts`

- [ ] Declare nine techs and four buildings with costs from decisions.
- [ ] Author ~37-hex map with capital at center, mixed R/I/P/neutral, some bonus hexes ≥2 steps away.
- [ ] Commit: `feat: add planetary slice content`

### Task 4: Application use cases

**Files:**

- Create: `src/application/GameSession.ts`
- Create: `src/application/GameSession.test.ts`

- [ ] Session holds colony + content; methods mirror player commands; return typed results.
- [ ] Snapshot DTO for presentation (no Phaser types).
- [ ] Commit: `feat: add game session application layer`

### Task 5: Planet and system Phaser presentation

**Files:**

- Create: `src/presentation/phaser/PlanetScene.ts`
- Create: `src/presentation/phaser/SystemScene.ts`
- Create: `src/presentation/phaser/ui/Hud.ts`
- Create: `src/presentation/phaser/hexRender.ts`
- Modify: `src/bootstrap/main.ts`
- Modify: `src/presentation/phaser/styles.css`
- Remove or stop using: `FoundationScene` as boot scene

- [ ] Render hex map with Ascendancy-like terrain tints; capital distinct; buildings as simple icons.
- [ ] HUD: day, workers (locked until Colony Planning), production, research, queue, end turn, victory banner.
- [ ] Research panel after science unlock; grey locked techs with future-update text.
- [ ] System scene after Orbital Cartography: star, homeworld, locked planets.
- [ ] Commit: `feat: add planetary and system Phaser scenes`

### Task 6: Browser coverage and docs polish

**Files:**

- Modify: `tests/e2e/boot.spec.ts`
- Create: `tests/e2e/planetary-smoke.spec.ts`
- Modify: `README.md`

- [ ] E2E: game boots into planet view; end turn unlocks science UI.
- [ ] Update README status to planetary slice in progress/playable.
- [ ] Run `npm run check` and `npm run test:e2e`; push; update PR.

---

**Non-goals:** ships, colonization, adjacency synergies, saves, species, procedural maps.

# Ascension

Ascension is an independent browser strategy-game project inspired by the ideas and atmosphere of the 1995 game _Ascendancy_. It is not affiliated with or endorsed by The Logic Factory or the original publishers.

## Status

Playable **planetary slice 1**: homeworld hex colony with workers, Civ-style research, connected construction (including Transit Tubes), milestone victory (Factory + Lab + Farm), and a solar-system teaser after Orbital Cartography.

## Prerequisites

- Node.js 24
- npm

## Setup

```sh
npm install
npx playwright install chromium
```

The Chromium install is required for `npm run test:e2e`.

## Commands

```sh
npm run dev
npm run check
npm run test:e2e
npm run build
```

## Controls

The control panel is a **right sidebar** on landscape displays and a **bottom dock** on portrait / vertical displays. Use the buttons there, or the keyboard shortcuts:

- **End turn** — `E` / `Enter`
- **Build select** — `1`–`4` (Factory / Lab / Farm / Transit Tube); click a hex to queue
- **Workers** — Research / Industry / Prosperity / Balance (`Q` / `W` / `A` / `S`) after Colony Planning
- **Cycle research** — `R` (after first turn)
- **System view** — panel button or `V` after Orbital Cartography; **Back to planet** or `B` from the system teaser

## Project guides

- [Agent entry point](AGENTS.md)
- [Architecture](docs/development/ARCHITECTURE.md)
- [AI development cycle](docs/development/AI_DEVELOPMENT_CYCLE.md)
- [Optimized references](docs/development/REFERENCE.md)
- [Technical decisions](docs/development/Decisions/README.md)
- [Game-design decisions](docs/gameDesign/Decisions/README.md)
- [Planetary slice design](docs/superpowers/specs/2026-07-26-planetary-slice-design.md)

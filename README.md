# Ascension

Ascension is an independent browser strategy-game project inspired by the ideas and atmosphere of the 1995 game _Ascendancy_. It is not affiliated with or endorsed by The Logic Factory or the original publishers.

## Status

The repository currently contains the development foundation only: toolchain, architecture enforcement, and a Phaser boot proof. No gameplay is implemented. Gameplay design resumes after the foundation is complete.

## Prerequisites

- Node.js 24
- npm

## Commands

```sh
npm install
npm run dev
npm run check
npm run test:e2e
npm run build
```

`npm run dev` starts the local Vite server. `npm run check` runs formatting, lint, architecture, type, unit-test, and production-build checks. Browser integration tests run separately with `npm run test:e2e`.

## Project guides

- [Agent entry point](AGENTS.md)
- [Architecture](docs/development/ARCHITECTURE.md)
- [AI development cycle](docs/development/AI_DEVELOPMENT_CYCLE.md)
- [Optimized references](docs/development/REFERENCE.md)
- [Technical decisions](docs/development/Decisions/README.md)
- [Game-design decisions](docs/gameDesign/Decisions/README.md)

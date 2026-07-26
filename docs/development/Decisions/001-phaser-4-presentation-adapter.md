# 001 — Phaser 4 presentation adapter

- **Status:** Accepted
- **Date:** 2026-07-26
- **Supersedes:** None
- **Superseded by:** None

## Context

Ascension is currently a 2D management game and may later add a 2D galaxy view. It needs rendering, input, asset loading, cameras, and browser lifecycle support without coupling game rules to an engine.

## Decision

Use Phaser 4 for rendering, input, assets, and presentation lifecycle. Keep authoritative state and game rules in pure TypeScript behind application-facing boundaries. Phaser code is confined to presentation adapters and bootstrap composition so the engine can be replaced without rewriting the game model.

## Alternatives

- **PixiJS 8:** a capable lower-level renderer with more rendering control, but it would require assembling more input, lifecycle, camera, and game-oriented facilities.
- **Excalibur.js:** a TypeScript-first 2D engine, but Phaser offers the stronger fit for this project through its breadth of built-in 2D systems, documentation, and examples.
- **Babylon.js:** a batteries-included engine with strong 3D support; its 3D-first scope is unnecessary for the planned 2D management and galaxy views.
- **Three.js:** a flexible 3D rendering library, but it would require substantial game-framework infrastructure and does not match the present 2D focus.

## Consequences

Phaser provides mature, batteries-included 2D APIs and documentation and a WebGL-first renderer. The project accepts its bundle cost and engine lifecycle constraints. Strict isolation is required: Scenes remain lifecycle coordinators, and no authoritative rules or state may migrate into Phaser. Application and core boundaries form the replacement seam for another renderer or engine.

## Validation

The current Playwright boot smoke test proves that Phaser creates a visible canvas without browser errors. Before expanding gameplay presentation, build a focused hex-grid spike that validates pan, zoom, and selection behavior; revisit this decision if that spike exposes an unacceptable limitation.

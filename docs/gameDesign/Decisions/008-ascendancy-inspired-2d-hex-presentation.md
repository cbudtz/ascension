# 008: Ascendancy-inspired 2D hex presentation

- Status: Proposed
- Date: 2026-07-26
- Supersedes: None
- Superseded by: None

## Context

The game should feel like a modern take on Ascendancy’s planetary management, not a generic hex strategy UI.

## Decision

Planet view uses **2D hex art close to the original Ascendancy** planetary screen:

- Top-down or slight-isometric hex tiles with **strong terrain tint** (research / industry / prosperity palette echoing the DOS game)
- **Simple, readable building icons** on occupied hexes
- **Retro sci-fi UI chrome** for worker allocation, queue, and research tree overlays
- Capital hex visually distinct

Phaser handles rendering only; authoritative state remains in core/application layers per architecture rules.

## Alternatives

- **Abstract modern flat UI:** rejected for this project’s identity goal.
- **3D planet globe:** rejected for slice 1 cost and scope.
- **Tilemap without hexes:** rejected after hex + terrain decision.

## Consequences

- Art direction references Ascendancy manual/screenshots for color and density, not necessarily asset reuse.
- Presentation needs hex picking, hover, and build/upgrade affordances.

## Validation

Informal art review: three testers associate the planet screen with classic Ascendancy-style management within 30 seconds. Hex click selects tile in Playwright smoke extension when implemented.

# 002: Homeworld hex map

- Status: Accepted
- Date: 2026-07-26
- Supersedes: None
- Superseded by: None

## Context

The player needs readable placement decisions on a fixed planet. Earlier exploration considered abstract slots and district models; the team chose a hex surface with Ascendancy-style terrain bonuses.

## Decision

The homeworld uses a **hand-authored, fully revealed** hex map of about **37 tiles** (~two rings around the capital). Each hex has at most one building; structures may be replaced or upgraded in place. Terrain is one of three bonus types aligned with **Research**, **Industry**, or **Prosperity** (farming), plus neutral tiles. New worlds later may add blocked, water, and rare specials on top of this trio.

## Alternatives

- **Fog of war:** deferred to keep the first slice readable.
- **Procedural homeworld:** rejected for balance and test stability.
- **Districts without per-hex placement:** rejected; hexes carry the Ascendancy identity.

## Consequences

- Content ships as data for one map layout and terrain assignment.
- Presentation renders a 2D hex grid with terrain tinting.
- Adjacency rules and connectivity can be enforced without changing the map format.

## Validation

Playtesters can identify bonus hexes at a glance and place three milestone buildings on intentional tiles. Automated tests load the authored map and assert hex count, terrain distribution, and capital position.

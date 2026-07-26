# Planetary Slice Design

## Purpose

Define the first playable game slice: one hand-authored homeworld, a Civ-inspired research tree, worker-driven R/I/P economy, construction queue, and a solar-system teaser. Space travel, ship design, adjacency synergies, and colonization remain out of scope until later slices.

## Player goal

Build a **Factory**, a **Lab**, and a **Farm** on the homeworld. The capital provides baseline Research, Industry, and Prosperity output; the player expands through worker allocation, research, and construction.

## Presentation

- **Planet view:** 2D hex map styled close to the original Ascendancy planetary screen — saturated terrain-tinted hexes, simple structure sprites, retro sci-fi UI framing.
- **System view:** unlocked by mid-tree research; shows the sun, homeworld (return to planet), and locked placeholder planets.

## Homeworld map

- Hand-authored, fully revealed, ~37 hexes (about two rings around the capital).
- Terrain types follow Ascendancy’s three bonuses: Research, Industry, and Prosperity (farming).
- One building per hex; structures can be replaced or upgraded in place.
- Later worlds may add blocked, water, and rare specials on top of the three bonus types.

## Starting state

- **Capital only** — no separate starter Factory, Lab, or Farm.
- Capital provides baseline R/I/P each turn.
- **3 workers**, fixed at **1 / 1 / 1** (research / industry / farming) until **Colony Planning** is researched.
- After Colony Planning, the player may **change worker focus** (presets or sliders). Default remains 1/1/1 until changed.

## Worker and output model

| Track      | Worker effect                    | Building effect                                                  | Sink                                        |
| ---------- | -------------------------------- | ---------------------------------------------------------------- | ------------------------------------------- |
| Research   | +1 research per assigned worker  | Lab adds flat bonus; understaffing reduces building contribution | Active technology progress bar              |
| Industry   | +1 industry per assigned worker  | Factory adds flat bonus; second Factory at 0.5 if understaffed   | Construction queue progress                 |
| Prosperity | +1 prosperity per farming worker | First Farm +1; second Farm +0.5 if understaffed                  | Prosperity pool toward population threshold |

- Research: Civ I/II style — full tree visible, one active technology, switching preserves partial progress.
- Industry: turn-based construction queue; no separate industry pool.
- Prosperity: slow accumulation until the first Farm exists; at threshold, gain +1 worker. Future buildings may lower the threshold (granary-style).

## Construction pacing (slice 1)

- First-tier **Factory**, **Lab**, and **Farm** each cost **5 industry** to complete.
- With **3 workers** and **all assigned to industry** (+3 industry/turn), the first building finishes in **2 turns** (3 + 3 ≥ 5).
- Terrain bonuses and capital baseline industry may adjust exact timing; the slice is tuned so focused industry play reaches the first build in two turns.

## Research tree (slice 1, eight nodes)

Full tree visible from turn 1. Five nodes matter for this slice; three are locked placeholders for later systems.

| Tech                            | Prereqs                | Unlocks                                         |
| ------------------------------- | ---------------------- | ----------------------------------------------- |
| **Colony Planning**             | —                      | **Change worker focus** (R / I / farming split) |
| **Industrial Foundations**      | —                      | Factory blueprint                               |
| **Research Methods**            | —                      | Lab blueprint                                   |
| **Environmental Encapsulation** | —                      | Farm blueprint                                  |
| **Orbital Cartography**         | Research Methods       | Solar system view (homeworld + locked planets)  |
| **Xenobiological Dig**          | Research Methods       | _Locked_ — xeno sites / dig bonuses (future)    |
| **Star Lane Anatomy**           | Orbital Cartography    | _Locked_ — interstellar travel (future)         |
| **Mass Fabrication**            | Industrial Foundations | _Locked_ — advanced industry (future)           |

Queueing structures on unoccupied buildable hexes is available from turn 1 once the relevant **blueprint** technology is researched. Colony Planning does not gate placement; it gates **worker reassignment**.

Names nod to Ascendancy where appropriate (`Environmental Encapsulation`, `Star Lane Anatomy`, `Xenobiological Dig`) while keeping Civ-style clarity for roots and branches.

## Research costs (proposed)

See decision 009. Summary: Colony Planning **3 RP**; building blueprints **5 RP**; Orbital Cartography **7 RP**. Capital provides **+1 research** and **+1 industry** per turn before workers.

## Turns

Discrete **days**. Player ends turn; capital output, worker production, research progress, construction progress, and prosperity accumulation resolve together.

## Explicitly deferred

- Ship design and movement
- Colonization and combat
- Adjacency synergies (tech-gated later)
- Rich terrain on the homeworld
- Species traits and diplomacy
- Save/load (unless added with infrastructure slice)

## Success criteria for implementation

- Player can complete the milestone on the authored 37-hex map without bugs.
- Worker sliders/presets affect research, construction, and prosperity as specified.
- Research tree UI shows eight nodes; five are actionable in slice 1.
- Orbital Cartography opens solar system view with locked planets only.
- Core rules are testable without Phaser; presentation matches Ascendancy-inspired 2D hex look.

## Related decisions

See `docs/gameDesign/Decisions/` for proposed records covering scope, map, economy, research, construction pacing, visuals, and solar-system teaser.

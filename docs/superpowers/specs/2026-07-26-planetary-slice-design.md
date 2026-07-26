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
- Capital provides baseline **+1 research, +1 industry, and +1 prosperity** each turn, plus **1 free matched worker slot per track**.
- **3 workers**, fixed at **1 / 1 / 1** until **Colony Planning** is researched.
- After Colony Planning, the player may **change worker focus** (presets or sliders). Default remains 1/1/1 until changed.
- **No active technology** at start. After the first end-turn, science unlocks; **turn-1 research is banked** until a tech is selected.

## Worker and output model

| Track      | Worker effect                                                                   | Building effect                                       | Sink                                        |
| ---------- | ------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------- |
| Research   | Matched +1; capital can match 1 worker with no Lab; further excess workers +0.5 | Matched Lab +1; excess Labs +0.5; matching terrain +1 | Active technology progress bar              |
| Industry   | Same matching rules for Factory                                                 | Same for Factory                                      | Construction queue progress                 |
| Prosperity | Same matching rules for Farm                                                    | Same for Farm                                         | Prosperity pool toward population threshold |

Matching and capital free-slot rules: see decision 010.

- Research: Civ I/II style — full tree visible, one active technology after science unlocks, switching preserves partial progress.
- Industry: one active construction project; unfinished builds keep progress; no separate industry pool.
- Prosperity: pool threshold **10** → +1 worker. Pre-Farm growth uses capital + farming workers; Farm adds building bonus.

## Construction pacing (slice 1)

- First-tier **Factory**, **Lab**, and **Farm** each cost **5 industry** to complete.
- After Colony Planning, with **3 workers on industry** and no Factory: worker output **1 + 0.5 + 0.5**, capital **+1**, total **3 industry/turn** → first building finishes in **2 turns** (3 + 3 ≥ 5).
- Neutral and bonus hexes are buildable; capital hex is not. Terrain matching adds **+1** when present.

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

See decisions 009 and 010. Summary: Colony Planning **3 RP**; building blueprints **5 RP**; Orbital Cartography **7 RP**. Capital **+1 R/I/P**. Science selects after round 1; turn-1 RP is banked. Locked leaves are grey with “future update” copy.

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

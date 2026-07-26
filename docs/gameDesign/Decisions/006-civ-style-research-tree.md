# 006: Civ-style research tree

- Status: Proposed
- Date: 2026-07-26
- Supersedes: None
- Superseded by: None

## Context

The design adopts Civ I/II clarity for research while updating Ascendancy’s planetary play. Adjacency and advanced systems unlock later through the tree.

## Decision

- **Full tree visible** from turn 1; only roots and unlocked prerequisites are researchable.
- **One active technology** at a time; **switching preserves partial progress**.
- Slice 1 ships **eight visible nodes** (see planetary slice spec); five are actionable, three locked placeholders.
- Proposed slice 1 technologies:

| Tech                        | Prereqs                | Effect                            |
| --------------------------- | ---------------------- | --------------------------------- |
| Colony Planning             | —                      | **Change worker focus**           |
| Industrial Foundations      | —                      | Factory blueprint                 |
| Research Methods            | —                      | Lab blueprint                     |
| Environmental Encapsulation | —                      | Farm blueprint                    |
| Orbital Cartography         | Research Methods       | Solar system view                 |
| Xenobiological Dig          | Research Methods       | Locked (xeno sites / dig bonuses) |
| Star Lane Anatomy           | Orbital Cartography    | Locked (travel)                   |
| Mass Fabrication            | Industrial Foundations | Locked (advanced industry)        |

Placement on unoccupied buildable hexes is allowed from turn 1 **after** the matching blueprint tech is researched. Colony Planning does not gate building placement.

Research costs: see decision 009 (Colony Planning **3 RP**, blueprints **5 RP**, Orbital **7 RP**).

## Alternatives

- **Hidden tree:** rejected; Civ-style visibility is a design goal.
- **Parallel research slots:** rejected for slice 1 complexity.
- **Larger tree in slice 1:** rejected; eight nodes keep content and UI manageable.

## Consequences

- `content/` holds declarative tech definitions and edges.
- Presentation renders a scrollable tree with locked/active/completed states.
- Core tests verify prereqs, progress persistence on switch, and unlock hooks.

## Validation

Player researches Colony Planning first, can then change worker focus, researches building blueprints and Orbital Cartography, and cannot complete **Xenobiological Dig** or other locked leaf techs in slice 1. Switching away from a partially researched tech and back retains progress in unit tests.

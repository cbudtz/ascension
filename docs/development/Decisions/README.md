# Technical decision records

Use these records for durable technical and architectural choices. Player-facing rules, balance, and experience intent belong in the [game-design decision records](../../gameDesign/Decisions/README.md).

## Naming and status

Name records `NNN-kebab-case-title.md` with the next available three-digit number.

Allowed statuses are:

- **Proposed:** under consideration and safe to revise;
- **Accepted:** active direction;
- **Superseded:** replaced by a later record;
- **Rejected:** considered but not adopted.

Once accepted, the context, decision, alternatives, consequences, and validation content is immutable. Status and supersession metadata may change. Corrections or changed direction require a replacement record; the old and new records must link to each other through `Supersedes` and `Superseded by`.

Copy [`000-template.md`](000-template.md), rename it, replace its instructional placeholders, and add it to the index.

## Index

| Record                                                                      | Status   |
| --------------------------------------------------------------------------- | -------- |
| [001 — Phaser 4 presentation adapter](001-phaser-4-presentation-adapter.md) | Accepted |

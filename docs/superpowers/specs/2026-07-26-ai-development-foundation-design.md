# AI Development Foundation Design

## Purpose

Establish a small, enforceable development system before game implementation begins. It must keep the turn-based simulation independent from Phaser, give coding agents one canonical workflow, and preserve game-design reasoning as explicit decisions.

This foundation covers documentation and planned quality gates only. Phaser/Vite scaffolding and the first planetary-development feature belong to the subsequent implementation plan.

## Chosen Approach

Use a layered modular monolith. It provides strong boundaries without the coordination overhead of packages or the complexity of an entity-component system.

Alternatives considered:

- **Phaser scene-centric:** quickest prototype, but simulation rules become coupled to rendering and difficult to test deterministically.
- **Entity-component system:** potentially useful for a large real-time simulation, but adds abstractions that the initial turn-based colony game does not need.

## Architecture

Production source will be organized by responsibility:

```text
src/
  core/                 Pure TypeScript state, rules, calculations, and domain events
  application/          Player actions and orchestration through explicit ports
  presentation/phaser/  Scenes, input mapping, view models, rendering, and animation
  infrastructure/       Port implementations such as saves and seeded randomness
  content/              Declarative terrain, building, and balance definitions
  bootstrap/            Composition root and Phaser game configuration
```

Dependency direction:

```text
content ───────────────► core
application ───────────► core
infrastructure ────────► application + core
presentation/phaser ───► application + core
bootstrap ─────────────► all layers
```

Rules:

- `core` cannot import Phaser, browser APIs, presentation, infrastructure, or bootstrap code.
- `application` can depend on `core`, but not on Phaser or concrete infrastructure.
- Infrastructure and presentation communicate with the simulation through application ports and use cases.
- `bootstrap` wires concrete dependencies but contains no game rules.
- Game content is data-first. New terrain or buildings should normally require data and tests, not new scene logic.
- Random outcomes use an injected seeded random source so tests and saved games can reproduce them.
- Phaser Scenes remain lifecycle coordinators; they do not own authoritative game state.

## Agent Development Cycle

Every task follows the same bounded loop:

1. **Orient:** read `AGENTS.md`, relevant architecture sections, active game decisions, and current repository status.
2. **Frame:** state acceptance criteria, non-goals, affected layer, and the smallest observable behavior.
3. **Test first:** add a deterministic failing unit test for rules or an appropriate browser test for presentation behavior.
4. **Implement:** make the smallest layer-correct change that passes the new test.
5. **Fast checks:** format, lint, dependency boundaries, type-check, and focused tests.
6. **Full checks:** all tests and a production build; run browser smoke tests when presentation or integration changes.
7. **Review:** inspect the diff for scope creep, duplicated rules, boundary violations, leaked event listeners, and accidental nondeterminism.
8. **Record:** add a decision for a durable architecture rule or game mechanic; only proposed decisions may be amended.
9. **Deliver:** make one logical commit and summarize behavior, verification evidence, and remaining risks.

Agents stop and clarify when acceptance criteria conflict, a choice would invalidate an accepted decision, or destructive migration is required. They do not broaden a task into unrelated cleanup.

## Planned Automated Checks

The project will expose stable package scripts so local work and CI use the same commands:

- `npm run format:check` — formatting
- `npm run lint` — code-quality and local import restrictions
- `npm run typecheck` — TypeScript checking, because Vite transpiles without type-checking
- `npm run test` — deterministic unit and integration tests
- `npm run test:e2e` — browser-level smoke tests
- `npm run arch:check` — dependency graph and forbidden-import rules
- `npm run build` — production bundle
- `npm run check` — required non-browser checks in one command

The implementation plan will select and configure:

- ESLint for code rules and restricted imports
- dependency-cruiser for cross-layer dependency enforcement and cycle detection
- Vitest for pure simulation and integration tests
- Playwright for a small number of critical browser flows
- TypeScript strict mode and Vite production builds

CI will run architecture checks independently from tests so a boundary failure is immediately identifiable.

## Documentation Layout

```text
AGENTS.md
docs/
  development/
    AI_DEVELOPMENT_CYCLE.md
    ARCHITECTURE.md
    REFERENCE.md
  gameDesign/
    Decisions/
      README.md
      000-template.md
```

- `AGENTS.md` is the concise entry point and command contract.
- `AI_DEVELOPMENT_CYCLE.md` contains the task loop and completion checklist.
- `ARCHITECTURE.md` owns layer definitions and dependency rules.
- `REFERENCE.md` contains a condensed skill-routing table and authoritative external links, avoiding copied tutorials.
- `Decisions/README.md` defines naming, status, and supersession rules.
- `000-template.md` captures context, decision, alternatives, consequences, validation, and status.

Accepted decisions are immutable records. A later change creates a new decision that supersedes the old one instead of rewriting history. Early exploratory ideas are marked `Proposed`, not treated as settled mechanics.

## Condensed Agent Skill Routing

The reference guide will direct agents to the relevant workflow rather than duplicating skill text:

- New behavior or feature: brainstorming, then planning, then test-driven development.
- Multi-step approved plan: plan execution or subagent-driven development.
- Bug or unexpected test result: systematic debugging before proposing a fix.
- Review feedback: verify technically before applying it.
- Completion: request review where proportionate, then verify fresh command output before claiming success.
- Branch handoff: use the branch-finishing workflow after checks pass.

## Authoritative References

The condensed reference guide will link to:

- Phaser installation and official templates: <https://docs.phaser.io/phaser/getting-started/installation>
- Phaser Scenes and lifecycle: <https://docs.phaser.io/phaser/concepts/scenes>
- Cross-Scene communication: <https://docs.phaser.io/phaser/concepts/scenes/cross-scene-communication>
- Phaser Data Manager: <https://docs.phaser.io/phaser/concepts/data-manager>
- Vite guide: <https://vite.dev/guide/>
- Vite production builds: <https://vite.dev/guide/build>
- Vitest guide: <https://vitest.dev/guide/>
- Playwright test documentation: <https://playwright.dev/docs/intro>
- dependency-cruiser rules: <https://github.com/sverweij/dependency-cruiser/blob/main/doc/rules-reference.md>
- ESLint configuration: <https://eslint.org/docs/latest/use/configure/>
- Original Ascendancy gameplay reference: <https://www.b-sting.nl/ascendancy/downloads/Ascendancy_the_offline_manual_v1.0.pdf>

The project will use current package documentation at implementation time rather than pinning assumptions from old tutorials.

## Game-Design Boundary

The initial playable scope is planetary development; space exploration and ship design are deferred.

Combining fixed terrain bonuses with a hex grid appears feasible: each planet can expose a fixed hex layout whose terrain and resources modify building output, while neighboring buildings may create adjacency effects. This remains a proposed direction until the design quiz resolves topology, visibility, population, resource, and turn-economy decisions.

## Testing and Failure Handling

- Core rules use table-driven tests and seeded fixtures.
- Use cases test valid actions, rejected actions, and emitted state changes.
- Presentation tests focus on mapping state to views and input to commands, not Phaser internals.
- End-to-end tests cover only essential boot and player-action paths.
- Invalid player actions return typed results and leave state unchanged.
- Save loading validates schema/version before constructing domain state.
- Scene shutdown removes subscriptions and transient objects to prevent duplicate handlers after restarts.

## Success Criteria

The foundation is successful when:

- A new agent can find the required workflow and architecture rules from `AGENTS.md`.
- Every planned source directory has an explicit responsibility and legal dependencies.
- One command can run all required non-browser checks.
- Architecture violations and dependency cycles fail automatically.
- Durable game decisions have a consistent, reviewable record.
- The first game implementation can be tested without starting Phaser.

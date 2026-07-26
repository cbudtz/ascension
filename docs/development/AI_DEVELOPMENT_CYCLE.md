# AI development cycle

Use this cycle for every change. Scale the evidence to the risk, but do not skip a stage.

## 1. Orient

Read `AGENTS.md`, the architecture guide, relevant accepted technical decisions, and active game-design decisions. Inspect the current behavior and nearby tests before editing.

## 2. Frame

Write a small scope contract:

```text
Observable behavior:
Acceptance criteria:
Non-goals:
Affected layer:
```

Stop when the frame needs a product choice or conflicts with an accepted decision.

## 3. Test first

Create the smallest test that demonstrates the behavior and run it to observe the expected failure. Prefer deterministic inputs, explicit state, and observable outputs. Control time and randomness; core tests must never depend on ambient time, browser state, or unseeded randomness.

## 4. Implement

Follow red/green/refactor:

1. Red: preserve the meaningful failing test.
2. Green: make it pass with the smallest in-scope implementation.
3. Refactor: improve clarity only while tests stay green; do not fold in unrelated cleanup.

## 5. Fast checks

Run the narrowest useful feedback loop while working:

```sh
npm test -- <test-file>
npx eslint <changed-files>
npx prettier --check <changed-files>
```

Also run `npm run arch:check` when imports or layer placement change and `npm run typecheck` when types or public contracts change.

## 6. Full checks

Before delivery, run:

```sh
npm run check
```

Run `npm run test:e2e` for presentation or integration work. Browser tests are mandatory when a change affects boot, rendering, input, Phaser lifecycle, browser APIs, cross-layer wiring, or another user-visible browser flow.

## 7. Review

Review the complete diff and confirm:

- every change serves the scope and no generated output was accidentally added;
- rules and guidance are not duplicated;
- imports and responsibilities respect layer boundaries;
- time and randomness are deterministic where behavior depends on them;
- event listeners and subscriptions are removed on Scene shutdown or adapter disposal;
- generated files are intentional, reproducible, and excluded when they should not be tracked.

## 8. Record

Record durable technical choices in [`docs/development/Decisions`](Decisions/README.md). Record player-facing rules and design intent in [`docs/gameDesign/Decisions`](../gameDesign/Decisions/README.md). Do not use a technical record to decide gameplay.

Create a record when a choice changes constraints, dependencies, architecture, or a costly-to-reverse direction. Routine implementation details do not need one.

## 9. Deliver

Commit one logical change and provide an evidence-based handoff:

```text
Outcome: <observable result>
Scope: <key files or layer>
Verification: <commands and results>
Decisions: <records added or "none">
Concerns: <remaining risk or "none">
Commit: <SHA>
```

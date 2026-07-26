# Agent guide

Use this file as the entry point. Keep changes narrow; linked documents are authoritative for details.

## Start here

1. Read the [architecture guide](docs/development/ARCHITECTURE.md).
2. Follow the [development cycle](docs/development/AI_DEVELOPMENT_CYCLE.md).
3. Read relevant [accepted technical decisions](docs/development/Decisions/README.md).
4. Read relevant [active game-design decisions](docs/gameDesign/Decisions/README.md).

## Scope contract

Before editing, state:

- the observable behavior to add or correct;
- acceptance criteria;
- explicit non-goals;
- the affected architecture layer.

Stop and ask when acceptance criteria conflict, work conflicts with an accepted decision, a destructive migration is required, or a product choice is missing.

## Skill routing

- Feature or new behavior: brainstorm, write a plan, then use test-driven development.
- Bug or unexpected result: use systematic debugging before proposing a fix.
- Approved multi-task plan: use subagent-driven development or execute the plan in checkpoints.
- Review feedback: use the receiving-code-review workflow and verify the claim.
- Completion: request code review and verify before claiming completion.

See the concise [skill and source reference](docs/development/REFERENCE.md) for immediate next actions.

## Dependency law

- `core` is pure TypeScript and independent of every other source layer.
- `application` owns use cases and ports; it may depend only on `core`.
- `content` is declarative and may depend only on `core`.
- Production code in these three pure layers may not use browser or Node APIs or external packages.
- `presentation` and `infrastructure` are adapters; each may depend only on `application` and `core`.
- Phaser imports belong only in `presentation` or `bootstrap`.
- `bootstrap` is the composition root and may wire all layers.

The enforced matrix and layer responsibilities live in the [architecture guide](docs/development/ARCHITECTURE.md). Do not introduce circular dependencies.

## Required cycle

1. Add a failing test for the framed behavior.
2. Write the smallest implementation that makes it pass.
3. Run focused checks, then full checks.
4. Review the diff for scope and boundary violations.
5. Add or update the appropriate decision record when a durable decision was made.
6. Make a logical commit with evidence in the handoff.

Do not perform broad unrelated cleanup. Do not use unseeded randomness in `core`.

## Commands

```sh
npm run check
```

For presentation or integration work, also run:

```sh
npm run test:e2e
```

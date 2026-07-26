# Development reference

This is a routing index, not a tutorial. Read only the source needed for the current task.

## Skill routing

| Skill or workflow              | Use when                                               | Immediate next action                                                          |
| ------------------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Brainstorming                  | Adding a feature or changing behavior                  | Clarify intent and get agreement on a small design.                            |
| Writing plans                  | A design is approved                                   | Produce ordered, verifiable implementation tasks.                              |
| Test-driven development        | Implementing a feature or bug fix                      | Write and run the smallest failing test.                                       |
| Systematic debugging           | A test fails unexpectedly or behavior is unexplained   | Reproduce and gather evidence before changing code.                            |
| Subagent-driven development    | An approved plan has independent tasks in this session | Assign isolated tasks and review each result.                                  |
| Executing plans                | An approved plan will be implemented in checkpoints    | Execute the next batch, verify it, and report evidence.                        |
| Receiving code review          | Acting on review feedback                              | Verify the feedback against code and requirements.                             |
| Requesting code review         | Implementation and checks are complete                 | Request a scope and correctness review.                                        |
| Verification before completion | About to claim success                                 | Run fresh required checks and cite their output.                               |
| Finishing a development branch | Implementation and checks are complete                 | Present integration, PR, or keep-branch options without merging automatically. |

## Authoritative sources

- [Phaser installation and official templates](https://docs.phaser.io/phaser/getting-started/installation) — use the supported package and starter guidance instead of third-party setup snippets.
- [Phaser Scenes and lifecycle](https://docs.phaser.io/phaser/concepts/scenes) — consult lifecycle ownership before adding Scene state or hooks.
- [Phaser cross-Scene communication](https://docs.phaser.io/phaser/concepts/scenes/cross-scene-communication) — compare event and registry patterns while keeping authoritative state outside Scenes.
- [Phaser Data Manager](https://docs.phaser.io/phaser/concepts/data-manager) — check current data and change-event behavior before using a registry or Scene data store.
- [Phaser repository AI agent skills](https://github.com/phaserjs/phaser/tree/master/skills) — load the relevant official subsystem skill for focused Phaser 4 guidance.
- [Vite guide](https://vite.dev/guide/) and [production builds](https://vite.dev/guide/build.html) — use these for dev-server, asset, and bundling behavior.
- [Vitest guide](https://vitest.dev/guide/) — use current test, filtering, mocking, and configuration APIs.
- [Playwright introduction](https://playwright.dev/docs/intro) — use this for browser-test setup, locators, assertions, and execution.
- [dependency-cruiser rules](https://github.com/sverweij/dependency-cruiser/blob/main/doc/rules-reference.md) — use the rule schema when changing enforced import boundaries.
- [ESLint configuration](https://eslint.org/docs/latest/use/configure/) — use flat-config documentation when changing lint scope or rules.
- [Ascendancy gameplay manual](https://www.b-sting.nl/ascendancy/downloads/Ascendancy_the_offline_manual_v1.0.pdf) — consult the manual as historical gameplay input, not as an automatic product requirement.

Phaser 3 tutorials can conflict with Phaser 4 renderer and API behavior. Prefer documentation for the current installed package and inspect local installed TypeScript declarations before copying an older snippet.

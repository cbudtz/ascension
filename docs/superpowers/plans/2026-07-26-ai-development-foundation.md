# AI Development Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a documented, automatically enforced development foundation with a minimal Phaser 4/Vite boot shell and no gameplay.

**Architecture:** Keep all future simulation rules in pure TypeScript layers and treat Phaser as a presentation adapter. Enforce layer direction and cycles with dependency-cruiser, use strict TypeScript and ESLint for local correctness, and expose one stable check command shared by agents and CI.

**Tech Stack:** Phaser 4, Vite, TypeScript, npm, ESLint flat config, Prettier, dependency-cruiser, Vitest, Playwright, GitHub Actions

**Design specification:** `docs/superpowers/specs/2026-07-26-ai-development-foundation-design.md`

---

## Scope Guard

This plan creates the toolchain, documentation, source boundaries, and a blank boot scene. It does not implement hexes, terrain, buildings, population, resources, turns, saves, or other gameplay. Use the latest mutually compatible package versions and commit the complete resolution in `package-lock.json`.

### Task 1: Create the Vite and TypeScript Toolchain

**Files:**

- Create: `package.json`
- Create: `package-lock.json` through npm
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `.nvmrc`
- Create: `tsconfig.core.json`
- Create: `src/core/environment.d.ts`
- Create: `.gitignore`
- Create: `.prettierignore`
- Create: `.prettierrc.json`

- [ ] **Step 1: Verify the repository is still documentation-only**

Run:

```bash
git status --short
rg --files -g '!docs/**' -g '!README.md'
```

Expected: only the already-approved documentation changes are present; there is no existing app scaffold to preserve.

- [ ] **Step 2: Create the npm manifest**

Create `package.json` with:

```json
{
  "name": "ascension",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "engines": {
    "node": "24.x"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit && tsc --project tsconfig.core.json",
    "test": "vitest run --passWithNoTests",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "arch:check": "depcruise --config dependency-cruiser.config.cjs src",
    "check": "npm run format:check && npm run lint && npm run arch:check && npm run typecheck && npm run test && npm run build"
  }
}
```

Create `.nvmrc` containing `24`, then run:

```bash
node --version
```

Expected: `v24.x`. If the environment reports another major, switch to Node 24 before installing dependencies.

- [ ] **Step 3: Install current runtime and development packages**

Run:

```bash
npm install phaser@latest
npm install --save-dev vite@latest typescript@~6.0.3 @types/node@24 eslint@latest @eslint/js@latest typescript-eslint@latest eslint-config-prettier@latest prettier@latest globals@latest dependency-cruiser@latest vitest@latest @playwright/test@latest
```

Expected: npm succeeds without peer-dependency overrides and writes exact versions to `package-lock.json`. TypeScript is the newest release currently accepted by `typescript-eslint`; re-check that peer range during execution rather than forcing an incompatible `@latest`.

- [ ] **Step 4: Add strict compiler and Vite configuration**

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "skipLibCheck": true,
    "types": ["node", "vite/client", "vitest/globals"]
  },
  "include": ["src", "tests", "vite.config.ts", "playwright.config.ts"]
}
```

Create `tsconfig.core.json` so browser and Node globals cannot enter the simulation:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "lib": ["ES2022"],
    "types": []
  },
  "include": ["src/core/**/*.ts"]
}
```

Create `src/core/environment.d.ts` containing only `export {};`. This gives the dedicated core compiler a stable input before gameplay exists; it defines no runtime API.

Create `vite.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  server: { host: '0.0.0.0' },
  test: {
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 5: Add the HTML entry point and repository ignores**

Create `index.html` with a UTF-8 charset, responsive viewport, title `Ascension`, and an otherwise empty `<div id="game"></div>`. Do not add the module script until the boot-shell red test exists.

Create `.gitignore`:

```text
node_modules/
dist/
playwright-report/
test-results/
.vite/
```

Create `.prettierignore` with the same generated directories plus `package-lock.json`. Create `.prettierrc.json`:

```json
{
  "singleQuote": true,
  "trailingComma": "all"
}
```

- [ ] **Step 6: Confirm the empty shell builds**

Run:

```bash
npm run build
```

Expected: a successful empty-shell build. Every commit must remain buildable.

- [ ] **Step 7: Commit the toolchain**

```bash
git add package.json package-lock.json index.html tsconfig.json tsconfig.core.json vite.config.ts .nvmrc .gitignore .prettierignore .prettierrc.json src/core/environment.d.ts
git commit -m "build: add Phaser Vite toolchain"
```

### Task 2: Add the Minimal Phaser 4 Boot Shell

**Files:**

- Create: `playwright.config.ts`
- Create: `tests/e2e/boot.spec.ts`
- Create: `src/presentation/phaser/FoundationScene.ts`
- Create: `src/presentation/phaser/styles.css`
- Create: `src/bootstrap/main.ts`
- Modify: `index.html`

- [ ] **Step 1: Configure browser testing**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
```

- [ ] **Step 2: Write the failing Phaser boot test**

Create `tests/e2e/boot.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('boots the Phaser canvas without browser errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');

  await expect(page.locator('#game')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('#game canvas')).toBeVisible();
  expect(errors).toEqual([]);
});
```

- [ ] **Step 3: Install Chromium and verify the red test**

Run:

```bash
npx playwright install chromium
npm run test:e2e
```

Expected: failure because the empty shell never receives `data-ready` and has no canvas.

- [ ] **Step 4: Add a presentation-only Phaser Scene**

Create `src/presentation/phaser/FoundationScene.ts`:

```ts
import Phaser from 'phaser';

export class FoundationScene extends Phaser.Scene {
  public constructor() {
    super('foundation');
  }

  public create(): void {
    const { centerX, centerY } = this.cameras.main;
    const parent = document.querySelector('#game');
    if (!(parent instanceof HTMLElement)) {
      throw new Error('Missing #game host');
    }

    this.add
      .text(centerX, centerY, 'Ascension foundation ready', {
        color: '#d8e7ff',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '24px',
      })
      .setOrigin(0.5);

    parent.dataset.ready = 'true';
  }
}
```

Create `src/presentation/phaser/styles.css`:

```css
html,
body,
#game {
  width: 100%;
  height: 100%;
  margin: 0;
}

body {
  overflow: hidden;
  background: #080d18;
}

canvas {
  display: block;
}
```

- [ ] **Step 5: Add the composition root**

Create `src/bootstrap/main.ts`:

```ts
import Phaser from 'phaser';
import { FoundationScene } from '../presentation/phaser/FoundationScene';
import '../presentation/phaser/styles.css';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#080d18',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [FoundationScene],
});
```

Update `index.html` to load `<script type="module" src="/src/bootstrap/main.ts"></script>` after the existing `<div id="game"></div>`.

- [ ] **Step 6: Verify the browser test and production bundle**

Run:

```bash
npm run test:e2e
npm run typecheck
npm run build
```

Expected: one passing browser test, no TypeScript errors, and a successful Vite build. Phaser may produce a bundle-size warning; record it but do not optimize before gameplay exists. `npm run test` is allowed to report no unit tests at this foundation stage; do not add a meaningless production API solely to exercise Vitest.

- [ ] **Step 7: Commit the boot shell**

```bash
git add index.html playwright.config.ts tests/e2e src
git commit -m "feat: add minimal Phaser boot shell"
```

### Task 3: Enforce Code Quality and Layer Boundaries

**Files:**

- Create: `eslint.config.js`
- Create: `dependency-cruiser.config.cjs`

- [ ] **Step 1: Add ESLint flat configuration**

Create `eslint.config.js` using `@eslint/js`, `typescript-eslint`, `globals`, and `eslint-config-prettier`. Apply recommended JavaScript and TypeScript rules, ignore generated directories, declare Node globals for build/config files, and configure `no-restricted-imports` for `src/{core,application,content,infrastructure}/**/*.ts` so importing `phaser` or `phaser/*` is an error with the message `Phaser belongs in presentation or bootstrap`.

Do not enable stylistic ESLint rules already owned by Prettier.

- [ ] **Step 2: Add dependency-cruiser boundary rules**

Create `dependency-cruiser.config.cjs` exporting:

```js
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
    {
      name: 'core-is-independent',
      severity: 'error',
      from: { path: '^src/core' },
      to: {
        path: '^src/(application|content|presentation|infrastructure|bootstrap)',
      },
    },
    {
      name: 'application-does-not-depend-on-adapters',
      severity: 'error',
      from: { path: '^src/application' },
      to: {
        path: '^src/(content|presentation|infrastructure|bootstrap)',
      },
    },
    {
      name: 'content-does-not-depend-on-adapters',
      severity: 'error',
      from: { path: '^src/content' },
      to: {
        path: '^src/(application|presentation|infrastructure|bootstrap)',
      },
    },
    {
      name: 'infrastructure-depends-only-on-application-and-core',
      severity: 'error',
      from: { path: '^src/infrastructure' },
      to: { path: '^src/(content|presentation|bootstrap)' },
    },
    {
      name: 'presentation-depends-only-on-application-and-core',
      severity: 'error',
      from: { path: '^src/presentation' },
      to: { path: '^src/(content|infrastructure|bootstrap)' },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    exclude: { path: '(^|/)node_modules/' },
    tsConfig: { fileName: 'tsconfig.json' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'types', 'default'],
    },
  },
};
```

Use the installed dependency-cruiser version's initializer output as the authority if its current schema differs. Preserve the rule names and dependency intent; never weaken a rule merely to make the check pass.

- [ ] **Step 3: Verify the valid graph**

Run:

```bash
npm run lint
npm run arch:check
npm run typecheck
```

Expected: all pass.

- [ ] **Step 4: Prove the core boundary fails**

Temporarily create `src/core/architecture-probe.ts` containing `import Phaser from 'phaser'; void Phaser;`, then run:

```bash
npm run lint
```

Expected: non-zero exit with `Phaser belongs in presentation or bootstrap`. Replace the probe with `document.title = 'invalid';` and run `npm run typecheck`; expect a core type-check failure because DOM globals are unavailable. Delete the temporary probe and rerun lint and type-check successfully.

- [ ] **Step 5: Prove the graph rule fails**

Temporarily create `src/core/architecture-probe.ts` importing `FoundationScene` from `../presentation/phaser/FoundationScene`, then run:

```bash
npm run arch:check
```

Expected: non-zero exit naming `core-is-independent`. Delete the probe and rerun successfully.

- [ ] **Step 6: Commit enforceable boundaries**

```bash
git add eslint.config.js dependency-cruiser.config.cjs
git commit -m "build: enforce source architecture boundaries"
```

### Task 4: Write the Canonical Agent and Architecture Guides

**Files:**

- Create: `AGENTS.md`
- Create: `docs/development/AI_DEVELOPMENT_CYCLE.md`
- Create: `docs/development/ARCHITECTURE.md`
- Create: `docs/development/REFERENCE.md`
- Create: `docs/development/Decisions/README.md`
- Create: `docs/development/Decisions/000-template.md`
- Create: `docs/development/Decisions/001-phaser-4-presentation-adapter.md`
- Modify: `README.md`

- [ ] **Step 1: Create the concise agent entry point**

Write `AGENTS.md` with these mandatory sections:

1. Start here: read the relevant accepted decisions and architecture guide.
2. Scope contract: state acceptance criteria and non-goals before editing.
3. Skill routing: feature → brainstorm/plan/TDD; bug → systematic debugging; completion → verification.
4. Dependency law: core is pure, application owns use cases, Phaser stays in presentation/bootstrap.
5. Required cycle: failing test, smallest implementation, focused checks, full checks, diff review, decision record, logical commit.
6. Required commands: `npm run check`; add `npm run test:e2e` for presentation/integration work.
7. Stop conditions: conflicting acceptance criteria, accepted-decision conflict, destructive migration, or missing product choice.

Keep it below roughly 120 lines and link to detailed documents rather than copying them.

- [ ] **Step 2: Write the development cycle**

Create `docs/development/AI_DEVELOPMENT_CYCLE.md` from the nine-step cycle in the design specification. Include:

- task framing template: behavior, acceptance, non-goals, affected layer;
- red/green/refactor expectations;
- fast versus full verification commands;
- diff review checklist covering scope, duplicated rules, boundaries, nondeterminism, subscriptions, and generated files;
- evidence-based completion format.

- [ ] **Step 3: Write the architecture guide**

Create `docs/development/ARCHITECTURE.md` with the source tree, dependency diagram, responsibilities, allowed dependencies, state ownership, deterministic randomness rule, Phaser Scene lifecycle guidance, typed invalid-action behavior, and examples of where common future code belongs.

Explicitly identify Phaser 4 as replaceable presentation infrastructure, not authoritative game state.

- [ ] **Step 4: Create architecture decision records**

Create `docs/development/Decisions/README.md` and `000-template.md` using the same lifecycle and template structure as the game-design records in Task 5, but focused on durable technical choices.

Create accepted record `001-phaser-4-presentation-adapter.md` documenting:

- context: 2D management game now, possible 2D galaxy later;
- decision: Phaser 4 is the rendering/input/lifecycle adapter behind pure TypeScript rules;
- alternatives: PixiJS 8, Excalibur.js, Babylon.js, and Three.js;
- consequences: mature batteries-included 2D APIs and documentation, WebGL-first runtime, engine isolation requirement, and a future replacement seam;
- validation: the boot test now, followed by a later hex-grid pan/zoom/selection spike before gameplay architecture is expanded.

- [ ] **Step 5: Write the optimized reference**

Create `docs/development/REFERENCE.md` with:

- the condensed skill-routing table from the specification;
- one-sentence “use for” annotations for each official Phaser, Vite, Vitest, Playwright, dependency-cruiser, ESLint, and Ascendancy source;
- a warning that Phaser 3 tutorials may not match Phaser 4 renderer APIs;
- no copied tutorials or large excerpts.

- [ ] **Step 6: Replace the placeholder README**

Expand `README.md` with project purpose, current status (“foundation only; no gameplay”), prerequisites, setup, commands, architecture link, agent guide link, and design-decisions link.

- [ ] **Step 7: Check documentation formatting**

Run:

```bash
npm run format
npm run format:check
```

Expected: Prettier reports all matched files formatted.

- [ ] **Step 8: Commit the guides**

```bash
git add AGENTS.md README.md docs/development
git commit -m "docs: add agent development and architecture guides"
```

### Task 5: Create the Game-Design Decision System

**Files:**

- Create: `docs/gameDesign/Decisions/README.md`
- Create: `docs/gameDesign/Decisions/000-template.md`

- [ ] **Step 1: Define decision lifecycle and naming**

Create `docs/gameDesign/Decisions/README.md` specifying:

- file names use `NNN-kebab-case-title.md`;
- statuses are `Proposed`, `Accepted`, `Superseded`, or `Rejected`;
- accepted decision content is not rewritten, but status and supersession metadata may be updated;
- changed decisions create a new record and link both directions;
- exploratory quiz answers remain proposed until consequences and validation are reviewed;
- architecture-only decisions belong in `docs/development/Decisions`, not in game-design records.

- [ ] **Step 2: Create a copyable decision template**

Create `docs/gameDesign/Decisions/000-template.md`:

```md
# NNN: Decision title

- Status: Proposed
- Date: YYYY-MM-DD
- Supersedes: None
- Superseded by: None

## Context

Describe the player-facing problem and constraints.

## Decision

State the chosen rule precisely.

## Alternatives

List credible alternatives and why they were not selected.

## Consequences

Describe player experience, balance, UI, technical, and content effects.

## Validation

State how a prototype, playtest, or metric can disprove or confirm this decision.
```

The template intentionally contains instructional placeholders because it is copied for new records; the specification and plan placeholder scans must exclude this template.

- [ ] **Step 3: Do not prematurely record the hex model**

The fixed hex terrain plus adjacency concept remains exploratory. Do not create decision `001` until the design quiz resolves its core rules and the user accepts the resulting design section.

- [ ] **Step 4: Format and commit the decision system**

```bash
npm run format
git add docs/gameDesign/Decisions
git commit -m "docs: add game design decision records"
```

### Task 6: Add CI and Verify the Complete Foundation

**Files:**

- Create: `.github/workflows/quality.yml`
- Modify only if checks reveal defects: files introduced by Tasks 1–5

- [ ] **Step 1: Add the quality workflow**

Create `.github/workflows/quality.yml` triggered by pushes to `main` and pull requests. Pin Node 24 to match `.nvmrc` and `package.json`.

Give the workflow least-privilege read-only repository permissions and enable npm caching through `actions/setup-node`. Use separate jobs so failures are attributable:

- `architecture`: `npm ci`, then `npm run arch:check`;
- `quality`: `npm ci`, then formatting, lint, type-check, unit tests, and build;
- `browser`: `npm ci`, `npx playwright install --with-deps chromium`, then `npm run test:e2e`.

- [ ] **Step 2: Run all non-browser checks from a clean install**

From the existing installation, first run:

```bash
npm run check
```

Expected: formatting, lint, architecture, type-check, unit tests, and production build all pass.

Then verify reproducibility in a disposable temporary copy or clean CI checkout with `npm ci`; do not delete unrelated workspace files.

- [ ] **Step 3: Run browser verification**

Run:

```bash
npm run test:e2e
```

Expected: the Phaser boot test passes in Chromium with no page errors.

- [ ] **Step 4: Inspect the dependency and repository state**

Run:

```bash
npm outdated || true
! rg --line-number "\\b(TBD|TODO|FIXME|XXX)\\b|<placeholder>" -g '!**/Decisions/000-template.md' AGENTS.md README.md docs/development docs/gameDesign/Decisions/README.md
git diff --check
git status --short
```

Expected: `npm outdated` is informational because registry state can change after installation; the maintained documentation contains no unfinished placeholders; there are no whitespace errors; and only intended CI/fix changes are unstaged. Exclude `docs/gameDesign/Decisions/000-template.md` and `docs/development/Decisions/000-template.md` from placeholder scans because instructional fields are their purpose.

- [ ] **Step 5: Commit CI and any verified fixes**

```bash
git add .github/workflows/quality.yml
git commit -m "ci: enforce foundation quality gates"
```

If verification required a code/configuration fix, commit that fix separately with a message describing the defect.

- [ ] **Step 6: Final evidence**

Capture in the handoff:

- exact `npm run check` result;
- exact `npm run test:e2e` result;
- any Vite bundle warning;
- architecture negative-test evidence;
- confirmation that no gameplay was introduced.

The next activity is to resume the one-question-at-a-time game-design quiz, beginning with the combined fixed-terrain hex model.

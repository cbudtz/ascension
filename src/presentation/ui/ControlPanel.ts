import type { GameSnapshot } from '../../application/GameSession';
import type { BuildingId, TechnologyId } from '../../core/types';

export type ControlCommand =
  | { readonly type: 'end-turn' }
  | { readonly type: 'select-building'; readonly buildingId: BuildingId }
  | {
      readonly type: 'set-workers';
      readonly focus: 'research' | 'industry' | 'prosperity' | 'balanced';
    }
  | { readonly type: 'cycle-research' }
  | { readonly type: 'open-system' }
  | { readonly type: 'open-planet' };

export type ControlPanelState = {
  readonly view: 'planet' | 'system';
  readonly snapshot: GameSnapshot;
  readonly selectedBuilding: BuildingId | null;
  readonly message: string;
  readonly activeTechName: string | null;
  readonly projectLabel: string;
  readonly researchLines: ReadonlyArray<string>;
  readonly buildingOptions: ReadonlyArray<{
    readonly id: BuildingId;
    readonly name: string;
    readonly unlocked: boolean;
  }>;
};

type Listener = (command: ControlCommand) => void;

const BUILD_ORDER: ReadonlyArray<{ id: BuildingId; name: string }> = [
  { id: 'factory', name: 'Factory' },
  { id: 'lab', name: 'Lab' },
  { id: 'farm', name: 'Farm' },
  { id: 'transitTube', name: 'Tube' },
];

export class ControlPanel {
  private readonly listeners = new Set<Listener>();
  private readonly root: HTMLElement;

  public constructor(root: HTMLElement) {
    this.root = root;
    this.root.classList.add('control-panel');
    this.root.setAttribute('aria-label', 'Game controls');
    this.root.innerHTML = '';
    this.root.append(this.buildShell());
    this.bindClicks();
  }

  public onCommand(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public update(state: ControlPanelState): void {
    const { snapshot, view } = state;
    this.root.dataset.view = view;

    this.setText('.js-day', `Day ${snapshot.day}`);
    this.setText(
      '.js-vitals',
      `Pop ${snapshot.population} · Prosperity ${snapshot.prosperityPool}/10`,
    );
    this.setText(
      '.js-workers',
      `Workers R/I/P ${snapshot.workers.research}/${snapshot.workers.industry}/${snapshot.workers.prosperity}${snapshot.canChangeWorkers ? '' : ' · locked'}`,
    );
    this.setText(
      '.js-output',
      `Output R/I/P ${snapshot.production.research.total}/${snapshot.production.industry.total}/${snapshot.production.prosperity.total}`,
    );
    this.setText(
      '.js-project',
      `Queue: ${state.projectLabel} · Build: ${state.selectedBuilding ?? 'none'}`,
    );
    this.setText(
      '.js-science',
      `Science ${snapshot.scienceUnlocked ? 'open' : 'locked'} · ${state.activeTechName ?? 'none'} · Bank ${snapshot.bankedResearch}`,
    );
    this.setText(
      '.js-research',
      state.researchLines.length > 0
        ? state.researchLines.join('\n')
        : 'No research entries',
    );
    this.setText('.js-message', state.message);
    this.setText(
      '.js-victory',
      snapshot.victory ? 'Victory — Factory, Lab, and Farm complete' : '',
    );

    this.root
      .querySelector('.js-planet-controls')
      ?.classList.toggle('is-hidden', view !== 'planet');
    this.root
      .querySelector('.js-system-controls')
      ?.classList.toggle('is-hidden', view !== 'system');

    for (const option of state.buildingOptions) {
      const button = this.root.querySelector<HTMLButtonElement>(
        `[data-command="select-building"][data-building="${option.id}"]`,
      );
      if (button === null) {
        continue;
      }
      button.disabled = !option.unlocked;
      button.classList.toggle(
        'is-selected',
        state.selectedBuilding === option.id,
      );
      button.title = option.unlocked
        ? `Select ${option.name}`
        : `${option.name} blueprint locked`;
    }

    this.toggleDisabled(
      '[data-command="set-workers"]',
      !snapshot.canChangeWorkers || view !== 'planet',
    );
    this.toggleDisabled(
      '[data-command="cycle-research"]',
      !snapshot.scienceUnlocked || view !== 'planet',
    );
    this.toggleDisabled(
      '[data-command="open-system"]',
      !snapshot.systemViewUnlocked || view !== 'planet',
    );
    this.toggleDisabled('[data-command="end-turn"]', view !== 'planet');
  }

  private buildShell(): HTMLElement {
    const shell = document.createElement('div');
    shell.className = 'control-panel__inner';
    shell.innerHTML = `
      <header class="control-panel__header">
        <p class="control-panel__brand">Ascension</p>
        <p class="control-panel__day js-day">Day 0</p>
        <p class="control-panel__vitals js-vitals"></p>
      </header>
      <section class="control-panel__status" aria-live="polite">
        <p class="js-workers"></p>
        <p class="js-output"></p>
        <p class="js-project"></p>
        <p class="js-science"></p>
        <pre class="control-panel__research js-research"></pre>
        <p class="control-panel__victory js-victory"></p>
        <p class="control-panel__message js-message"></p>
      </section>
      <section class="control-panel__actions js-planet-controls">
        <div class="control-panel__group">
          <p class="control-panel__label">Turn</p>
          <button type="button" class="control-panel__button control-panel__button--primary" data-command="end-turn">End turn</button>
        </div>
        <div class="control-panel__group">
          <p class="control-panel__label">Build</p>
          <div class="control-panel__row">
            ${BUILD_ORDER.map(
              (building) =>
                `<button type="button" class="control-panel__button" data-command="select-building" data-building="${building.id}">${building.name}</button>`,
            ).join('')}
          </div>
          <p class="control-panel__hint">Research a blueprint, select it here, then tap a hex next to the capital</p>
        </div>
        <div class="control-panel__group">
          <p class="control-panel__label">Workers</p>
          <div class="control-panel__row">
            <button type="button" class="control-panel__button" data-command="set-workers" data-focus="research">Research</button>
            <button type="button" class="control-panel__button" data-command="set-workers" data-focus="industry">Industry</button>
            <button type="button" class="control-panel__button" data-command="set-workers" data-focus="prosperity">Prosperity</button>
            <button type="button" class="control-panel__button" data-command="set-workers" data-focus="balanced">Balance</button>
          </div>
        </div>
        <div class="control-panel__group">
          <p class="control-panel__label">Research</p>
          <button type="button" class="control-panel__button" data-command="cycle-research">Cycle research</button>
        </div>
        <div class="control-panel__group">
          <p class="control-panel__label">Navigate</p>
          <button type="button" class="control-panel__button" data-command="open-system">System view</button>
        </div>
      </section>
      <section class="control-panel__actions js-system-controls is-hidden">
        <div class="control-panel__group">
          <p class="control-panel__label">Navigate</p>
          <button type="button" class="control-panel__button control-panel__button--primary" data-command="open-planet">Back to planet</button>
        </div>
      </section>
    `;
    return shell;
  }

  private bindClicks(): void {
    this.root.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      const button = target.closest<HTMLButtonElement>('button[data-command]');
      if (button === null || button.disabled) {
        return;
      }
      const command = button.dataset.command;
      if (command === 'end-turn') {
        this.emit({ type: 'end-turn' });
        return;
      }
      if (command === 'select-building') {
        const buildingId = button.dataset.building as BuildingId | undefined;
        if (buildingId !== undefined) {
          this.emit({ type: 'select-building', buildingId });
        }
        return;
      }
      if (command === 'set-workers') {
        const focus = button.dataset.focus as
          'research' | 'industry' | 'prosperity' | 'balanced' | undefined;
        if (focus !== undefined) {
          this.emit({ type: 'set-workers', focus });
        }
        return;
      }
      if (command === 'cycle-research') {
        this.emit({ type: 'cycle-research' });
        return;
      }
      if (command === 'open-system') {
        this.emit({ type: 'open-system' });
        return;
      }
      if (command === 'open-planet') {
        this.emit({ type: 'open-planet' });
      }
    });
  }

  private emit(command: ControlCommand): void {
    for (const listener of this.listeners) {
      listener(command);
    }
  }

  private setText(selector: string, value: string): void {
    const node = this.root.querySelector(selector);
    if (node !== null) {
      node.textContent = value;
    }
  }

  private toggleDisabled(selector: string, disabled: boolean): void {
    for (const node of this.root.querySelectorAll<HTMLButtonElement>(
      selector,
    )) {
      node.disabled = disabled;
    }
  }
}

export function buildingOptionsFromSnapshot(
  snapshot: GameSnapshot,
  contentBuildings: ReadonlyArray<{
    readonly id: BuildingId;
    readonly name: string;
    readonly requiredTechnology: TechnologyId | null;
  }>,
): ControlPanelState['buildingOptions'] {
  return BUILD_ORDER.map((entry) => {
    const definition = contentBuildings.find((item) => item.id === entry.id);
    const required = definition?.requiredTechnology ?? null;
    const unlocked =
      required === null || snapshot.completedTechnologies.includes(required);
    return {
      id: entry.id,
      name: entry.name,
      unlocked,
    };
  });
}

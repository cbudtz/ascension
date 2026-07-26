import Phaser from 'phaser';

import type { GameSession, GameSnapshot } from '../../application/GameSession';
import { hexKey } from '../../core/hex';
import type { BuildingId, TechnologyId } from '../../core/types';
import {
  buildingOptionsFromSnapshot,
  type ControlCommand,
  type ControlPanel,
} from '../ui/ControlPanel';
import {
  axialToPixel,
  BUILDING_COLORS,
  pixelToAxial,
  TERRAIN_COLORS,
} from './hexRender';

const HEX_SIZE = 28;

export class PlanetScene extends Phaser.Scene {
  private session!: GameSession;
  private mapRoot!: Phaser.GameObjects.Container;
  private selectedBuilding: BuildingId = 'factory';
  private message = '';
  private hudHost: HTMLElement | null = null;
  private controls: ControlPanel | null = null;
  private unsubscribeControls: (() => void) | null = null;

  public constructor() {
    super('planet');
  }

  public init(data: { session: GameSession }): void {
    this.session = data.session;
  }

  public create(): void {
    this.cameras.main.setBackgroundColor('#0b1524');
    this.mapRoot = this.add.container(0, 0);

    const controls = this.game.registry.get('controls');
    if (controls !== undefined && controls !== null) {
      this.controls = controls as ControlPanel;
      this.unsubscribeControls = this.controls.onCommand((command) => {
        this.handleCommand(command);
      });
    }

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      const localX = worldPoint.x - this.mapRoot.x;
      const localY = worldPoint.y - this.mapRoot.y;
      const hex = pixelToAxial(localX, localY, HEX_SIZE);
      const result = this.session.queueBuild(this.selectedBuilding, hex);
      this.message = result.ok
        ? `Queued ${this.selectedBuilding}`
        : result.error;
      this.refresh();
    });

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      this.handleKey(event.key.toLowerCase());
    });

    const parent = document.querySelector('#game');
    if (parent instanceof HTMLElement) {
      parent.dataset.ready = 'true';
      parent.dataset.view = 'planet';
      this.hudHost = parent;
    }

    this.refresh();
    this.scale.on('resize', () => this.centerMap());
  }

  public shutdown(): void {
    this.unsubscribeControls?.();
    this.unsubscribeControls = null;
    this.input.keyboard?.removeAllListeners();
    this.input.removeAllListeners();
    this.scale.removeAllListeners();
  }

  private handleCommand(command: ControlCommand): void {
    const snapshot = this.session.snapshot();
    if (command.type === 'end-turn') {
      const result = this.session.endTurn();
      this.message = result.ok ? `Day ${result.value.day}` : result.error;
      this.refresh();
      return;
    }
    if (command.type === 'select-building') {
      this.selectedBuilding = command.buildingId;
      this.message = `Selected ${command.buildingId}`;
      this.refresh();
      return;
    }
    if (command.type === 'set-workers') {
      this.applyWorkerFocus(snapshot, command.focus);
      this.refresh();
      return;
    }
    if (command.type === 'cycle-research') {
      this.cycleResearch(snapshot);
      this.refresh();
      return;
    }
    if (command.type === 'open-system' && snapshot.systemViewUnlocked) {
      this.scene.start('system', { session: this.session });
    }
  }

  private handleKey(key: string): void {
    const snapshot = this.session.snapshot();
    if (key === 'enter' || key === 'e') {
      this.handleCommand({ type: 'end-turn' });
      return;
    }
    if (key === '1') {
      this.handleCommand({ type: 'select-building', buildingId: 'factory' });
      return;
    }
    if (key === '2') {
      this.handleCommand({ type: 'select-building', buildingId: 'lab' });
      return;
    }
    if (key === '3') {
      this.handleCommand({ type: 'select-building', buildingId: 'farm' });
      return;
    }
    if (key === '4') {
      this.handleCommand({
        type: 'select-building',
        buildingId: 'transitTube',
      });
      return;
    }
    if (key === 'q') {
      this.handleCommand({ type: 'set-workers', focus: 'research' });
      return;
    }
    if (key === 'w') {
      this.handleCommand({ type: 'set-workers', focus: 'industry' });
      return;
    }
    if (key === 'a') {
      this.handleCommand({ type: 'set-workers', focus: 'prosperity' });
      return;
    }
    if (key === 's') {
      this.handleCommand({ type: 'set-workers', focus: 'balanced' });
      return;
    }
    if (key === 'r') {
      this.handleCommand({ type: 'cycle-research' });
      return;
    }
    if (key === 'v' && snapshot.systemViewUnlocked) {
      this.handleCommand({ type: 'open-system' });
    }
  }

  private applyWorkerFocus(
    snapshot: GameSnapshot,
    focus: 'research' | 'industry' | 'prosperity' | 'balanced',
  ): void {
    if (!snapshot.canChangeWorkers) {
      this.message = 'Colony Planning required to reassign workers';
      return;
    }
    if (focus === 'research') {
      this.tryWorkers({
        research: snapshot.population,
        industry: 0,
        prosperity: 0,
      });
      return;
    }
    if (focus === 'industry') {
      this.tryWorkers({
        research: 0,
        industry: snapshot.population,
        prosperity: 0,
      });
      return;
    }
    if (focus === 'prosperity') {
      this.tryWorkers({
        research: 0,
        industry: 0,
        prosperity: snapshot.population,
      });
      return;
    }
    const share = Math.floor(snapshot.population / 3);
    const remainder = snapshot.population - share * 3;
    this.tryWorkers({
      research: share + (remainder > 0 ? 1 : 0),
      industry: share + (remainder > 1 ? 1 : 0),
      prosperity: share,
    });
  }

  private tryWorkers(next: GameSnapshot['workers']): void {
    const result = this.session.setWorkers(next);
    this.message = result.ok ? 'Workers updated' : result.error;
  }

  private cycleResearch(snapshot: GameSnapshot): void {
    if (!snapshot.scienceUnlocked) {
      this.message = 'Science unlocks after the first end turn';
      return;
    }
    const content = this.session.getContent();
    const choices = content.technologies.filter((technology) => {
      if (!technology.researchableInSlice1) {
        return false;
      }
      if (snapshot.completedTechnologies.includes(technology.id)) {
        return false;
      }
      return technology.prerequisites.every((id) =>
        snapshot.completedTechnologies.includes(id),
      );
    });
    if (choices.length === 0) {
      this.message = 'No researchable technologies';
      return;
    }
    const currentIndex = choices.findIndex(
      (technology) => technology.id === snapshot.activeTechnologyId,
    );
    const next = choices[(currentIndex + 1) % choices.length];
    if (next === undefined) {
      return;
    }
    const result = this.session.selectTech(next.id as TechnologyId);
    this.message = result.ok ? `Researching ${next.name}` : result.error;
  }

  private refresh(): void {
    const snapshot = this.session.snapshot();
    this.drawMap(snapshot);
    this.centerMap();
    this.syncControls(snapshot);
    if (this.hudHost !== null) {
      this.hudHost.dataset.view = 'planet';
      this.hudHost.dataset.day = String(snapshot.day);
      this.hudHost.dataset.science = snapshot.scienceUnlocked
        ? 'open'
        : 'locked';
      this.hudHost.dataset.victory = snapshot.victory ? 'true' : 'false';
    }
  }

  private syncControls(snapshot: GameSnapshot): void {
    if (this.controls === null) {
      return;
    }
    const content = this.session.getContent();
    const active = content.technologies.find(
      (technology) => technology.id === snapshot.activeTechnologyId,
    );
    const project = snapshot.construction
      ? `${snapshot.construction.buildingId} ${snapshot.construction.progress}/${snapshot.construction.cost}`
      : 'none';
    const researchLines = content.technologies.map((technology) => {
      const done = snapshot.completedTechnologies.includes(technology.id);
      const progress = snapshot.researchProgress[technology.id] ?? 0;
      if (!technology.researchableInSlice1) {
        return `${technology.name}: future update`;
      }
      if (done) {
        return `${technology.name}: done`;
      }
      return `${technology.name}: ${progress}/${technology.researchCost}`;
    });

    this.controls.update({
      view: 'planet',
      snapshot,
      selectedBuilding: this.selectedBuilding,
      message: this.message,
      activeTechName: active?.name ?? null,
      projectLabel: project,
      researchLines,
      buildingOptions: buildingOptionsFromSnapshot(snapshot, content.buildings),
    });
  }

  private centerMap(): void {
    this.mapRoot.setPosition(this.scale.width * 0.5, this.scale.height * 0.52);
  }

  private drawMap(snapshot: GameSnapshot): void {
    this.mapRoot.removeAll(true);
    const content = this.session.getContent();
    const buildingByHex = new Map(
      snapshot.buildings.map((building) => [hexKey(building.hex), building]),
    );

    for (const cell of content.cells) {
      const point = axialToPixel(cell.hex, HEX_SIZE);
      const color = TERRAIN_COLORS[cell.terrain] ?? TERRAIN_COLORS.neutral;
      const hexagon = this.add
        .polygon(point.x, point.y, this.hexPoints(HEX_SIZE), color, 1)
        .setStrokeStyle(1, 0x0a1018, 0.9);
      this.mapRoot.add(hexagon);

      const building = buildingByHex.get(hexKey(cell.hex));
      if (building !== undefined) {
        const marker = this.add.circle(
          point.x,
          point.y,
          building.buildingId === 'capital' ? 10 : 7,
          BUILDING_COLORS[building.buildingId] ?? 0xffffff,
        );
        this.mapRoot.add(marker);
      }
    }
  }

  private hexPoints(size: number): number[] {
    const points: number[] = [];
    for (let i = 0; i < 6; i += 1) {
      const angle = (Math.PI / 180) * (60 * i - 30);
      points.push(size * Math.cos(angle), size * Math.sin(angle));
    }
    return points;
  }
}

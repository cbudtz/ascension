import Phaser from 'phaser';

import type { GameSession, GameSnapshot } from '../../application/GameSession';
import { hexKey } from '../../core/hex';
import type { BuildingId, TechnologyId } from '../../core/types';
import {
  axialToPixel,
  BUILDING_COLORS,
  pixelToAxial,
  TERRAIN_COLORS,
} from './hexRender';

const HEX_SIZE = 28;

export class PlanetScene extends Phaser.Scene {
  private session!: GameSession;
  private statusText!: Phaser.GameObjects.Text;
  private mapRoot!: Phaser.GameObjects.Container;
  private selectedBuilding: BuildingId = 'factory';
  private message = '';

  public constructor() {
    super('planet');
  }

  public init(data: { session: GameSession }): void {
    this.session = data.session;
  }

  public create(): void {
    this.cameras.main.setBackgroundColor('#0b1524');
    this.mapRoot = this.add.container(0, 0);
    this.statusText = this.add
      .text(16, 12, '', {
        color: '#d8e7ff',
        fontFamily: 'Georgia, serif',
        fontSize: '14px',
        lineSpacing: 4,
      })
      .setScrollFactor(0)
      .setDepth(10);

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.y < 160) {
        return;
      }
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
    }

    this.refresh();
    this.scale.on('resize', () => this.centerMap());
  }

  public shutdown(): void {
    this.input.keyboard?.removeAllListeners();
    this.input.removeAllListeners();
    this.scale.removeAllListeners();
  }

  private handleKey(key: string): void {
    const snapshot = this.session.snapshot();
    if (key === 'enter' || key === 'e') {
      const result = this.session.endTurn();
      this.message = result.ok ? `Day ${result.value.day}` : result.error;
      this.refresh();
      return;
    }
    if (key === '1') this.selectedBuilding = 'factory';
    if (key === '2') this.selectedBuilding = 'lab';
    if (key === '3') this.selectedBuilding = 'farm';
    if (key === '4') this.selectedBuilding = 'transitTube';
    if (key === 'q' && snapshot.canChangeWorkers) {
      this.tryWorkers({
        research: snapshot.population,
        industry: 0,
        prosperity: 0,
      });
    }
    if (key === 'w' && snapshot.canChangeWorkers) {
      this.tryWorkers({
        research: 0,
        industry: snapshot.population,
        prosperity: 0,
      });
    }
    if (key === 'a' && snapshot.canChangeWorkers) {
      this.tryWorkers({
        research: 0,
        industry: 0,
        prosperity: snapshot.population,
      });
    }
    if (key === 's' && snapshot.canChangeWorkers) {
      const share = Math.floor(snapshot.population / 3);
      const remainder = snapshot.population - share * 3;
      this.tryWorkers({
        research: share + (remainder > 0 ? 1 : 0),
        industry: share + (remainder > 1 ? 1 : 0),
        prosperity: share,
      });
    }
    if (key === 'r' && snapshot.scienceUnlocked) {
      this.cycleResearch(snapshot);
    }
    if (key === 'v' && snapshot.systemViewUnlocked) {
      this.scene.start('system', { session: this.session });
    }
    this.refresh();
  }

  private tryWorkers(next: GameSnapshot['workers']): void {
    const result = this.session.setWorkers(next);
    this.message = result.ok ? 'Workers updated' : result.error;
  }

  private cycleResearch(snapshot: GameSnapshot): void {
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
    this.statusText.setText(this.buildHud(snapshot));
  }

  private centerMap(): void {
    this.mapRoot.setPosition(this.scale.width * 0.55, this.scale.height * 0.55);
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

  private buildHud(snapshot: GameSnapshot): string {
    const content = this.session.getContent();
    const active = content.technologies.find(
      (technology) => technology.id === snapshot.activeTechnologyId,
    );
    const project = snapshot.construction
      ? `${snapshot.construction.buildingId} ${snapshot.construction.progress}/${snapshot.construction.cost}`
      : 'none';
    const techLines = content.technologies
      .map((technology) => {
        const done = snapshot.completedTechnologies.includes(technology.id);
        const progress = snapshot.researchProgress[technology.id] ?? 0;
        if (!technology.researchableInSlice1) {
          return `  ${technology.name}: future update`;
        }
        if (done) {
          return `  ${technology.name}: done`;
        }
        return `  ${technology.name}: ${progress}/${technology.researchCost}`;
      })
      .join('\n');

    return [
      'ASCENSION — Homeworld',
      `Day ${snapshot.day}   Pop ${snapshot.population}   Prosperity ${snapshot.prosperityPool}/10`,
      `Workers R/I/P: ${snapshot.workers.research}/${snapshot.workers.industry}/${snapshot.workers.prosperity}${snapshot.canChangeWorkers ? '' : ' (locked)'}`,
      `Output R/I/P: ${snapshot.production.research.total}/${snapshot.production.industry.total}/${snapshot.production.prosperity.total}`,
      `Build select: ${this.selectedBuilding}   Queue: ${project}`,
      `Science: ${snapshot.scienceUnlocked ? 'open' : 'unlocks after first end turn'}   Active: ${active?.name ?? 'none'}   Banked RP: ${snapshot.bankedResearch}`,
      techLines,
      snapshot.victory ? 'VICTORY — Factory, Lab, and Farm complete' : '',
      snapshot.systemViewUnlocked ? 'Press V for solar system' : '',
      'Keys: E end turn | 1 Factory 2 Lab 3 Farm 4 Tube | Q/W/A focus R/I/P | S balance | R cycle research | click hex to queue',
      this.message,
    ]
      .filter((line) => line.length > 0)
      .join('\n');
  }
}

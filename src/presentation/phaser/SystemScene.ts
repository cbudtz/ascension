import Phaser from 'phaser';

import type { GameSession } from '../../application/GameSession';
import {
  buildingOptionsFromSnapshot,
  type ControlCommand,
  type ControlPanel,
} from '../ui/ControlPanel';

export class SystemScene extends Phaser.Scene {
  private session!: GameSession;
  private controls: ControlPanel | null = null;
  private unsubscribeControls: (() => void) | null = null;
  private hudHost: HTMLElement | null = null;

  public constructor() {
    super('system');
  }

  public init(data: { session: GameSession }): void {
    this.session = data.session;
  }

  public create(): void {
    this.cameras.main.setBackgroundColor('#050814');
    const { centerX, centerY } = this.cameras.main;

    const controls = this.game.registry.get('controls');
    if (controls !== undefined && controls !== null) {
      this.controls = controls as ControlPanel;
      this.unsubscribeControls = this.controls.onCommand((command) => {
        this.handleCommand(command);
      });
    }

    this.add.circle(centerX, centerY, 36, 0xffcc66);
    this.add
      .text(centerX, centerY + 70, 'Home star', {
        color: '#ffe6a8',
        fontFamily: 'Georgia, serif',
        fontSize: '16px',
      })
      .setOrigin(0.5);

    const home = this.add.circle(centerX + 140, centerY - 20, 18, 0x4aa3ff);
    home.setInteractive({ useHandCursor: true });
    home.on('pointerdown', () => {
      this.returnToPlanet();
    });
    this.add
      .text(centerX + 140, centerY + 18, 'Homeworld', {
        color: '#d8e7ff',
        fontFamily: 'Georgia, serif',
        fontSize: '14px',
      })
      .setOrigin(0.5);

    const locked = [
      { x: centerX - 160, y: centerY + 40, label: 'Locked world' },
      { x: centerX + 40, y: centerY - 120, label: 'Locked world' },
      { x: centerX - 40, y: centerY + 130, label: 'Locked world' },
    ];
    for (const world of locked) {
      this.add.circle(world.x, world.y, 12, 0x445566);
      this.add
        .text(world.x, world.y + 22, world.label, {
          color: '#8899aa',
          fontFamily: 'Georgia, serif',
          fontSize: '12px',
        })
        .setOrigin(0.5);
    }

    this.add.text(
      16,
      16,
      'Solar system — return via the control panel or Homeworld',
      {
        color: '#d8e7ff',
        fontFamily: 'Georgia, serif',
        fontSize: '16px',
      },
    );

    this.input.keyboard?.on('keydown-B', () => {
      this.returnToPlanet();
    });

    const parent = document.querySelector('#game');
    if (parent instanceof HTMLElement) {
      parent.dataset.view = 'system';
      this.hudHost = parent;
    }

    this.syncControls();
  }

  public shutdown(): void {
    this.unsubscribeControls?.();
    this.unsubscribeControls = null;
    this.input.keyboard?.removeAllListeners();
    this.input.removeAllListeners();
  }

  private handleCommand(command: ControlCommand): void {
    if (command.type === 'open-planet') {
      this.returnToPlanet();
    }
  }

  private returnToPlanet(): void {
    this.scene.start('planet', { session: this.session });
  }

  private syncControls(): void {
    if (this.controls === null) {
      return;
    }
    const snapshot = this.session.snapshot();
    const content = this.session.getContent();
    const active = content.technologies.find(
      (technology) => technology.id === snapshot.activeTechnologyId,
    );
    this.controls.update({
      view: 'system',
      snapshot,
      selectedBuilding: null,
      message: 'Solar system teaser — more worlds locked for later updates',
      activeTechName: active?.name ?? null,
      projectLabel: snapshot.construction
        ? `${snapshot.construction.buildingId} ${snapshot.construction.progress}/${snapshot.construction.cost}`
        : 'none',
      researchLines: [],
      buildingOptions: buildingOptionsFromSnapshot(snapshot, content.buildings),
    });
    if (this.hudHost !== null) {
      this.hudHost.dataset.view = 'system';
    }
  }
}

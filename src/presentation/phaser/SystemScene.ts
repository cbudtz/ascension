import Phaser from 'phaser';

import type { GameSession } from '../../application/GameSession';

export class SystemScene extends Phaser.Scene {
  private session!: GameSession;

  public constructor() {
    super('system');
  }

  public init(data: { session: GameSession }): void {
    this.session = data.session;
  }

  public create(): void {
    this.cameras.main.setBackgroundColor('#050814');
    const { centerX, centerY } = this.cameras.main;

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
      this.scene.start('planet', { session: this.session });
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
      'Solar system — click Homeworld or press B to return',
      {
        color: '#d8e7ff',
        fontFamily: 'Georgia, serif',
        fontSize: '16px',
      },
    );

    this.input.keyboard?.on('keydown-B', () => {
      this.scene.start('planet', { session: this.session });
    });
  }

  public shutdown(): void {
    this.input.keyboard?.removeAllListeners();
    this.input.removeAllListeners();
  }
}

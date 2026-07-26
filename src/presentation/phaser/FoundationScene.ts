import Phaser from 'phaser';

export class FoundationScene extends Phaser.Scene {
  constructor() {
    super('foundation');
  }

  create(): void {
    const parent = this.game.canvas.parentElement;

    if (!(parent instanceof HTMLElement) || !parent.matches('#game')) {
      throw new Error('Missing #game host');
    }

    const camera = this.cameras.main;

    this.add
      .text(camera.centerX, camera.centerY, 'Ascension foundation ready', {
        color: '#d8e7ff',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '24px',
      })
      .setOrigin(0.5);

    parent.dataset.ready = 'true';
  }
}

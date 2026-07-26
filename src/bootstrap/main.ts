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

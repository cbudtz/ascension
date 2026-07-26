import Phaser from 'phaser';

import { GameSession } from '../application/GameSession';
import { createSlice1Content, toColonyContent } from '../content';
import { PlanetScene } from '../presentation/phaser/PlanetScene';
import { SystemScene } from '../presentation/phaser/SystemScene';
import '../presentation/phaser/styles.css';

const session = new GameSession(toColonyContent(createSlice1Content()));

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#0b1524',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [],
});

game.scene.add('planet', PlanetScene, true, { session });
game.scene.add('system', SystemScene, false);

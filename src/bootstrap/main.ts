import Phaser from 'phaser';

import { GameSession } from '../application/GameSession';
import { createSlice1Content, toColonyContent } from '../content';
import { PlanetScene } from '../presentation/phaser/PlanetScene';
import { SystemScene } from '../presentation/phaser/SystemScene';
import '../presentation/phaser/styles.css';
import { ControlPanel } from '../presentation/ui/ControlPanel';

const session = new GameSession(toColonyContent(createSlice1Content()));

const panelRoot = document.querySelector('#control-panel');
if (!(panelRoot instanceof HTMLElement)) {
  throw new Error('Missing #control-panel root');
}
const controls = new ControlPanel(panelRoot);

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

game.registry.set('controls', controls);
game.scene.add('planet', PlanetScene, true, { session });
game.scene.add('system', SystemScene, false);

import Phaser from 'phaser';
import {Main} from './scenes/Main';
import {useLayoutEffect} from 'react';
import {VIEW_SIZE} from './constants/config';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: VIEW_SIZE.x,
  height: VIEW_SIZE.y,
  scene: [Main],
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {x: 0, y: 0},
      debug: false,
    },
  },
};

function App() {
  useLayoutEffect(() => {
    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="game-container"></div>;
}

export default App;

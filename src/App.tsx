import Phaser from 'phaser';
import {Main} from './game/scenes/Main';
import {useLayoutEffect} from 'react';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [Main],
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {x: 0, y: 300},
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

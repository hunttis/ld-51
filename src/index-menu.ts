import { MenuScene } from "./scenes/menuScene";
import { GameScene } from "./scenes/gameScene";
import { GameOverScene } from "./scenes/gameOverScene";

import "vite/types/importMeta.d"; // Not needed when not using TypeScript

const hotReload = false;

export function startGame() {
  console.log('MENU DEV!')
  const config: Phaser.Types.Core.GameConfig = {
    title: "Phaser game example",
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 500 },
        debug: true
      }
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1280,
      height: 768,
    },
    backgroundColor: '#5588aa',
    parent: "game",
    scene: [MenuScene, GameOverScene, GameScene],
  };

  return new Phaser.Game(config);
}

// This prevents hot reload, which is useful when you're developing in live share
if (!hotReload && import.meta.hot) {
  import.meta.hot.on("vite:beforeFullReload", () => {
    throw "(skipping full reload)";
  });
}

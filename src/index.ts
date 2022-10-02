import { GameScene } from "./scenes/gameScene";
import "vite/types/importMeta.d"; // Not needed when not using TypeScript
import { GameFinishedScene } from "./scenes/gameFinishedScene";
import { GameOverScene } from "./scenes/gameOverScene";
import { MenuScene } from "./scenes/menuScene";

const hotReload = false;

export function startGame() {
  const config: Phaser.Types.Core.GameConfig = {
    title: "Phaser game example",
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 500 },
        // debug: true,
        // debugShowBody: true,
        // debugShowStaticBody: true,
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
    scene: [GameScene, GameFinishedScene, MenuScene, GameOverScene],
  };

  return new Phaser.Game(config);
}

// This prevents hot reload, which is useful when you're developing in live share
if (!hotReload && import.meta.hot) {
  import.meta.hot.on("vite:beforeFullReload", () => {
    throw "(skipping full reload)";
  });
}

import { Player } from "../gameobjects/player";

export class GameScene extends Phaser.Scene {
  TILE_SIZE = 64;
  player!: Player;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    // this.load.tilemapTiledJSON("level", "../assets/maps/testlevel.json");
    this.load.tilemapCSV("level", "../assets/maps/testlevel.csv");
    this.load.image("level-tiles", "assets/images/tiles.png");
    this.load.image("player", "assets/images/player.png");
  }

  create() {
    const map = this.make.tilemap({ key: "level" });
    console.log("Tilemap loaded", map)
    const tileset = map.addTilesetImage("tiles", "level-tiles");
    const layer = map.createLayer("platforms", "tiles", 0, 0);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.player = new Player(this, 100, 100)
    this.physics.world.enable(this.player)
    this.add.existing(this.player)
  }

  update (delta: number) {
    this.checkKeyPresses(delta)
  }

  checkKeyPresses(delta: number) {
    if (this.cursors.left.isDown) { // left
      this.player.moveLeft(delta);
    } else if (this.cursors.right.isDown) { // right
      this.player.moveRight(delta);
    }
    
    if (this.cursors.up.isDown || this.cursors.space.isDown) { // up || space

    }
    
    if (this.cursors.down.isDown) { // down

    }
    
    if (this.cursors.shift.isDown) { // shift
        
    }
}
}

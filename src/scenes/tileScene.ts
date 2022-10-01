import { Player } from "../gameobjects/player";

export class GameScene extends Phaser.Scene {
  TILE_SIZE = 64;
  player!: Player;

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

    this.player = new Player(this, 100, 100)
    this.add.existing(this.player)
  }
}

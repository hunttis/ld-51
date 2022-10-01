import { Player } from "../gameobjects/player";
import { Collectible } from "../gameobjects/collectible";
import { SwitchingLevel } from "../gameobjects/switchinglevel";

export class GameScene extends Phaser.Scene {
  TILE_SIZE = 64;
  player!: Player;
  collectible!: Collectible;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  tenSecondTimer: number = 10;
  timerUI!: Phaser.GameObjects.Text;
  playerPos!: Phaser.GameObjects.Text;
  dashingUI!: Phaser.GameObjects.Text;
  jumpingUI!: Phaser.GameObjects.Text;
  speedUI!: Phaser.GameObjects.Text;
  switchingLevel!: SwitchingLevel;
  collectibleCollider!: Phaser.Physics.Arcade.Collider;

  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.tilemapTiledJSON("level", "../assets/maps/testlevel.json");
    this.load.image("level-tiles", "assets/maps/tiles.png");
    this.load.image("player", "assets/images/player.png");
    this.load.image("collectible", "assets/images/collectible.png");
  }

  create() {

    this.switchingLevel = new SwitchingLevel(this);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.world.setBoundsCollision(true, true, false, false);

    this.player = new Player(this, 100, 350)
    //this.player.create();
    this.physics.world.enable(this.player)
    this.add.existing(this.player)

    this.collectible = new Collectible(this, this.TILE_SIZE * 18.5, this.TILE_SIZE * 4.5, "collectible");
    this.physics.world.enable(this.collectible, Phaser.Physics.Arcade.STATIC_BODY);
    this.add.existing(this.collectible);
    
    this.collectibleCollider = this.physics.add.collider(this.player, this.collectible, (_player, item) => {
      item.destroy();
    });

    this.timerUI = this.add.text(1200, 25, this.tenSecondTimer.toString());
    this.playerPos = this.add.text(600, 25, '');
    this.dashingUI = this.add.text(100, 25, '-');
    this.jumpingUI = this.add.text(100, 45, '-');
    this.speedUI = this.add.text(100, 65, '-');

    this.switchingLevel.createActiveLayerCollider();

    this.player.create();

    this.physics.world.on('worldbounds', (obj: Phaser.Physics.Arcade.Body, _: boolean, hitGround: boolean) => {
      console.log('Boundary collision', hitGround);
    });
  }

  update (time: number, delta: number) {
    this.checkKeyPresses(time, delta)

    this.player.update(time, delta)
    this.tenSecondTimer -= delta / 1000;
    if (this.tenSecondTimer < 0) {
      this.tenSecondTimer = 10;
      this.switchingLevel.changeLayer()
    }
    this.timerUI.text = this.tenSecondTimer.toFixed(2)

    this.switchingLevel.update(time, delta)
    // console.log(this.player.hasDashed)
    this.dashingUI.text = (this.player.dashingHasCoolDowned ? 'dash ready' : '-') + '; ' + /*(this.player.canDoubleDash ? '2nd dash ready' : '-') + '; ' +*/ (this.player.hasDashed ? 'dashing' : '-') + ';'
    this.jumpingUI.text = (this.player.hasJumped ? 'jumping' : '-') + '; ' + (this.player.hasDoubleJumped ? 'double jumped' : '-') + ';'
    this.speedUI.text = this.player.body.velocity.x + ';' + this.player.body.velocity.y;
    this.playerPos.text = this.player.x.toFixed(2) + ',' + this.player.y.toFixed(2);
  }



  checkKeyPresses(time: number, delta: number) {
    if (this.cursors.up.isDown || this.cursors.space.isDown) { // up || space
      this.player.jump(time, delta)
    } else {
      this.player.jumpButtonReleased()
    }
    
    if (this.cursors.down.isDown) { // down
      this.player.tempStop(time, delta);
    }
    
    if (this.cursors.shift.isDown) { // shift
      this.player.dash(time, delta)
    } else {
      this.player.dashButtonReleased()
    }
    
    if (this.cursors.left.isDown) { // left
      this.player.moveLeft(time, delta)
    } else if (this.cursors.right.isDown) { // right
      this.player.moveRight(time, delta)
    }
  }

  getPlayer() {
    return this.player;
  }
}

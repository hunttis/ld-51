import { Player } from "../gameobjects/player";
import { Collectible } from "../gameobjects/collectible";
import { SwitchingLevel } from "../gameobjects/switchinglevel";

export class GameScene extends Phaser.Scene {
  TILE_SIZE = 64;

  player!: Player;
  collectible!: Collectible;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  tenSecondTimer: number = 10;
  timerUI!: Phaser.GameObjects.Text;
  dashingUI!: Phaser.GameObjects.Text;
  jumpingUI!: Phaser.GameObjects.Text;
  speedUI!: Phaser.GameObjects.Text;
  collectablesUI!: Phaser.GameObjects.Text;
  switchingLevel!: SwitchingLevel;
  collectibleCollider!: Phaser.Physics.Arcade.Collider;
  gameEnding!: boolean;
  gameStartedAt!: number;
  score!: number;

  collectablesCount: number = 0;


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
    this.score = 0;
    this.collectablesCount = 0;
    this.gameEnding = false;
    this.tenSecondTimer = 10;

    this.switchingLevel = new SwitchingLevel(this);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.world.setBoundsCollision(true, true, false, true);

    this.player = new Player(this, 100, 350)
    this.physics.world.enable(this.player)
    this.add.existing(this.player)

    this.collectible = new Collectible(this, this.TILE_SIZE * 18.5, this.TILE_SIZE * 4.5, "collectible");
    this.physics.world.enable(this.collectible, Phaser.Physics.Arcade.STATIC_BODY);
    this.add.existing(this.collectible);
    
    this.collectibleCollider = this.physics.add.collider(this.player, this.collectible, (_player, item) => {
      item.destroy();

      this.collectablesCount++
    });

    this.timerUI = this.add.text(1200, 25, this.tenSecondTimer.toString());


    this.dashingUI = this.add.text(100, 25, '-');
    this.jumpingUI = this.add.text(100, 45, '-');
    this.speedUI = this.add.text(100, 65, '-');
    this.collectablesUI = this.add.text(100, 85, '-');

    this.switchingLevel.createActiveLayerCollider();

    this.player.create();

    this.physics.world.on('worldbounds', this.worldBoundsCollisionHandler);

    // TODO: this is for testing the game ending functionality - possibly remove from the final version?
    var quitKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    quitKey.on("down", () => {
      this.endGame();
    });

    this.gameStartedAt = this.game.getTime();
  }

  update (time: number, delta: number) {
    if (!this.gameEnding) {
      this.checkKeyPresses(time, delta)
      this.score = time;
    }

    this.player.update(time, delta)
    this.tenSecondTimer -= delta / 1000;
    if (this.tenSecondTimer < 0) {
      this.tenSecondTimer = 10;
      this.switchingLevel.changeLayer()

      this.physics.add.collider(this.player, this.switchingLevel.activeLayer, () => {
        console.log('collision')

      })
    }
    this.timerUI.text = this.tenSecondTimer.toFixed(2)

    this.switchingLevel.update(time, delta)
    this.dashingUI.text = (this.player.dashingHasCoolDowned ? 'dash ready' : '-') + '; ' + (this.player.canDoubleDash ? '2nd dash ready' : '-') + '; ' + (this.player.isDashing || this.player.isDoubleDashing ? 'dashing' : '-') + ';'
    this.jumpingUI.text = (this.player.hasJumped ? 'jumping' : '-') + '; ' + (this.player.hasDoubleJumped ? 'double jumped' : '-') + ';'
    this.speedUI.text = this.player.body.velocity.x + ';' + this.player.body.velocity.y;
    this.collectablesUI.text = `collectables: ${this.collectablesCount}`
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
      this.player.isMoving = true
      this.player.dash(time, delta)
    } else {
      this.player.dashButtonReleased()
    }
    
    if (this.cursors.left.isDown) { // left
      this.player.isMoving = true
      this.player.moveLeft(time, delta)
    } else if (this.cursors.right.isDown) { // right
      this.player.isMoving = true
      this.player.moveRight(time, delta)
    }
  }

  getPlayer() {
    return this.player;
  }

  worldBoundsCollisionHandler = (obj: Phaser.Physics.Arcade.Body, _: boolean, hitGround: boolean) => {
    if (!this.gameEnding && obj.gameObject === this.player && hitGround) {
      this.gameEnding = true;
      // have small delay so the player character falls properly off screen
      setTimeout(this.endGame, 500);
      // ...and remove the boundary check from the bottom so that the player actually falls out
      this.physics.world.setBoundsCollision(false, false, false, false);
    }
  }

  endGame = () => {
    console.log("End game called.");
    // fade to black
    this.scene.start("GameOverScene", { score: this.score - this.gameStartedAt});
  }
}

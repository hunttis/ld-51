import { Player, PLAYER_SKILLS } from "../gameobjects/player";
import { Collectible } from "../gameobjects/collectible";
import { SwitchingLevel } from "../gameobjects/switchinglevel";
import { ParticleEffects } from "../gameobjects/particles";

interface LevelSelection {
  level: number;
}

export class GameScene extends Phaser.Scene {
  TILE_SIZE = 64;

  currentLevel: number = 1;

  player!: Player;
  collectible!: Collectible;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  tenSecondTimer: number = 10;
  timerUI!: Phaser.GameObjects.Text;
  dashingUI!: Phaser.GameObjects.Text;
  jumpingUI!: Phaser.GameObjects.Text;
  speedUI!: Phaser.GameObjects.Text;
  collectiblesUI!: Phaser.GameObjects.Text;
  unlockablesUI!: Phaser.GameObjects.BitmapText;
  switchingLevel!: SwitchingLevel;
  collectibleCollider!: Phaser.Physics.Arcade.Collider;
  particleEffects!: ParticleEffects;
  gameEnding!: boolean;
  score!: number;
  background!: Phaser.GameObjects.Image;

  collectiblesCount: number = 0;


  constructor() {
    super({ key: "GameScene" });
  }

  init(data: LevelSelection) {
    console.log("RECEIVED FROM MAIN MENU: ", data)
    if (data.level) {
      // FIXME: The "% 2" is here until we have a third level
      // this.currentLevel = ((data.level - 1) % 2) + 1;
      this.currentLevel = data.level
      console.log("Current level:", this.currentLevel);
    }
  }

  preload() {
    this.load.tilemapTiledJSON("level-1", `assets/maps/level-1.json`);
    this.load.tilemapTiledJSON("level-2", `assets/maps/level-2.json`);
    this.load.tilemapTiledJSON("level-3", `assets/maps/level-3.json`);
    
    this.load.image("level-tiles", "assets/maps/tilesheet.png");
    this.load.spritesheet({ key: 'idle', url: "assets/images/idle.png", frameConfig: { frameWidth: 64, frameHeight: 64,} })
    this.load.spritesheet({ key: 'jump', url: "assets/images/jump.png", frameConfig: { frameWidth: 64, frameHeight: 64,} })
    this.load.spritesheet({ key: 'walk', url: "assets/images/walk.png", frameConfig: { frameWidth: 64, frameHeight: 64,} })
    this.load.image("gem1", "assets/images/gem1.png");
    this.load.image("gem2", "assets/images/gem2.png");
    this.load.image("gem3", "assets/images/gem3.png");
    this.load.image("background", "assets/images/bg.png")
    this.load.image("smoke", "assets/images/puff.png")

    this.load.audio('jump', 'assets/audio/jump.wav')
    this.load.audio('dash', 'assets/audio/dash.wav')
    this.load.audio('gameover', 'assets/audio/gameover.wav')
    this.load.audio('hit-the-ground', 'assets/audio/hit-the-ground.wav')
    this.load.audio('collectible', 'assets/audio/collectible.wav')
    this.load.audio('layer-transition', 'assets/audio/transition.wav')
  }

  create() {
    this.score = 0;
    this.collectiblesCount = 0;
    this.gameEnding = false;
    this.tenSecondTimer = 10;

    this.cursors = this.input.keyboard.createCursorKeys();

    this.background = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "background")

    this.physics.world.setBoundsCollision(true, true, false, true);

    this.particleEffects = new ParticleEffects(this)
    this.particleEffects.create()

    this.player = new Player(this, 100, 350)
    this.physics.world.enable(this.player)
    this.add.existing(this.player)

    this.anims.create({key: 'walk', frames: 'walk', repeat: -1})
    this.anims.create({key: 'idle', frames: 'idle', repeat: -1, frameRate: 15})
    this.anims.create({key: 'jump', frames: 'jump', repeat: 0})

    this.player.play('idle')

    this.timerUI = this.add.text(1200, 25, this.tenSecondTimer.toString());

    this.dashingUI = this.add.text(100, 25, '-');
    this.jumpingUI = this.add.text(100, 45, '-');
    this.speedUI = this.add.text(100, 65, '-');
    this.collectiblesUI = this.add.text(100, 85, '-');

    this.player.create();

    this.switchingLevel = new SwitchingLevel(this, this.currentLevel);

    this.physics.world.on('worldbounds', this.worldBoundsCollisionHandler);

    // TODO: this is for testing the game ending functionality - possibly remove from the final version?
    var quitKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    var escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    var muteKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    var xKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X); // temp

    quitKey.on("down", () => {
      this.gameEnding = true;
      this.endGame();
    });

    escKey.on('down', () => {
      this.scene.start("MenuScene")
    })

    muteKey.on('down', () => {
      this.sound.mute = !this.sound.mute
    })

    xKey.on('down', () => {
      this.finishGame()
    })

    var changeLevelKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    changeLevelKey.on("down", () => {
      this.switchingLevel.changeLayer()
    })
  }

  update (time: number, delta: number) {
    if (!this.gameEnding) {
      this.checkKeyPresses(time, delta)
      this.score += delta;
    }

    this.player.update(time)
    this.tenSecondTimer -= delta / 1000;
    if (this.tenSecondTimer < 0) {
      this.tenSecondTimer = 10;
      this.switchingLevel.changeLayer()      
    }
    this.timerUI.text = this.tenSecondTimer.toFixed(2)

    this.switchingLevel.update()
    this.dashingUI.text = 
      (this.player.dashUnlocked ? (this.player.dashingHasCoolDowned ? 'dash ready' : '-') : 'dash not unlocked') + '; ' +
      (this.player.doubleDashUnlocked ? (this.player.canDoubleDash ? 'double dash ready' : '-') : 'double dash not unlocked') + '; ' + 
      (this.player.isDashing || this.player.isDoubleDashing ? 'dashing' : '-') + ';'
    this.jumpingUI.text =
      (this.player.hasJumped ? 'jumping' : '-') + '; ' +
      (this.player.doubleJumpUnlocked ? (this.player.hasDoubleJumped ? 'double jumped' : '-') : 'double jump not unlocked') + ';'
    this.speedUI.text = this.player.body.velocity.x + ';' + this.player.body.velocity.y;
    this.collectiblesUI.text = `collectibles: ${this.collectiblesCount}`

    if (this.currentLevel >= 2) {
      this.player.unlockSkill(PLAYER_SKILLS.DOUBLE_JUMP)
    }
    
    if (this.currentLevel >= 3) {
      this.player.unlockSkill(PLAYER_SKILLS.DASH)
    }
  }

  checkKeyPresses(time: number, delta: number) {
    if (this.cursors.up.isDown || this.cursors.space.isDown) { // up || space
      this.player.jump(time)
    } else {
      this.player.jumpButtonReleased()
    }
    
    if (this.cursors.shift.isDown) { // shift
      this.player.isMoving = true
      this.player.dash(time)
    } else {
      this.player.dashButtonReleased()
    }
    
    if (this.cursors.left.isDown) { // left
      this.player.isMoving = true
      this.player.moveLeft()
      this.player.play('walk', true)
      this.player.setFlipX(true)
    } else if (this.cursors.right.isDown) { // right
      this.player.isMoving = true
      this.player.moveRight()
      this.player.play('walk', true)
      this.player.setFlipX(false)
    } else if (!this.player.hasJumped && !this.player.hasDoubleJumped) {
      this.player.play('idle', true)
    }

    if (this.cursors.down.isDown) {
      this.tenSecondTimer -= (delta * 2) / 1000;
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

  finishGame = () => {
    this.player.gameOverSound.play()
    console.log("Finished game called.");
    // fade to white
    this.cameras.main.fadeOut(1000, 255, 255, 255, (_: unknown, progress: number) => {
      if (progress == 1) {
        setTimeout(() => this.scene.start("GameFinishedScene", { score: this.score }), 500);
      }
    });
  }

  endGame = () => {
    this.player.gameOverSound.play()
    console.log("End game called.");
    // fade to black
    this.cameras.main.fadeOut(1000, 0, 0, 0, (_: unknown, progress: number) => {
      if (progress == 1) {
        setTimeout(() => this.scene.start("GameOverScene", { score: this.score }), 500);
      }
    });
  }
}

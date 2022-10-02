import { GameScene } from "src/scenes/gameScene"

export const enum PLAYER_SKILLS {
    DOUBLE_JUMP = 'double-jump',
    DASH = 'dash',
    DOUBLE_DASH = 'double-dash'
}

export class Player extends Phaser.Physics.Arcade.Sprite {
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    parentScene!: GameScene
    
    initialVelocity: number = 200
    playerHeadingRight: boolean = true
    isMoving: boolean = false

    jumpButtonHeld: boolean = false
    jumpVelocity: number = 400
    hasJumped: boolean = false
    canDoubleJump: boolean = false
    hasDoubleJumped: Boolean = false
    doubleJumpStartedAt: number = 0
    delayBeforeDoubleJump: number = 250

    dashVelocity: number = 500
    dashDelay: number = 300
    dashStartedAt: number = 0
    dashCoolDown: number = 1500
    isDashing: boolean = false
    dashingHasCoolDowned: boolean = true
    hasTouchedGroundAfterDash: boolean = false
    dashButtonHeld: boolean = false
    hasDashed: boolean = false

    doubleDashStartedAt: number = 0
    canDoubleDash: boolean = true
    isDoubleDashing: boolean = false
    doubleDashHasCoolDowned: boolean = true

    hasBlockedDown: boolean = false

    jumpSound!: Phaser.Sound.BaseSound
    dashSound!: Phaser.Sound.BaseSound
    hitTheGroundSound!: Phaser.Sound.BaseSound
    collectibleSound!: Phaser.Sound.BaseSound
    gameOverSound!: Phaser.Sound.BaseSound
    layerTransitionSound!: Phaser.Sound.BaseSound

    doubleJumpUnlocked: boolean = false
    dashUnlocked: boolean = false
    doubleDashUnlocked: boolean = false

    constructor(scene: GameScene, startX: number, startY: number) {
        super(scene, startX, startY, "idle")
        this.parentScene = scene
        this.name = "player"
    }

    create() {
        console.log("Creating player");
        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true, undefined, -1.5);
        (this.body as Phaser.Physics.Arcade.Body).onWorldBounds = true;

        this.jumpSound = this.parentScene.game.sound.add('jump', { volume: 0.5 })
        this.dashSound = this.parentScene.game.sound.add('dash', { volume: 0.5 })
        this.gameOverSound = this.parentScene.game.sound.add('gameover', { volume: 0.5 })
        this.hitTheGroundSound = this.parentScene.game.sound.add('hit-the-ground', { volume: 0.5 })
        this.collectibleSound = this.parentScene.game.sound.add('collectible', { volume: 0.5 })
        this.layerTransitionSound = this.parentScene.game.sound.add('layer-transition', { volume: 0.5 })
        this.setDepth(100)
        this.body.setSize(50, 62)
    }

    update(time: number, delta: number) {
        if (time - this.doubleJumpStartedAt > this.delayBeforeDoubleJump) {
            this.canDoubleJump = true;
        }

        if (time - this.dashStartedAt > this.dashCoolDown && this.hasTouchedGroundAfterDash) {
            this.dashingHasCoolDowned = true
        }

        if (time - this.doubleDashStartedAt > this.dashCoolDown && this.hasTouchedGroundAfterDash) {
            this.doubleDashHasCoolDowned = true
            this.canDoubleDash = true
        }

        if (this.isDashing && time - this.dashStartedAt > this.dashDelay) {
            this.isDashing = false
            this.hasDashed = true
        }

        if (this.isDoubleDashing && time - this.doubleDashStartedAt > this.dashDelay) {
            this.isDoubleDashing = false
        }

        if (this.body.blocked.down && !this.hasBlockedDown) {
            this.hitTheGroundSound.play()
            this.parentScene.particleEffects.onHitTheGround()
        }

        if (this.body.blocked.down) {
            this.hasJumped = false
            this.hasDoubleJumped = false
            
            if (!this.isDashing) {
                this.hasTouchedGroundAfterDash = true
            }
        }

        if (this.isDashing) {
            this.parentScene.particleEffects.onDash()
        }

        if (this.isDoubleDashing) {
            this.parentScene.particleEffects.onDash()
        }

        if (this.body.velocity.x != 0 && this.isMoving && !this.isDashing && !this.isDoubleDashing) {
            this.setVelocityX(this.body.velocity.x * 4 / 5)
        }
        
        if (this.hasJumped || this.hasDoubleJumped) {
            this.play("jump")
        }

        this.hasBlockedDown = this.body.blocked.down
    }

    moveLeft (time: number, delta: number) {
        this.playerHeadingRight = false

        if (!this.isDashing && !this.isDoubleDashing) {
            this.setVelocityX(-this.initialVelocity);
        }
    }

    moveRight (time: number, delta: number) {
        this.playerHeadingRight = true
        
        if (!this.isDashing && !this.isDoubleDashing) {
            this.setVelocityX(this.initialVelocity);
        }
    }
    
    tempStop(time: number, delta: number) {
        this.setVelocityX(0);
        this.setVelocityY(0);
    }

    jump (time: number, delta: number) {
        if (!this.hasJumped) {
            this._jump()
            this.hasJumped = true
            this.doubleJumpStartedAt = time
            this.jumpButtonHeld = true
        }

        if (this.doubleJumpUnlocked && this.hasJumped && !this.hasDoubleJumped && this.canDoubleJump && !this.jumpButtonHeld) {
            this._jump()

            this.hasDoubleJumped = true
            this.canDoubleJump = false
        }
    }

    _jump (time?: number, delta?: number) {
        this.jumpSound.play()
        this.parentScene.particleEffects.onJump()
        this.setVelocityY(-this.jumpVelocity);
    }
    
    dash (time: number, delta: number) {
        if (this.dashUnlocked && !this.isDashing && this.dashingHasCoolDowned) {
            this._dash(time, delta)

            this.isDashing = true
            this.dashStartedAt = time
            this.dashingHasCoolDowned = false
            this.hasTouchedGroundAfterDash = false
            this.dashButtonHeld = true
        }

        if (this.doubleDashUnlocked && (this.isDashing || this.hasDashed) && !this.isDoubleDashing && this.doubleDashHasCoolDowned && !this.dashButtonHeld) {
            this._dash(time, delta)

            this.isDoubleDashing = true
            this.doubleDashStartedAt = time
            this.canDoubleDash = false
            this.doubleDashHasCoolDowned = false
        }
    }

    _dash (time: number, delta: number) {
        this.dashSound.play()
        if (this.playerHeadingRight) {
            this.setVelocityX(this.body.velocity.x + this.dashVelocity)
        } else {
            this.setVelocityX(this.body.velocity.x - this.dashVelocity)
        }
    }
    
    jumpButtonReleased() {
        this.jumpButtonHeld = false
    }

    dashButtonReleased () {
        this.dashButtonHeld = false
    }

    unlockSkill (skillName: string = '') {
        if (skillName === PLAYER_SKILLS.DOUBLE_JUMP) {
            this.doubleJumpUnlocked = true
        } else if (skillName === PLAYER_SKILLS.DASH) {
            this.dashUnlocked = true
        } else if (skillName === PLAYER_SKILLS.DOUBLE_DASH) {
            this.doubleDashUnlocked = true
        }
    }

}
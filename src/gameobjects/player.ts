export class Player extends Phaser.Physics.Arcade.Sprite {
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    parentScene!: Phaser.Scene
    
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
    dashDelay: number = 400
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

    constructor(scene: Phaser.Scene, startX: number, startY: number) {
        super(scene, startX, startY, "player")
        this.parentScene = scene
    }

    create() {
        console.log("Creating player");
        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true, undefined, -1.5);
        (this.body as Phaser.Physics.Arcade.Body).onWorldBounds = true;
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

        if (this.body.blocked.down) {
            this.hasJumped = false
            this.hasDoubleJumped = false
            this.hasTouchedGroundAfterDash = true
        }

        if (this.body.velocity.x != 0 && this.isMoving && !this.isDashing && !this.isDoubleDashing) {
            this.setVelocityX(this.body.velocity.x * 4 / 5)
        }
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

        if (this.hasJumped && !this.hasDoubleJumped && this.canDoubleJump && !this.jumpButtonHeld) {
            this._jump()

            this.hasDoubleJumped = true
            this.canDoubleJump = false
        }
    }

    _jump (time?: number, delta?: number) {
        this.setVelocityY(-this.jumpVelocity);
    }
    
    dash (time: number, delta: number) {
        if (!this.isDashing && this.dashingHasCoolDowned) {
            this._dash(time, delta)

            this.isDashing = true
            this.dashStartedAt = time
            this.dashingHasCoolDowned = false
            this.hasTouchedGroundAfterDash = false
            this.dashButtonHeld = true
        }

        if ((this.isDashing || this.hasDashed) && !this.isDoubleDashing && this.doubleDashHasCoolDowned && !this.dashButtonHeld) {
            this._dash(time, delta)

            this.isDoubleDashing = true
            this.doubleDashStartedAt = time
            this.canDoubleDash = false
            this.doubleDashHasCoolDowned = false
        }
    }

    _dash (time: number, delta: number) {
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

}
export class Player extends Phaser.Physics.Arcade.Sprite {
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    parentScene!: Phaser.Scene
    
    initialVelocity: number = 200
    playerHeadingRight: boolean = true

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
    hasDashed: boolean = false
    dashingHasCoolDowned: boolean = true
    hasTouchedGroundAfterDash: boolean = false
    dashButtonHeld: boolean = false

    canDoubleDash: boolean = true
    hasDoubleDashed: boolean = false
    doubleDashHasCoolDowned: boolean = true
    // delayBeforeDoubleDash: number = 150

    constructor(scene: Phaser.Scene, startX: number, startY: number) {
        super(scene, startX, startY, "player")
        this.parentScene = scene
    }

    create() {
        console.log("Creating player", this.body.collideWorldBounds);
        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
        (this.body as Phaser.Physics.Arcade.Body).onWorldBounds = true;
    }

    update(time: number, delta: number) {
        if (time - this.doubleJumpStartedAt > this.delayBeforeDoubleJump) {
            this.canDoubleJump = true;
        }

        if (time - this.dashStartedAt > this.dashCoolDown && this.hasTouchedGroundAfterDash) {
            this.dashingHasCoolDowned = true
        }

        // if (time - this.dashStartedAt > this.dashCoolDown * 2 && this.hasTouchedGroundAfterDash) {
        //     this.doubleDashHasCoolDowned = true
        //     this.canDoubleDash = true
        // }

        // if (time - this.dashStartedAt > this.delayBeforeDoubleDash && this.hasDashed) {
        //     this.canDoubleDash = true;
        // }

        if (this.hasDashed && time - this.dashStartedAt > this.dashDelay) {
            // if (this.hasDoubleDashed && (time - this.dashStartedAt + this.dashDelay) > this.dashDelay * 2) {
            //     this.hasDoubleDashed = false
            // } else if (!this.hasDoubleDashed) {
            //     this.hasDashed = false
            // }
            this.hasDashed = false
        }

        if (this.body.blocked.down) {
            this.hasJumped = false
            this.hasDoubleJumped = false
            this.hasTouchedGroundAfterDash = true
            // this.canDoubleDash = false
        }

        if (this.body.velocity.x != 0 && !this.hasDashed){
            this.setVelocityX(this.body.velocity.x * 4 / 5)
        }
    }

    moveLeft (time: number, delta: number) {
        this.playerHeadingRight = false

        if (!this.hasDashed) {
            this.setVelocityX(-this.initialVelocity);
        }
    }

    moveRight (time: number, delta: number) {
        this.playerHeadingRight = true
        
        if (!this.hasDashed) {
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
        if (!this.hasDashed && this.dashingHasCoolDowned) {
            this._dash()

            this.hasDashed = true
            this.dashStartedAt = time
            this.dashingHasCoolDowned = false
            this.hasTouchedGroundAfterDash = false
            this.dashButtonHeld = true
        }
    
        // // this.canDoubleDash
        // console.log(this.hasDashed, !this.hasDoubleDashed, this.doubleDashHasCoolDowned && !this.dashButtonHeld)
        // if (this.hasDashed && !this.hasDoubleDashed && this.doubleDashHasCoolDowned && !this.dashButtonHeld) {
        //     console.log('double dashed')
        //     this._dash()

        //     this.hasDoubleDashed = true
        //     this.canDoubleDash = false
        //     this.doubleDashHasCoolDowned = false
        // }
    }

    _dash () {
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
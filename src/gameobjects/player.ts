export class Player extends Phaser.Physics.Arcade.Sprite {
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    parentScene!: Phaser.Scene;
    initialVelocity: number = 100;

    constructor(scene: Phaser.Scene, startX: number, startY: number) {
        super(scene, startX, startY, "player")
        this.parentScene = scene
    }

    create() {
    }

    update(delta: number) {
        
    }

    moveLeft (delta: number) {
        this.setVelocityX(-this.initialVelocity);
    }

    moveRight (delta: number) {
        this.setVelocityX(this.initialVelocity);
    }

    jump (delta: number) {
        
    }
    
    dash (delta: number) {
        
    }

}
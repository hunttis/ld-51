export class Collectible extends Phaser.Physics.Arcade.Sprite {
    
    constructor(scene: Phaser.Scene, startX: number, startY: number, name: string) {
        super(scene, startX, startY, name);
        this.name = name
    }

    create() {
    }

    update(time: number, delta: number) {
    }
}
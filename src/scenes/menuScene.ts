export class MenuScene extends Phaser.Scene {

    gameNameText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "MenuScene", active: false, visible: false });
    }

    preload() {

    }

    create() {
        const cameraCenterX = this.cameras.main.width / 2
        const cameraCenterY = this.cameras.main.height / 2
        this.gameNameText = this.createTextItem(cameraCenterX, cameraCenterY - 200, "Ludum Dare 51", "100px")
        this.createTextItem(cameraCenterX, cameraCenterY + 100, "Cursor keys to move, up/space to jump, shift to dash", "25px")
        this.createTextItem(cameraCenterX, cameraCenterY + 200, "Press space key to start", "25px")
        this.input.keyboard.on('keydown-SPACE', (event: any) => {
            this.scene.start("GameScene")
        });
    }

    update(time: number, delta: number) {
        
    }

    createTextItem(locX: number, locY: number, text: string, size: string) {
        const textItemStyle = {fontSize: size} as Phaser.GameObjects.TextStyle
        var textItem = this.add.text(locX, locY, text, textItemStyle)
        textItem.setOrigin(0.5)
        return textItem
    }

}
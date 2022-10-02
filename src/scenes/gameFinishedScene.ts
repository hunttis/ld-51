interface GameData {
    score: number;
}

export class GameFinishedScene extends Phaser.Scene {

    gameNameText!: Phaser.GameObjects.Text;
    score: number

    constructor() {
        super({ key: "GameFinishedScene", active: false, visible: false });
        this.score = 0
    }

    init (data: GameData) {
        this.score = data.score / 1000
    }

    preload() {
        this.load.image("background", "assets/images/bg.png")
    }

    create() {
        const background = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "background")
        background.tint = 0x99ff99

        const cameraCenterX = this.cameras.main.width / 2
        const cameraCenterY = this.cameras.main.height / 2
        this.gameNameText = this.createTextItem(cameraCenterX, cameraCenterY - 200, "You made it!", "100px")
        this.createTextItem(cameraCenterX, cameraCenterY + 100, "Have you tried completing all of the levels already?", "25px")
        this.createTextItem(cameraCenterX, cameraCenterY + 200, "Press space key to go to the main menu", "25px")
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start("MenuScene")
        });
    }

    createTextItem(locX: number, locY: number, text: string, size: string) {
        const textItemStyle = {fontSize: size} as Phaser.GameObjects.TextStyle
        var textItem = this.add.text(locX, locY, text, textItemStyle)
        textItem.setOrigin(0.5)
        return textItem
    }
}
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
        this.load.image("gem1", "assets/images/gem1.png")
        this.load.image("gem2", "assets/images/gem2.png")
        this.load.image("gem3", "assets/images/gem3.png")
    }

    create() {
        console.log('Create!')

        const background = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "background")
        background.tint = 0x99ff99

        this.createGemEmitter('gem1')
        this.createGemEmitter('gem2')
        this.createGemEmitter('gem3')



        const cameraCenterX = this.cameras.main.width / 2
        const cameraCenterY = this.cameras.main.height / 2
        this.gameNameText = this.createTextItem(cameraCenterX, cameraCenterY - 150, "Nice work!", "100px")
        this.gameNameText.setColor('0xffffff')
        this.gameNameText.setStroke('#fff', 8);
        this.gameNameText.setFontFamily("Tahoma")

        const text1 = this.createTextItem(cameraCenterX, cameraCenterY + 100, "Have you tried completing all of the levels already?", "30px")
        text1.setColor('0xffffff')
        text1.setStroke('#fff', 8);
        text1.setFontFamily("Tahoma")

        const text2 = this.createTextItem(cameraCenterX, cameraCenterY + 200, "Press space key to go to the main menu", "30px")
        text2.setColor('0xffffff')
        text2.setStroke('#fff', 8);
        text2.setFontFamily("Tahoma")

        const text3 = this.createTextItem(cameraCenterX, cameraCenterY + 250, "Also, thanks for playing!", "30px")
        text3.setColor('0xffffff')
        text3.setStroke('#fff', 8);
        text3.setFontFamily("Tahoma")


        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start("MenuScene")
        });
    }

    createGemEmitter(texture: string) {
        const gemParticles = this.add.particles(texture)
        gemParticles.createEmitter({
            emitZone: {
                source: new Phaser.Geom.Rectangle(0, -50, 1280, 1),
                type: 'random',
                quantity: 1
            },
            frequency: 500,
            lifespan: 5000,
            speedY: { min: -10, max: -30 },
            on: true,
            gravityY: 100,
            scale: { min: 0.5, max: 1},
            alpha: { start: 1, end: 0},
            rotate: {
                min: 0, max: 360
            }
        })
        
    }

    createTextItem(locX: number, locY: number, text: string, size: string) {
        const textItemStyle = {fontSize: size} as Phaser.GameObjects.TextStyle
        var textItem = this.add.text(locX, locY, text, textItemStyle)
        textItem.setOrigin(0.5)
        return textItem
    }
}
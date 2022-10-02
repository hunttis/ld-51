export class MenuScene extends Phaser.Scene {

    gameNameText!: Phaser.GameObjects.Text;
    level1Text!: Phaser.GameObjects.Text;
    level2Text!: Phaser.GameObjects.Text;
    level3Text!: Phaser.GameObjects.Text;
    currentSelection: number = 1;


    constructor() {
        super({ key: "MenuScene", active: false, visible: false });
    }

    preload() {
        this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        this.load.image("background", "assets/images/bg.png")
    }

    create() {
        const background = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "background")
        background.tint = 0xbbffff

        const cameraCenterX = this.cameras.main.width / 2
        const cameraCenterY = this.cameras.main.height / 2
        this.gameNameText = this.createTextItem(cameraCenterX, cameraCenterY - 300, 
            "Oracle of Colliding Realms", "80px")
        this.gameNameText.setFontFamily("Tahoma")
        this.gameNameText.setColor('0x000000')

        const instructions = this.createTextItem(cameraCenterX, cameraCenterY - 200,
            "Cursor keys to move, up/space to jump, shift to dash", "25px")
        instructions.setFontFamily("Tahoma")
        instructions.setColor('0x000000')
        
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on('down',() => {
            this.scene.start("GameScene", {level: this.currentSelection})
        });
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down',() => {
            this.scene.start("GameScene", {level: this.currentSelection})
        });

        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP).on('down', () => {
            this.selectUp()
        });

        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN).on('down', () => {
            this.selectDown()
        });


        this.level1Text = this.createTextItem(cameraCenterX, cameraCenterY + 50, "Level 1", "50px")
        this.level1Text.setColor('0x000000')
        this.level1Text.setFontFamily("Tahoma")
        
        this.level2Text = this.createTextItem(cameraCenterX, cameraCenterY + 170, "Level 2", "50px")
        this.level2Text.setColor('0x000000')
        this.level2Text.setFontFamily("Tahoma")
        
        this.level3Text = this.createTextItem(cameraCenterX, cameraCenterY + 300, "Level 3", "50px")
        this.level3Text.setColor('0x000000')
        this.level3Text.setFontFamily("Tahoma")
        this.updateLevelTexts()
               
    }

    update(time: number, delta: number) {
        
    }

    selectUp() {
        this.currentSelection--
        this.currentSelection = Phaser.Math.Clamp(this.currentSelection, 1, 3)
        this.updateLevelTexts();
    }

    selectDown() {
        this.currentSelection++
        this.currentSelection = Phaser.Math.Clamp(this.currentSelection, 1, 3)
        this.updateLevelTexts();
    }

    updateLevelTexts() {
        this.level1Text.setStroke('#fff', 0);
        this.level2Text.setStroke('#fff', 0);
        this.level3Text.setStroke('#fff', 0);
        this.level1Text.setColor('0x000000')
        this.level2Text.setColor('0x000000')
        this.level3Text.setColor('0x000000')

        if (this.currentSelection === 1) {
            this.level1Text.setStroke('#fff', 16);
            this.level1Text.setColor('0xffffff')    
        } else if (this.currentSelection === 2) {
            this.level2Text.setStroke('#fff', 16);
            this.level2Text.setColor('0xffffff')    
        } else {
            this.level3Text.setStroke('#fff', 16);
            this.level3Text.setColor('0xffffff')    
        }

    }


    createTextItem(locX: number, locY: number, text: string, size: string) {
        const textItemStyle = {fontSize: size} as Phaser.GameObjects.TextStyle
        var textItem = this.add.text(locX, locY, text, textItemStyle)
        textItem.setOrigin(0.5)
        return textItem
    }

}
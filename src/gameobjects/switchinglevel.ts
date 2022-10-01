import { GameScene } from "src/scenes/gameScene";

export class SwitchingLevel {

    parentScene: GameScene;
    activeLayerIndex: number = 0;
    activeLayer!: Phaser.Tilemaps.TilemapLayer;
    nextLevelLayer!: Phaser.Tilemaps.TilemapLayer;
    levelLayers: Phaser.Tilemaps.TilemapLayer[] = [];
    activeLayerCollider!: Phaser.Physics.Arcade.Collider;
  
    constructor(scene: GameScene) {
        this.parentScene = scene
        const map = this.parentScene.make.tilemap({ key: "level" });
        map.addTilesetImage("tiles", "level-tiles");
        map.layers.map((layer: Phaser.Tilemaps.LayerData) => {
            console.log(layer.name)
            const oneLayer = map.createLayer(layer.name, "tiles", 0, 0)
            oneLayer.setCollisionBetween(1, 9)
            this.levelLayers.push(oneLayer)
            if (!this.activeLayer) {
              this.activeLayer = oneLayer
            } else if (this.activeLayer && !this.nextLevelLayer) {
              this.nextLevelLayer = oneLayer
              oneLayer.setOrigin(0.5)
              oneLayer.visible = true
              oneLayer.alpha = 0.1
              oneLayer.scale = 0.5
              oneLayer.setDepth(-1)
              oneLayer.setPosition(this.parentScene.cameras.main.width/2 - (this.nextLevelLayer.width / 2 * this.nextLevelLayer.scale), this.parentScene.cameras.main.height/2 - (this.nextLevelLayer.height/ 2 * this.nextLevelLayer.scale))
          
            } else if (this.activeLayer && this.nextLevelLayer) {
              oneLayer.visible = false
            }
          })
    }

    update(time: number, delta: number) {
        this.nextLevelLayer.scale = (10 - this.parentScene.tenSecondTimer) / 10;
        this.nextLevelLayer.alpha = (10 - this.parentScene.tenSecondTimer) / 10;

        var yOffset = 0
        this.nextLevelLayer.setPosition(
            this.parentScene.cameras.main.width/2 - (this.nextLevelLayer.width / 2 * this.nextLevelLayer.scale),
            this.parentScene.cameras.main.height/2 - (this.nextLevelLayer.height/ 2 * this.nextLevelLayer.scale)
            + yOffset
        )
    }

    createActiveLayerCollider() {
        this.activeLayerCollider = this.parentScene.physics.add.collider(this.parentScene.player, this.activeLayer)
    }

    changeLayer() {
        console.log("CHANGING LAYER FROM " + this.activeLayerIndex + " to " + (this.activeLayerIndex+1))
        this.activeLayer.setVisible(false)
        this.activeLayer.setActive(false)
        
        this.nextLevelLayer.scale = 1
        
        this.activeLayerIndex++;
        this.activeLayerIndex = Phaser.Math.Wrap(this.activeLayerIndex, 0, this.levelLayers.length -1)
        
        const nextActive = this.levelLayers[this.activeLayerIndex]
        this.activeLayer = nextActive
        this.activeLayer.setDepth(1)
        this.parentScene.physics.world.removeCollider(this.activeLayerCollider)
        this.activeLayerCollider = this.parentScene.physics.add.collider(this.parentScene.getPlayer(), this.activeLayer)
        this.nextLevelLayer = this.levelLayers[Phaser.Math.Wrap(this.activeLayerIndex+1, 0, this.levelLayers.length -1)]
        this.nextLevelLayer.setVisible(true)
        this.nextLevelLayer.setDepth(-1)
      }

}
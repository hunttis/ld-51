import { GameScene } from "src/scenes/gameScene";
import { Collectible } from "./collectible";

export class SwitchingLevel {
    parentScene: GameScene;
    activeLayerIndex: number = 0;
    levelLayers: Phaser.Tilemaps.TilemapLayer[] = [];
    layerColliders: Phaser.Physics.Arcade.Collider[] = [];
    layerCollectibles: Phaser.GameObjects.Group[] = [];
    collectibleColliders: Phaser.Physics.Arcade.Collider[] = [];
    totalCollectibles: number;
  
    constructor(scene: GameScene, currentLevel: number) {
        console.log('Creating level ', currentLevel)
        this.totalCollectibles = 0;
        this.parentScene = scene
        const objectOffsetX = this.parentScene.TILE_SIZE / 2;
        const objectOffsetY = this.parentScene.TILE_SIZE / -2;

        const map = this.parentScene.make.tilemap({ key: `level-${currentLevel}` });
        map.addTilesetImage("tiles", "level-tiles");
        map.layers.forEach((layer: Phaser.Tilemaps.LayerData) => {
          const oneLayer = map.createLayer(layer.name, "tiles", 0, 0)
          oneLayer.setCollisionBetween(1, 12)
          this.levelLayers.push(oneLayer)
          var layerCollider = this.parentScene.physics.add.collider(this.parentScene.player, oneLayer)
          this.layerColliders.push(layerCollider)
          if (this.levelLayers.length == 1) {
            console.log("Active layer set to ", layer.name)
            oneLayer.setDepth(10)
          } else if (this.levelLayers.length == 2) {
            console.log("First incoming layer set to ", layer.name)
            oneLayer.setOrigin(0.5)
            oneLayer.setDepth(5)
            layerCollider.active = false
          } else {
            console.log("Other dormant layer set to ", layer.name)
            oneLayer.visible = false
            layerCollider.active = false
          }
        })

        map.objects.forEach((layer: Phaser.Tilemaps.ObjectLayer) => {
          if (layer.name.indexOf("collectibles") == -1) {
            if (layer.name == "startPoint") {
              const startPoint = layer.objects[0];
              console.log('Creating player in: ' , startPoint.x! + objectOffsetX, startPoint.y! + objectOffsetY )
              this.parentScene.player.setPosition(startPoint.x! + objectOffsetX, startPoint.y! + objectOffsetY);
            }

            return
          }
          console.log("Creating object layer ", layer.name)
          const objectGroup: Phaser.GameObjects.Group = this.parentScene.physics.add.staticGroup()
          objectGroup.name = layer.name

          const gemId = ((Number.parseInt(layer.name.replace("collectibles", ""), 10) - 1) % 3) + 1;
          layer.objects.forEach((collectibleData: Phaser.Types.Tilemaps.TiledObject) => {
            const collectible = new Collectible(this.parentScene, (collectibleData.x! | 0) + objectOffsetX, (collectibleData.y! | 0) + objectOffsetY, `gem${gemId}`)
            this.parentScene.add.existing(collectible)
            objectGroup.add(collectible)
            this.totalCollectibles++;
          })
          const collectibleGroupCollider = this.parentScene.physics.add.overlap(this.parentScene.player, objectGroup, (_, collectible) => {
            this.parentScene.player.collectibleSound.play()
            this.parentScene.particleEffects.onCollectibleCollected(collectible.body.x + collectible.body.width / 2, collectible.body.y + collectible.body.height / 2)
            collectible.destroy()
            this.parentScene.collectiblesCount++

            this.totalCollectibles--;
            if (this.totalCollectibles <= 0) {
              this.parentScene.finishGame();
            }
          })
          if (this.layerCollectibles.length > 0) {
            console.log('Setting ', layer.name, 'as disabled')
            objectGroup.active = false
            objectGroup.setVisible(false)
            collectibleGroupCollider.active = false
          }

          this.layerCollectibles.push(objectGroup)
          this.collectibleColliders.push(collectibleGroupCollider)

        })

        if (this.layerCollectibles[0]) {
          console.log('Setting ', this.layerCollectibles[0].name, ' as active')
          this.layerCollectibles[0].active = true
          this.layerCollectibles[0].setVisible(true)
          this.collectibleColliders[0].active = true
        }

    }

    update() {
        var nextLevelLayerIndex = Phaser.Math.Wrap(this.activeLayerIndex+1, 0, this.levelLayers.length)
        var nextLevelLayer = this.levelLayers[nextLevelLayerIndex]

        var timerState = (10 - this.parentScene.tenSecondTimer) / 10

        nextLevelLayer.scale = timerState;
        nextLevelLayer.alpha = timerState;
        var yOffset = 0

        nextLevelLayer.setPosition(
            this.parentScene.cameras.main.width/2 - (nextLevelLayer.width / 2 * nextLevelLayer.scale),
            this.parentScene.cameras.main.height/2 - (nextLevelLayer.height/ 2 * nextLevelLayer.scale)
            + yOffset
        )

        const currentLayer = this.levelLayers[Phaser.Math.Wrap(this.activeLayerIndex, 0, this.levelLayers.length)]
        if (this.parentScene.tenSecondTimer < 1) {
          // play transition sound
          if (!this.parentScene.player.layerTransitionSound.isPlaying) {
            this.parentScene.player.layerTransitionSound.play()
          }
          currentLayer.alpha = this.parentScene.tenSecondTimer
        } else {
          currentLayer.alpha = 1
        }

    }

    setLayerColor(layer: Phaser.Tilemaps.TilemapLayer, color: Phaser.Display.Color) {
      for (var yLoc=0; yLoc< layer.width; yLoc++) {
        for (var xLoc=0; xLoc< layer.width; xLoc++) {
          const tile = layer.getTileAt(xLoc, yLoc, true)
          if (tile != null && tile.index !== -1) {
            tile.tint = color.color
          }
        }
      }
    }

    changeLayer() {
        // Deactivate current active layer
        this.layerColliders[this.activeLayerIndex].active = false
        this.levelLayers[this.activeLayerIndex].setVisible(false)
        this.levelLayers[this.activeLayerIndex].alpha = 1
        this.layerCollectibles[this.activeLayerIndex].active = false
        this.layerCollectibles[this.activeLayerIndex].setVisible(false)
        this.collectibleColliders[this.activeLayerIndex].active = false

        // Activate new layer as current
        this.activeLayerIndex++;
        this.activeLayerIndex = Phaser.Math.Wrap(this.activeLayerIndex, 0, this.levelLayers.length)
        var activeLayer = this.levelLayers[this.activeLayerIndex]
        activeLayer.setDepth(10)
        activeLayer.setScale(1)
        activeLayer.setAlpha(1)
        activeLayer.setPosition(0, 0)
        this.layerColliders[this.activeLayerIndex].active = true;
        this.layerCollectibles[this.activeLayerIndex].active = true
        this.layerCollectibles[this.activeLayerIndex].setVisible(true)
        this.collectibleColliders[this.activeLayerIndex].active = true
        this.setLayerColor(activeLayer,  new Phaser.Display.Color(255, 255, 255))

        // Set next layer coming in
        var nextLevelLayerIndex = Phaser.Math.Wrap(this.activeLayerIndex+1, 0, this.levelLayers.length)
        var nextLevelLayer = this.levelLayers[nextLevelLayerIndex]
        nextLevelLayer.setScale(0)
        nextLevelLayer.setVisible(true)
        nextLevelLayer.setDepth(5)
        
        // Detect if the player is in a square that's coming in
        // if (this.parentScene.player.y < activeLayer.height) {
        //   const collidingTile = activeLayer.getTileAtWorldXY(this.parentScene.player.x, this.parentScene.player.y, true, this.parentScene.cameras.main)
  
        //   if (collidingTile.index !== -1) {
        //     // player death?
        //     // console.log("ARGGHHHH?")
        //   }        
        // }
      }
}
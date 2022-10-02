import { GameScene } from "../scenes/gameScene"

export class ParticleEffects {
    parentScene!: GameScene


    particles!: Phaser.GameObjects.Particles.ParticleEmitterManager
    particlesEmitter!: Phaser.GameObjects.Particles.ParticleEmitter

    groundParticles!: Phaser.GameObjects.Particles.ParticleEmitterManager
    groundParticleEmitter!: Phaser.GameObjects.Particles.ParticleEmitter
    skyParticleEmitter!: Phaser.GameObjects.Particles.ParticleEmitter

    constructor (scene: GameScene) {
        this.parentScene = scene
    }

    create () {

        this.particles = this.parentScene.add.particles('smoke')
        this.particles.setDepth(6)

        this.particlesEmitter = this.particles.createEmitter({
            lifespan: 800,
            speedX: { min: -100, max: 100 },
            speedY: { min: -20, max: 20 },
            scale: { start: 0.5, end:  0.2 },
            on: false,
            gravityY: -200,
        })

        this.groundParticles = this.parentScene.add.particles('flare')
        
        // this.groundParticleEmitter = this.particles.createEmitter({
        //     tint: 0x555500,
        //     emitZone: {
        //         source: new Phaser.Geom.Rectangle(0, 500, 1280, 1),
        //         type: 'random',
        //         quantity: 1
        //     },
        //     alpha: 0.2,
        //     lifespan: 1500,
        //     speedY: { min: 50, max: 50 },
        //     scaleY: { start: 0, end:  1 },
        //     blendMode: 'SUBTRACT',
        //     on: true,
        //     gravityY: 500,            
        // })

        this.skyParticleEmitter = this.groundParticles.createEmitter({
            tint: 0x333355,
            emitZone: {
                source: new Phaser.Geom.Rectangle(0, 300, 1280, 1),
                type: 'random',
                quantity: 1
            },
            alpha: 0.2,
            lifespan: 2000,
            speedY: { min: -10, max: -30 },
            scaleY: { start: 0, end:  1 },
            blendMode: 'ADD',
            on: true,
            gravityY: -100,
        })        
    }

    onJump () {
        this.particlesEmitter.emitParticle(
            7,
            this.parentScene.player.body.x + this.parentScene.player.body.width / 2,
            this.parentScene.player.body.y + this.parentScene.player.body.height
        )
    }

    onHitTheGround () {
        this.onJump()
    }

    onDash () {
        this.particlesEmitter.emitParticle(
            3,
            this.parentScene.player.playerHeadingRight ? this.parentScene.player.body.x : (this.parentScene.player.body.x + this.parentScene.player.body.width),
            this.parentScene.player.body.y + this.parentScene.player.body.height / 2
        )
    }

    toggleRollingGroundEffect() {
        this.groundParticleEmitter.on = false;
        this.skyParticleEmitter.on = false;
    }

    onCollectibleCollected(xLoc: number, yLoc: number) {
        this.particlesEmitter.emitParticle(
            10, xLoc, yLoc
        )
    }
}

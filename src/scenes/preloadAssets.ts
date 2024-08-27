export class PreloadAssets extends Phaser.Scene {

  constructor() {
    super({
      key : 'PreloadAssets'
    })
  }

  preload(): void {
    this.load.image('gem', 'assets/sprites/gem.png');

  }

  create(): void {
    this.scene.start('PlayGame')
  }
}
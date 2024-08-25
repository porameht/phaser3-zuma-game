import Phaser from 'phaser';
import { PreloadAssets } from './scenes/PreloadAssets';
import { PlayGame } from './scenes/PlayGame';
import { gameOptions } from './gameOptions';

const scaleObject : Phaser.Types.Core.ScaleConfig = {
  mode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  parent: 'thegame',
  width: gameOptions.gameSize.width,
  height: gameOptions.gameSize.height
}

const configObject: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: gameOptions.gameBackgroundColor,
  scale: scaleObject,
  scene: [
    PreloadAssets,
    PlayGame
  ]
}

new Phaser.Game(configObject);

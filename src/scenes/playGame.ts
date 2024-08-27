// THE GAME ITSELF

// modules to import
import { GameOptions } from '../gameOptions';

// PlayGame class extends Phaser.Scene class
export class PlayGame extends Phaser.Scene {

    constructor() {
        super({
            key : 'PlayGame'
        });
    }

    private graphics!    : Phaser.GameObjects.Graphics;  // graphics object where to render the path
    private path!        : Phaser.Curves.Path;           // the path
    private gems!        : Phaser.GameObjects.Sprite[];  // array with all gems

    // method to be called once the instance has been created
    public create() : void {

        // // initialize gems array
        // this.gems = [];

        // // create the path and load curves from a JSON string
        // this.path = new Phaser.Curves.Path(0, 0);
        // this.path.fromJSON(JSON.parse(GameOptions.path)); 
        
        // // get path length, in pixels
        // this.data.set('pathLength', this.path.getLength());

        // // add the graphic object and draw the path on it
        // this.graphics = this.add.graphics();
        // this.graphics.lineStyle(2, 0xffffff, 1);
        // this.path.draw(this.graphics);

        // // add a gem
        // this.addGem(0);
    }

    // method to add a gem
    // t : time relative to path, from 0 to 1, where 0 = at the beginning of the path, and 1 = at the end of the path
    private addGem(t : number) : void {

        // get gem start point
        const startPoint : Phaser.Math.Vector2 = this.path.getPoint(t);
        
        // create a sprite at gem start point 
        const gemSprite : Phaser.GameObjects.Sprite = this.add.sprite(startPoint.x, startPoint.y, 'gem');
        
        // set a custom "t" property
        gemSprite.setData('t', t);

        // add gem sprite to gemSprite array
        this.gems.push(gemSprite);
    }

    // metod to be called at each frame
    // time : time passed since the beginning, in milliseconds
    // deltaTime : time passed since last frame, in milliseconds
    public update(time : number, deltaTime : number) {

        // determine delta t movement
        const deltaT : number = deltaTime / 1000 * GameOptions.gemSpeed / this.data.get('pathLength');
      
        // loop through all gems
        this.gems.forEach((gem : Phaser.GameObjects.Sprite, index : number) => {
            
            // update gem's t data
            gem.setData('t', gem.getData('t') + deltaT);

            // if the gem reached the end of the path
            if (gem.getData('t') > 1) {

                // restart the game
                this.scene.start('PlayGame');
            }
            // if gem did not reach the end of the path
            else {

                // get new gem path point
                const pathPoint : Phaser.Math.Vector2 = this.path.getPoint(gem.getData('t'));
                
                // move the gem to new path point
                gem.setPosition(pathPoint.x, pathPoint.y);

                // get travelled distance , in pixels
                const travelledDistance : number = this.data.get('pathLength') * gem.getData('t');

                // if this is the last gem and there's enough space for another gem
                if (index == this.gems.length - 1 && travelledDistance > GameOptions.gemRadius * 2) {

                    // add a gem right behind it
                    this.addGem((travelledDistance - GameOptions.gemRadius * 2) / this.data.get('pathLength'));
                }
            }
        })
    }
}
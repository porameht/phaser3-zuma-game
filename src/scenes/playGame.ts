// THE GAME ITSELF

// modules to import
import { GameOptions } from '../gameOptions';
import { LinkedList } from '../linkedList';

// various game modes
enum gameMode {
    IDLE,   // waiting for player input
    FIRING, // player fired the bullet gem
    HIT,    // when a bullet gem collides with anoter gem
    STOP    // simply does nothing, useful to debug
}

// PlayGame class extends Phaser.Scene class
export class PlayGame extends Phaser.Scene {

    constructor() {
        super({
            key : 'PlayGame'
        });
    }

    private graphics!    : Phaser.GameObjects.Graphics;  // graphics object where to render the path
    private path!        : Phaser.Curves.Path;           // the path
    private gems!        : LinkedList;                   // linked list with all gems
    private gemBullet!   : Phaser.GameObjects.Sprite;    // the gem the player fires
    private debugText!   : Phaser.GameObjects.Text;      // just a text object to display debug information

    // method to be called once the instance has been created
    create() : void {

        // initialize gems list
        this.gems = new LinkedList();

        // create the path and load curves from a JSON string
        this.path = new Phaser.Curves.Path(0, 0);
        this.path.fromJSON(JSON.parse(GameOptions.path)); 
        
        // get path length, in pixels
        this.data.set('pathLength', this.path.getLength());
        this.data.set('gameMode', gameMode.IDLE);

        // add the graphic object and draw the path on it
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(2, 0xffffff, 1);
        this.path.draw(this.graphics);

        // add a gem
        this.addGem(0, 0, Phaser.Math.RND.pick(GameOptions.gemColor));

        // add gem bullet
        this.gemBullet = this.add.sprite(this.game.config.width as number / 2, this.game.config.height as number / 2, 'gem');
        this.gemBullet.setTint(Phaser.Math.RND.pick(GameOptions.gemColor));

        // event to be triggered when the player clicks or taps the screen
        this.input.on('pointerdown', (pointer : Phaser.Input.Pointer) => {

            // check game mode
            switch (this.data.get('gameMode')) {
                
                // idle, waiting for player input
                case gameMode.IDLE : 

                    // game mode now is "firing"
                    this.data.set('gameMode', gameMode.FIRING);

                    // write the debug message
                    this.debugText.setText('FIRING');

                    // check the line of fire between bullet and input position
                    const lineOfFire : Phaser.Geom.Line = new Phaser.Geom.Line(this.gemBullet.x, this.gemBullet.y, pointer.x, pointer.y);
                    
                    // save the line of fire as a custom data in gem bullet
                    this.gemBullet.setData('angle', Phaser.Geom.Line.Angle(lineOfFire));
                    break;

                // stop, when the game is paused    
                case gameMode.STOP : 

                    // game mode now is "hit"
                    this.data.set('gameMode', gameMode.HIT);
                    break;
            }
        })

        // add the debug text
        this.debugText = this.add.text(32, 32, 'CLICK OR TAP TO FIRE', {
            color       : '#00ff00',    // text color
            fontSize    : 32            // font size
        });
    }

    // method to add a gem
    // t : time relative to path, from 0 to 1, where 0 = at the beginning of the path, and 1 = at the end of the path
    // index : the index of gems list where to insert the gem
    // color : gem color
    addGem(t : number, index : number, color : number) : void {

        // get gem start point
        const startPoint : Phaser.Math.Vector2 = this.path.getPoint(t);
        
        // create a sprite at gem start point 
        const gemSprite : Phaser.GameObjects.Sprite = this.add.sprite(startPoint.x, startPoint.y, 'gem');

        // tint the sprite
        gemSprite.setTint(color);
        
        // set a custom "t" property to save the time relative to path
        gemSprite.setData('t', t);

        // add gem sprite to gemSprite list by appending it or inserting at a given position
        if (index == this.gems.size) {        
            this.gems.append(gemSprite);
        }
        else {
            this.gems.insertAt(gemSprite, index);
        }
    }

    // metod to be called at each frame
    // time : time passed since the beginning, in milliseconds
    // deltaTime : time passed since last frame, in milliseconds
    update(time : number, deltaTime : number) {

        // if game mode is "stop", the game is paused so we can exit right now
        if (this.data.get('gameMode') == gameMode.STOP) {
            return;
        } 

        // determine delta t movement according to delta time and path length
        const deltaT : number = deltaTime / 1000 * GameOptions.gemSpeed / this.data.get('pathLength');

        // is the player firing?
        if (this.data.get('gameMode') == gameMode.FIRING) {

            // update bullet x and y position according to speed, delta time and angle of fire
            this.gemBullet.x += GameOptions.bulletSpeed * deltaTime / 1000 * Math.cos(this.gemBullet.getData('angle'));
            this.gemBullet.y += GameOptions.bulletSpeed * deltaTime / 1000 * Math.sin(this.gemBullet.getData('angle'));

            // is the bullet outside the screen?
            if (this.gemBullet.x < -GameOptions.gemRadius || this.gemBullet.y < -GameOptions.gemRadius || this.gemBullet.x > (this.game.config.width as number) + GameOptions.gemRadius || this.gemBullet.y > (this.game.config.height as number) + GameOptions.gemRadius) {
                
                // place the bullet in the middle of the screen again
                this.gemBullet.setPosition(this.game.config.width as number / 2, this.game.config.height as number / 2);

                // give the bullet a new random color
                this.gemBullet.setTint(Phaser.Math.RND.pick(GameOptions.gemColor));

                // set game mode to "idle", waiting for player input
                this.data.set('gameMode', gameMode.IDLE);

                // update debug text
                this.debugText.setText('CLICK OR TAP TO FIRE')
            }
        }

        // loop through all gems
        this.gems.forEach((gem : Phaser.GameObjects.Sprite, index : number) => {

            // set gem fully opaque
            gem.setAlpha(1);
            
            // update gem's t data
            gem.setData('t', gem.getData('t') + deltaT);

            // if the gem reached the end of the path...
            if (gem.getData('t') > 1) {

                // restart the game
                this.scene.start('PlayGame');
            }

            // if the gem did not reach the end of the path...
            else {

                // get new gem path point
                const pathPoint : Phaser.Math.Vector2 = this.path.getPoint(gem.getData('t'));
                
                // move the gem to new path point
                gem.setPosition(pathPoint.x, pathPoint.y);

                // get the tangent to path at gem's position
                const vector : Phaser.Math.Vector2 = this.path.getTangent(gem.getData('t'));

                // rotate the gem accordingly
                gem.setRotation(vector.angle())

                // is the player firing?
                if (this.data.get('gameMode') == gameMode.FIRING) {

                    // get the distance between gem and bullet
                    const distance : number = Phaser.Math.Distance.Squared(gem.x, gem.y, this.gemBullet.x, this.gemBullet.y);

                    // is the distance smaller than gem diameter?
                    if (distance < GameOptions.gemRadius * 4 * GameOptions.gemRadius) {
                        
                        // game mode must be set to "hit"
                        this.data.set('gameMode', gameMode.HIT);

                        // highlight the gem by making is semi transparent
                        gem.alpha = 0.5;

                        // get the angle between gem center and bullet center
                        const angle : number = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.gemBullet.x, this.gemBullet.y, gem.x, gem.y));

                        // get the relative angle taking into account gem rotation
                        const relativeAngle : number = Phaser.Math.Angle.WrapDegrees(angle - gem.angle);

                        // at this time the bullet should become a gem to be inserted at index-th place or index+1-th place according to relative angle
                        this.data.set('insertInPlace', relativeAngle < -90 ? index : index + 1);

                        // update debug text to explain everything
                        this.debugText.setText('COLLISION\n\nItem number ' + index + '\n\nAngle between\nbullet and item: ' + Math.round(angle) + '\n\nAngle of\npath tangent: ' + Math.round(gem.angle) + '\n\nRelative angle: ' + Math.round(relativeAngle) + '\n\nMust be placed\n' + ((relativeAngle < -90) ? 'BEFORE' : 'AFTER') + '\nat position ' + this.data.get('insertInPlace') + '\n\nFIRE TO CONTINUE')
                        
                        // stop the game
                        this.data.set('gameMode', gameMode.STOP);
                    }
                }

                // get travelled distance, in pixels
                const travelledDistance : number = this.data.get('pathLength') * gem.getData('t');

                // if this is the last gem and there's enough space for another gem
                if (index == this.gems.size - 1 && travelledDistance > GameOptions.gemRadius * 2) {

                    // add a gem right behind it
                    this.addGem((travelledDistance - GameOptions.gemRadius * 2) / this.data.get('pathLength'), this.gems.size, Phaser.Math.RND.pick(GameOptions.gemColor));
                }
            }
        })

        // is game mode set to "hit"?
        if (this.data.get('gameMode') == gameMode.HIT) {

            // convert gem diameter, in pixels to "t", the time in the path from 0 to 1
            const gemT : number = GameOptions.gemRadius * 2 / this.data.get('pathLength');
            
            // loop through all gems from the first one to the one to be inserted
            for (let i : number = 0; i < this.data.get('insertInPlace'); i ++) {

                // increase "t" data of the gem to move it forward by one gem
                this.gems.getAt(i).setData('t', this.gems.getAt(i).getData('t') + gemT);

                // get the new path point
                const pathPoint : Phaser.Math.Vector2 = this.path.getPoint(this.gems.getAt(i).getData('t'));

                // move gem sprite forward
                this.gems.getAt(i).setPosition(pathPoint.x, pathPoint.y);
            }

            // add the new gem 
            this.addGem(this.gems.getAt(this.data.get('insertInPlace')).data.get('t') + gemT, this.data.get('insertInPlace'), this.gemBullet.tint);

            // place the gem bullet in the center of the screen
            this.gemBullet.setPosition(this.game.config.width as number / 2, this.game.config.height as number / 2);

            // give the gem bullet a new random color
            this.gemBullet.setTint(Phaser.Math.RND.pick(GameOptions.gemColor));

            // game mode is now "idle", waiting for player input
            this.data.set('gameMode', gameMode.IDLE);  

            // update debug text
            this.debugText.setText('CLICK OR TAP TO FIRE');
        }
    }
}
// CONFIGURABLE GAME OPTIONS
// changing these values will affect gameplay

export const GameOptions : any = {

  gameSize : {
      width               : 1920,     // width of the game, in pixels
      height              : 1080      // height of the game, in pixels
  },

  gemColor                : [         // gem colors
      0xff0000,
      0x00ff00,
      0x0000ff,
      0xff00ff,
      0xffff00,
      0x00ffff
  ],

  gameBackgroundColor     : 0x222222, // game background color

  path                    : '{"type":"Path","x":0,"y":0,"autoClose":false,"curves":[{"type":"LineCurve","points":[1460,-50,1460,540]},{"type":"EllipseCurve","x":960,"y":540,"xRadius":500,"yRadius":500,"startAngle":0,"endAngle":180,"clockwise":false,"rotation":0},{"type":"EllipseCurve","x":910,"y":540,"xRadius":450,"yRadius":450,"startAngle":180,"endAngle":0,"clockwise":false,"rotation":0},{"type":"EllipseCurve","x":960,"y":540,"xRadius":400,"yRadius":400,"startAngle":0,"endAngle":180,"clockwise":false,"rotation":0},{"type":"EllipseCurve","x":910,"y":540,"xRadius":350,"yRadius":350,"startAngle":180,"endAngle":0,"clockwise":false,"rotation":0},{"type":"EllipseCurve","x":960,"y":540,"xRadius":300,"yRadius":300,"startAngle":0,"endAngle":180,"clockwise":false,"rotation":0},{"type":"EllipseCurve","x":910,"y":540,"xRadius":250,"yRadius":250,"startAngle":180,"endAngle":0,"clockwise":false,"rotation":0},{"type":"EllipseCurve","x":960,"y":540,"xRadius":200,"yRadius":200,"startAngle":0,"endAngle":180,"clockwise":false,"rotation":0},{"type":"EllipseCurve","x":910,"y":540,"xRadius":150,"yRadius":150,"startAngle":180,"endAngle":0,"clockwise":false,"rotation":0},{"type":"EllipseCurve","x":960,"y":540,"xRadius":100,"yRadius":100,"startAngle":0,"endAngle":180,"clockwise":false,"rotation":0}]}',
  gemSpeed                : 200,      // gem speed, in pixels per second
  gemRadius               : 24,       // gem radius, in pixels
  bulletSpeed             : 400       // bullet speed, in pixels per second

}
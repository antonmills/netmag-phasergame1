
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('menu', 'assets/menu.jpg');
    this.load.image('background', 'assets/background.jpg');
    this.load.image('player', 'assets/player.png');
    this.load.image('creature_1', 'assets/creature_1.png');
    this.load.image('creature_2', 'assets/creature_2.png');
    this.load.image('creature_3', 'assets/creature_3.png');
    this.load.image('gameover', 'assets/gameover.jpg');

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

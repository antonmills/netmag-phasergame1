(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(900, 480, Phaser.AUTO, 'netmag-phaser');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":2,"./states/gameover":3,"./states/menu":4,"./states/play":5,"./states/preload":6}],2:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],3:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    this.gameoverbg = this.game.add.sprite(0, 0, 'gameover');
    
    this.score_text = this.game.add.text(this.game.world.centerX, 325, String(this.game.score), { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.score_text.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],4:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    this.title = this.game.add.sprite(0, 0, 'menu');  
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],5:[function(require,module,exports){

  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      // background
      this.bg = this.game.add.sprite(0, 0, 'background');

      // sets the world bounds (to allow for the floor we only use 423 height)
      this.game.world.bounds = new Phaser.Rectangle(0, 0, 900, 423);

      // set the game physics
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.game.physics.arcade.gravity.y = 450;

      // add the player
      this.player = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'player');
      this.game.physics.arcade.enable(this.player);
      this.player.body.collideWorldBounds = true;
      this.player.anchor.set(0.5, 0);
      this.player.jump_timer = this.game.time.now + 1050;

      // create enemy pool
      this.enemy = [];
      for(var i = 0; i < 60; i++) {
        var enemy = this.enemy[i] = this.game.add.sprite(100, 400, 'creature_' + this.game.rnd.integerInRange(1, 3));
        this.game.physics.arcade.enable(enemy);
        enemy.jump_timer = 0;
        enemy.jump_height = 110 + (Math.random() * 260);
        enemy.body.collideWorldBounds = true; 
        enemy.visible = false;
      }

      // enemy related
      this.enemy_timer = Math.random() * 120; 
      this.current_enemy = 0;

      // score
      this.game.score = 0;
      this.game.score_multiplier = 0;
      this.score_hit = false;
      this.score_text = this.game.add.text(20, 20, "Score: 0\nCombo: 0", {
        font: "26px Arial",
        fill: "#ffffff",
        align: "left"
    });

      // game time
      this.game_time = 750;
      this.game_time_text = this.game.add.text(this.game.width - 122, 20, "Time: 60", {
        font: "26px Arial",
        fill: "#ffffff",
        align: "left"
    });
    },

    update: function() {
        // input controls
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.jump_button = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        // smooth movement horizontally
        this.player.body.velocity.x *= 0.8;

        // move player left/right
        if(this.cursors.left.isDown && !this.player.body.onFloor()) {
            this.player.body.velocity.x = -90;
            this.player.scale.x = 1;
        }
        else if(this.cursors.right.isDown && !this.player.body.onFloor()) {
            this.player.body.velocity.x = 90;
            this.player.scale.x = -1;
        }

        // player jump
        if(this.player.body.onFloor() && this.game.time.now > this.player.jump_timer) {
            this.player.body.velocity.y = -460;
            this.player.jump_timer = this.game.time.now + 2250;

            // keep track of hitting enemies per jump
            if(this.score_hit == false) {
              this.game.score_multiplier = 0;
              this.score_text.setText("Score: " + this.game.score + "\nCombo: "+ this.game.score_multiplier);
            } else
            {
              this.score_hit = false;
            }
        }

        // enemy jump
        for(var i = 0; i < this.enemy.length; i++) {
          var enemy = this.enemy[i];
          if(enemy.body.onFloor() && enemy.live && this.game.time.now > enemy.jump_timer) {
            enemy.body.velocity.y = -enemy.jump_height;
            enemy.jump_timer = this.game.time.now + 1860;
          }

          if(enemy.body.onFloor() && enemy.live) {
            enemy.body.velocity.x = 0;
          }

          if(!enemy.body.onFloor() && enemy.live) {
            enemy.direction == "right" ? enemy.body.velocity.x = 80 : enemy.body.velocity.x = -80;
          }
        }

        // enemy collides
        var count = this.enemy.length;
        for(var i = 0; i < count; i++) {
          var boundsA = this.enemy[i].getBounds();
          var boundsB = this.player.getBounds();

          if(Phaser.Rectangle.intersects(boundsA, boundsB) && this.enemy[i].visible == true) {
            this.onCollide(this.enemy[i], this.player);
          }
        }

        // enemy reset
        this.enemy_timer--;
        if(this.enemy_timer < 0) {
          this.reset_enemy();
          this.enemy_timer = 50 + Math.random() * 200;
        }

        // game time
        this.game_time--;
        this.game_time_text.setText("Time: " + parseInt(this.game_time / 60));
        if(this.game_time < 0) {
          this.game.state.start('gameover');
        }
    },

    // invoked when a collision occurs between a player and an enemy
    onCollide: function(enemy, player) {
      if(player.y < 420) {
        enemy.x = 0;
        enemy.y = 0;
        enemy.visible = false;
        
        // score related
        this.game.score_multiplier++;
        this.game.score += (2 * this.game.score_multiplier);
        this.score_text.setText("Score: " + this.game.score + "\nCombo: "+ this.game.score_multiplier);
        this.score_hit = true;
      }
    },

    // reset an enemy to a starting position (left or right)
    reset_enemy: function() {
      var enemy = this.enemy[this.current_enemy];
      enemy.y = 300;

      // appear left or right
      var left_or_right = this.game.rnd.integerInRange(0, 1);
      if(left_or_right == 0) {
        enemy.body.x = 30;
        enemy.direction = "right";
      } else {
        enemy.body.x = this.game.width - 70;
        enemy.direction = "left";
      }
      
      // iterate over the object pool - reusing enemies where possible
      this.current_enemy++;
      if(this.current_enemy > this.enemy.length - 1) {
        this.current_enemy = 0;
      }

      enemy.visible = true;
      enemy.live = true;
    }
  };
  
  module.exports = Play;
},{}],6:[function(require,module,exports){

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

},{}]},{},[1])
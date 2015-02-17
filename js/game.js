(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';


function ActorControls() {
  this.moveUp = false;
  this.moveDown = false;
  this.moveLeft = false;
  this.moveRight = false;
  this.moveJump = false;
}

function Actor(game, x, y, key, frame) {
  Phaser.Sprite.call(this, game, x, y, key, frame);
  this.controls = new ActorControls();
}

Actor.prototype = Object.create(Phaser.Sprite.prototype);
Actor.prototype.constructor = Actor;

module.exports = {
  Actor: Actor,
  ActorControls: ActorControls
};

},{}],2:[function(require,module,exports){
'use strict';


function Bouncer(game, x, y, key, frame) {
  Phaser.Sprite.call(this, game, x, y, key, frame);
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.bounce.setTo(1.0, 1.0);
  this.body.collideWorldBounds = true;
  this.walkSpeed = 400;
  this.walkFps = 20;
  this.anchor.setTo(0.5, 0.5);
}

Bouncer.prototype = Object.create(Phaser.Sprite.prototype);
Bouncer.prototype.constructor = Bouncer;

Bouncer.prototype.update = function () {
  Phaser.Sprite.prototype.update.call(this);
  // handle movement
  var v = this.body.velocity;
  var angle = Math.atan2(v.y, v.x);
  this.rotation += Phaser.Math.normalizeAngle((angle - this.rotation)) * 0.6;
  this.animations.play('walk', this.walkFps);
}

Bouncer.prototype.changeCourse = function (angle) {
  this.body.velocity.setTo(Math.cos(angle) * this.walkSpeed, Math.sin(angle) * this.walkSpeed);
}


module.exports = Bouncer;
},{}],3:[function(require,module,exports){
'use strict';

var Actor = require('./actor').Actor;

function Paddle(game, x, y, key, frame) {
  Actor.call(this, game, x, y, key, frame);
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.immovable = true;
  this.lateralSpeed = 500;
  this.anchor.setTo(0.5, 0.5);
}

Paddle.prototype = Object.create(Actor.prototype);
Paddle.prototype.constructor = Paddle;

Paddle.prototype.update = function () {
  Actor.prototype.update.call(this);
  // handle movement
  var controls = this.controls;
  var xDir = controls.moveLeft ? -1 : 0;
  xDir += controls.moveRight ? 1 : 0;
  this.body.velocity.x = this.lateralSpeed * xDir;
}

module.exports = Paddle;

},{"./actor":1}],4:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'topdown');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":5,"./states/gameover":6,"./states/menu":7,"./states/play":8,"./states/preload":9}],5:[function(require,module,exports){

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

},{}],6:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You did not survive', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],7:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    //var img = this.game.add.sprite(0, 0, 'title');
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX, 300, 'Breakout', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],8:[function(require,module,exports){
'use strict';

var Bouncer = require('../elements/bouncer');
var Paddle = require('../elements/paddle');

function Play() {}

Play.prototype = {
  create: function() {
    this.game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.LEFT,
      Phaser.Keyboard.RIGHT,
      Phaser.Keyboard.UP,
      Phaser.Keyboard.DOWN
    ]);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    var gameWidth = 800;
    var gameHeight = 600;
    this.game.world.setBounds(0, 0, gameWidth, gameHeight);
    this.terrain = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'terrain0');
    this.terrain.fixedToCamera = true;
    
    this.bouncer = new Bouncer(this.game, gameWidth * 0.5, gameHeight * 0.2, 'suit_walk');   
    this.bouncer.animations.add('idle', [0]);
    this.bouncer.animations.add('walk', [0,1,2,3,4,5,6,7]);
    var side = this.bouncer.height * 0.9;
    this.bouncer.body.setSize(side, side, 0.5 * (this.bouncer.width - side), 0.5 * (this.bouncer.height - side));
    
    this.game.add.existing(this.bouncer);
    this.game.camera.follow(this.bouncer);
    this.bouncer.changeCourse(Math.PI * 0.5);

    this.paddle = new Paddle(this.game,gameWidth * 0.5, gameHeight * 0.9, 'paddle0');
    this.game.add.existing(this.paddle);
  },
  update: function() {
    if (this.game.device.desktop && false) {
      this.updateKeyControls();
    } else {
      this.updateTouchControls();
    }
    this.terrain.tilePosition.setTo(-this.camera.view.x, -this.camera.view.y);

    this.game.physics.arcade.collide(this.paddle, this.bouncer, this.bouncerOnPaddle.bind(this));
  },
  bouncerOnPaddle: function (paddle, bouncer) {
    var coneFactor = 0.8;
    var dx = (bouncer.x - paddle.x) / (paddle.width);
    dx = Math.max(-0.5, dx);
    dx = Math.min(0.5, dx);
    //dx = 1-dx;
    var angle = Math.PI * (coneFactor * dx - 0.5);
    this.bouncer.changeCourse(angle); 
  },
  updateKeyControls: function () {
    var controls = this.paddle.controls;
    var keyboard = this.game.input.keyboard;
    controls.moveLeft = controls.moveRight = false;
    controls.moveLeft = keyboard.isDown(Phaser.Keyboard.LEFT);
    controls.moveRight = keyboard.isDown(Phaser.Keyboard.RIGHT);
    controls.moveUp = keyboard.isDown(Phaser.Keyboard.UP);
    controls.moveDown = keyboard.isDown(Phaser.Keyboard.DOWN);
  },
  updateTouchControls: function () {
    var controls = this.paddle.controls;
    var pointer = this.game.input.activePointer;
    if (pointer) {
      var epsilon = Math.min(this.paddle.width, this.paddle.height) * 0.25;
      var dx = pointer.worldX - this.paddle.x;
      var dy = pointer.worldY - this.paddle.y;
      controls.moveUp = controls.moveDown = controls.moveLeft = controls.moveRight = false;
      if (dx * dx + dy * dy > epsilon * epsilon) {
        controls.moveLeft = controls.moveRight = false;
        controls.moveLeft = pointer.worldX < this.paddle.x - epsilon;
        controls.moveRight = pointer.worldX > this.paddle.x + epsilon;
        controls.moveUp = pointer.worldY < this.paddle.y - epsilon;
        controls.moveDown = pointer.worldY > this.paddle.y + epsilon;
      }
    }
  }
};

module.exports = Play;

},{"../elements/bouncer":2,"../elements/paddle":3}],9:[function(require,module,exports){

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
    this.load.spritesheet('suit_walk', 'assets/suit_walk_top.png', 177, 100, 8);
    this.load.image('terrain0', 'assets/ground_cobblestone4.jpg');
    this.load.image('paddle0', 'assets/paddle0.jpg');
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

},{}]},{},[4])
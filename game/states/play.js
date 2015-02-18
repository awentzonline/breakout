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
    
    //
    this.targetGroup = this.game.add.group();
    this.setupTargets(400, 200, 'brick0');

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
    this.game.physics.arcade.collide(this.bouncer, this.targetGroup, this.bouncerOnTarget.bind(this));
    this.game.debug.body(this.bouncer.body, 'rgba(255, 255, 0, 0.1)');
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
  bouncerOnTarget: function (bouncer, target) {
    target.kill();
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
  },
  setupTargets: function (midX, midY, imageName) {
    // lay out the sprites of `imageName` about the given midX/Y params
    var image = this.game.cache.getImage(imageName);
    // lazy town
    var level = [
      [0,1,0,0,0,1,0,0,1,1,0,0,0],
      [1,0,1,0,1,1,1,1,1,1,1,0,0],
      [0,0,0,1,1,1,0,1,1,0,1,1,0],
      [1,1,1,0,1,1,0,1,1,1,1,0,0],
      [1,0,1,1,1,1,0,1,1,1,1,0,0],
    ];
    var rowLength = level[0].length;
    var halfWidth = rowLength * image.width * 0.5;
    var halfHeight = level.length * image.height * 0.5;
    var y = 0;
    for (var i = 0; i < level.length; i++) {
      var row = level[i];
      var x = 0;
      for (var j = 0; j < row.length; j++) {
        var index = row[j];
        if (index != 0) {
          var sprite = this.game.add.sprite(
            x - halfWidth + midX,
            y - halfHeight + midY,
            imageName
          );
          this.game.physics.enable(sprite, Phaser.Physics.ARCADE);
          sprite.body.immovable = true;
          this.targetGroup.add(sprite);
        }
        x += image.width;
      }
      y += image.height;
    }
  }
};

module.exports = Play;

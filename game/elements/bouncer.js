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
  this.rotation = Math.atan2(v.y, v.x);
  this.animations.play('walk', this.walkFps);
}

Bouncer.prototype.changeCourse = function (angle) {
  this.body.velocity.setTo(Math.cos(angle) * this.walkSpeed, Math.sin(angle) * this.walkSpeed);
}


module.exports = Bouncer;
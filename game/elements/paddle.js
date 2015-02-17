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

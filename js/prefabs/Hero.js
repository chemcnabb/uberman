Hero = function (game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'hero', frame);

  // initialize your prefab here
  this.frame = 0;
  this.currentState = "uber";

  this.dummy = this.game.add.sprite(0, 0);

  this.game.physics.arcade.enable(this);
  this.directions = ["LEFT", "UP_LEFT", "UP", "UP_RIGHT", "RIGHT", "DOWN_RIGHT", "DOWN", "DOWN_LEFT"];
  this.alter_walk = this.animations.add("alter_up", [5], 6, false);
  this.alter_walk = this.animations.add("alter_fall", [5, 6, 7, 8, 9, 10], 6, false);
  this.alter_walk = this.animations.add("alter_walk", [5, 6, 7, 8, 9, 10], 6, false);
  this.alter_walk = this.animations.add("alter_stand", [5], 6, false);
  this.alter_walk = this.animations.add("uber_stand", [0], 6, false);
  this.alter_walk = this.animations.add("uber_walk", [0], 6, false);
  this.alter_walk = this.animations.add("fly_side", [3,4], 6, false);
  this.alter_walk = this.animations.add("fly_up", [1,2], 6, true);
  this.alter_walk = this.animations.add("fly_up_diagonal", [3,4], 6, true);
  this.alter_walk = this.animations.add("fly_down_diagonal", [3,4], 6, true);

  this.body.gravity.y = 300;
  this.body.collideWorldBounds = true;
  this.body.fixedRotation = true;
  this.anchor.setTo(0.5, 0.5);

  this.game.camera.follow(this, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);


};

Hero.prototype = Object.create(Phaser.Sprite.prototype);

Hero.prototype.constructor = Hero;

Hero.prototype.getCardinal = function (angle, diagonals) {

  if (diagonals) {
    angle = Math.round((angle + Math.PI) / (Math.PI * 2) * 8) % 8;
    return (this.directions[angle]);
  }
  else {
    angle = Math.round((angle + Math.PI) / (Math.PI * 2) * 4) % 4;
    return (this.directions[angle * 2]);
  }
};


Hero.prototype.alter_movement = function (onGround) {
  if (onGround) {
    this.body.velocity.y = 0;
  }

  this.angle = 0;
  this.body.allowRotation = false;
  var pointer = this.game.input.activePointer;



  if (onGround) {
    back.x -= this.body.velocity.x*(0.001);

    if (pointer.worldX > this.x) {
      //RIGHT

      this.scale.x = 1;
      this.animations.play("alter_walk");
    }
    if (pointer.worldX < this.x) {
      //LEFT

      this.scale.x = -1;
      this.animations.play("alter_walk");
    }


    this.game.physics.arcade.moveToXY(this, pointer.worldX, this.y, 225);


  }


};

Hero.prototype.uber_movement = function (onGround) {
  var angle = this.game.physics.arcade.moveToPointer(this, 60, this.game.input.activePointer, 500);
  var direction = this.getCardinal(angle, true);


back.x -= this.body.velocity.x*(0.001);
  if(!onGround){
    back.y -= this.body.velocity.y*(0.001);
  }




  switch (direction) {


    case "UP":
      this.angle = 0;

      if (!onGround) {
        this.animations.play("fly_up");
      } else {
        this.animations.play("uber_stand");
      }


      break;
    case "DOWN":
      this.angle = 0;


      if (!onGround) {
        this.animations.play("fly_up");
      } else {
        this.animations.play("uber_stand");
      }


      break;
    case "UP_LEFT":
      this.angle = -45;
      this.scale.x = -1;
      this.animations.play("fly_up_diagonal");


      break;
    case "UP_RIGHT":
      this.scale.x = 1;
      this.angle = 45;
      this.animations.play("fly_up_diagonal");

      break;
    case "RIGHT":
      this.scale.x = 1;
      if (!onGround) {
        this.angle = 90;
        this.animations.play("fly_side");
      } else {
        this.angle = 0;
        this.animations.play("uber_walk");
      }


      break;
    case "DOWN_RIGHT":
      this.scale.x = 1;
      if (!onGround) {
        this.angle = 135;
        this.animations.play("fly_down_diagonal");
      } else {
        this.angle = 0;
        this.animations.play("uber_walk");
      }

      break;
    case "DOWN_LEFT":
      this.scale.x = -1;
      if (!onGround) {
        this.angle = -135;
        this.animations.play("fly_down_diagonal");
      } else {
        this.angle = 0;
        this.animations.play("uber_walk");
      }

      break;
    case "LEFT":
      this.scale.x = -1;


      if (!onGround) {
        this.angle = -90;
        this.animations.play("fly_side");
      } else {
        this.angle = 0;
        this.animations.play("uber_walk");
      }


      break;

  }
};

Hero.prototype.isMoving = function () {
  return Phaser.Point.equals(this.body.velocity, new Phaser.Point(0, 0));
};

Hero.prototype.checkState = function () {
  var that = this;
  this.game.input.keyboard.onDownCallback = function (e) {
    if (e.keyCode == 32 && that.body.touching.down) {
      if (that.currentState == "uber") {
        that.currentState = "alter";
        that.angle = 0;
        that.animations.play("alter_stand");
      } else {
        that.currentState = "uber";
        that.animations.play("uber_stand");
      }
    }

  };
};
Hero.prototype.update = function () {
  this.checkState();
  var onGround = this.body.touching.down;
  var direction;

  if (this.game.input.activePointer.isDown) {
    if (this.currentState == "uber") {
      this.uber_movement(onGround);
    } else {
      this.alter_movement(onGround);
    }
  }
  if (!this.game.input.activePointer.justReleased(1) && !this.game.input.activePointer.isDown) {
    this.angle = 0;
    this.body.velocity.set(0);
    direction = null;

    if (this.currentState == "uber") {
      this.animations.play("fly_up");
      if (onGround) {
        this.animations.play("uber_stand");
      }
    }else{
      this.animations.stop();
    }

  }
};


Hero.prototype.render = function () {
  this.game.debug.text(direction || "--", 2, 14, '#0f0');
};


module.exports = Hero;
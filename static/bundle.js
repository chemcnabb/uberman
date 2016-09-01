(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Uberman = {};

Hero = require('./prefabs/Hero');
DayCycle = require('./prefabs/DayCycle');


Uberman.Boot = function (game) {
  var player;
  var platforms;
  var cursors;
  var jumpButton;
};

Uberman.Boot.prototype = {


  preload: function () {





    //this.game.load.image('platform', 'sprites/platform.png');
    this.game.load.image('ground', 'images/ground.gif', 4267, 10);
    this.game.load.image('city_foreground', 'images/city_foreground.png', 4267, 2133);
    this.game.load.image('city_background', 'images/city_background.png', 4267, 2133);
    this.game.load.image('cape_streak', 'images/cape_streak.png');
    this.game.load.image('sun', 'images/sun.png');
    this.game.load.image('moon', 'images/moon.png');
    this.game.load.spritesheet('hero', 'images/uber_sprite.gif', 55, 110, 11);


  },


  create: function () {

    //this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.stage.backgroundColor = '#000';
    this.game.world.setBounds(0, 0, 4267, 8192);
    dayCycle = new DayCycle(this.game, 60000*5);


    var bgBitMap = this.game.add.bitmapData(this.game.world.width, this.game.world.height);


    bgBitMap.ctx.rect(0, 0, this.game.world.width, this.game.world.height);
    bgBitMap.ctx.fillStyle = '#85b5e1';
    bgBitMap.ctx.fill();

    var backgroundSprite = this.game.add.sprite(0,0, bgBitMap);


    platforms = this.game.add.group();
    platforms.enableBody = true;

    var ground = platforms.create(0, this.game.world.height - 209, 'ground');
    ground.scale.setTo(2, 2);
    this.game.physics.enable(ground);

    ground.body.immovable = true;


    sunSprite = this.game.add.sprite(this.game.world.width - (this.game.world.width / 2), this.game.world.height/2, 'sun');
    moonSprite = this.game.add.sprite(this.game.world.width - (this.game.world.width / 2), this.game.world.height, 'moon');



    back = this.game.add.sprite(this.game.world.centerX-(4267/2), this.game.world.height-2100, 'city_background');
    fore = this.game.add.sprite(this.game.world.centerX-(4267/2), this.game.world.height-2133, 'city_foreground');

    var backgroundSprites = [
      {sprite: backgroundSprite, from: 0x1f2a27, to: 0xB2DDC8},
      {sprite: back, from: 0x1f2a27, to: 0xB2DDC8},
      {sprite: fore, from: 0x2f403b, to: 0x96CCBB}
    ];

    dayCycle.initShading(backgroundSprites);
    dayCycle.initSun(sunSprite);
    dayCycle.initMoon(moonSprite);



    this.player = new Hero(this.game, this.game.world.centerX, this.game.world.height-260, this.game.world.height/2);

    // and add it to the game
    this.game.add.existing(this.player);




    cursors = this.game.input.keyboard.createCursorKeys();


  },


  update: function () {

    this.game.physics.arcade.collide(this.player, platforms);

  },
  render: function () {

  }

};

module.exports = Uberman.Boot;
},{"./prefabs/DayCycle":4,"./prefabs/Hero":5}],2:[function(require,module,exports){
var Uberman = {};


Uberman.Preloader = function (Uberman) {

};

Uberman.Preloader.prototype = {


  preload: function () {



  },


  create: function () {



  },


  update: function () {


  },

  render: function () {

  }

};

module.exports = Uberman.Preloader;
},{}],3:[function(require,module,exports){
/**
 * Created by che.mcnabb on 16-08-20.
 */
/**
 * Generated from the Phaser Sandbox
 *
 * http://phaser.io/sandbox/jQAfQlUa
 *
 * This source requires Phaser 2.6.1
 */
var Game = Game || {};
Boot = require("./Boot");
Preloader = require("./Preloader");



var size = {
  width:window.innerWidth,
  height:window.innerHeight
};


(function (size) {
  // initialize the framework
console.log(size);
  var game = new Phaser.Game(size.width, size.height, Phaser.AUTO, '');





  // add game states
  game.state.add('Boot', Boot);
  game.state.add('Preloader', Preloader);
  //game.state.add('MainMenu', MainMenu);
  //game.state.add('Game', Game);
  // start the Boot state
  game.state.start('Boot');

})(size);

},{"./Boot":1,"./Preloader":2}],4:[function(require,module,exports){
DayCycle = function (game, dayLength) {
  this.game = game;
  this.dayLength = dayLength;
  this.shading = false;
  this.sunSprite = false;
  this.moonSprite = false;
};
DayCycle.prototype = Object.create(Phaser.Sprite.prototype);

DayCycle.prototype.constructor = DayCycle;

DayCycle.prototype.initSun = function (sprite) {
  this.sunSprite = sprite;
  this.sunset(sprite);
};

DayCycle.prototype.initMoon = function (sprite) {
  this.moonSprite = sprite;
  this.moonrise(sprite);
};

DayCycle.prototype.initShading = function (sprites) {
  this.shading = sprites;
};

DayCycle.prototype.sunrise = function (sprite) {

  sprite.position.x = this.game.width - (this.game.width / 4);

  this.sunTween = this.game.add.tween(sprite).to({y: -250}, this.dayLength, null, true);
  this.sunTween.onComplete.add(this.sunset, this);

  if (this.shading) {
    var that = this;
    this.shading.forEach(function (sprite) {
      that.tweenTint(sprite.sprite, sprite.from, sprite.to, that.dayLength);
    });
  }

};

DayCycle.prototype.sunset = function (sprite) {

  sprite.position.x = 50;

  this.sunTween = this.game.add.tween(sprite).to({y: this.game.world.height}, this.dayLength, null, true);
  this.sunTween.onComplete.add(this.sunrise, this);

  if (this.shading) {
    var that = this;
    this.shading.forEach(function (sprite) {
      that.tweenTint(sprite.sprite, sprite.to, sprite.from, that.dayLength);
    });
  }

};

DayCycle.prototype.moonrise = function (sprite) {

  sprite.position.x = this.game.width - (this.game.width / 4);

  this.moonTween = this.game.add.tween(sprite).to({y: -350}, this.dayLength, null, true);
  this.moonTween.onComplete.add(this.moonset, this);
};

DayCycle.prototype.moonset = function (sprite) {

  sprite.position.x = 50;

  this.moonTween = this.game.add.tween(sprite).to({y: this.game.world.height}, this.dayLength, null, true);
  this.moonTween.onComplete.add(this.moonrise, this);
};

DayCycle.prototype.tweenTint = function (spriteToTween, startColor, endColor, duration) {

  var colorBlend = {step: 0};

  this.game.add.tween(colorBlend).to({step: 100}, duration, Phaser.Easing.Default, false)
    .onUpdateCallback(function () {
      spriteToTween.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step, 1);
    }).start();
};


module.exports = DayCycle;
},{}],5:[function(require,module,exports){
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
},{}]},{},[3]);

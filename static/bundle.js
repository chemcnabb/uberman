(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Uberman = Uberman || {};



Uberman.Boot = function (game) {

};

Uberman.Boot.prototype = {

  preload: function () {

  },

  create: function () {

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    this.game.scale.refresh();

    this.game.stage.backgroundColor = '#000';
    this.game.world.setBounds(0, 0, 4267, 8192);

    this.game.state.start("Preloader");

  },

  update: function () {

  },
  render: function () {

  }

};

module.exports = Uberman.Boot;
},{}],2:[function(require,module,exports){
var Uberman = Uberman || {};

var Hero = require('./prefabs/Hero');
var Pedestrian = require('./prefabs/Pedestrian');
var DayCycle = require('./prefabs/DayCycle');
var Car = require('./prefabs/Car');
var Hud = require('./prefabs/Hud');


Uberman.Game = function (game) {


};

Uberman.Game.prototype = {

  preload: function () {

    this.cars_sprites_array = ['car', 'car2'];
    this.numcars = 10;
    this.numpredestrians = 50;
    this.game.dayLength = 60000 * 5;

  },

  randomChoice: function (choices) {

    var index = Math.floor(Math.random() * choices.length);
    return choices[index];

  },
  addGradientBackground: function () {
    var bgBitMap = this.game.add.bitmapData(this.game.world.width, this.game.world.height);

    var myBitmap = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
    var grd = myBitmap.context.createLinearGradient(0, 0, 0, this.game.world.height);

    grd.addColorStop(0, "black");
    grd.addColorStop(1, "#85b5e1");

    myBitmap.context.fillStyle = grd;
    myBitmap.context.fillRect(0, 0, this.game.world.width, this.game.world.height);

    grd = myBitmap.context.createLinearGradient(0, 580, 0, this.game.world.height);

    grd.addColorStop(0, "black");
    grd.addColorStop(1, "#85b5e1");

    myBitmap.context.fillStyle = grd;
    myBitmap.context.fillRect(0, this.game.world.height, this.game.world.width, 20);

    return this.game.add.sprite(0, 0, myBitmap);
  },
  addBackgroundSprites: function () {

    this.sunSprite = this.game.add.sprite(this.game.world.width - (this.game.world.width / 2), this.game.world.height / 2, 'sun');

    this.moonSprite = this.game.add.sprite(this.game.world.width - (this.game.world.width / 2), this.game.world.height, 'moon');

    this.orbit = this.game.add.sprite(this.game.world.centerX - (4267 / 2), 1835, 'orbit');

    this.game.fade = this.game.add.sprite(this.game.world.centerX - (4267 / 2), this.game.world.height - 2000, 'city_fade');

    this.game.back = this.game.add.sprite(this.game.world.centerX - (4267 / 2), this.game.world.height - 2100, 'city_background');

    this.fore = this.game.add.sprite(this.game.world.centerX - (4267 / 2), this.game.world.height - 2133, 'city_foreground');

  },
  animateDayNight: function (backgroundSprite) {

    var backgroundSprites = [
      {
        sprite: backgroundSprite,
        from: 0x1f2a27,
        to: 0xB2DDC8
      },
      {
        sprite: this.game.fade,
        from: 0x1f2a27,
        to: 0xB2DDC8
      },
      {
        sprite: this.game.back,
        from: 0x1f2a27,
        to: 0xB2DDC8
      },
      {
        sprite: this.fore,
        from: 0x2f403b,
        to: 0x96CCBB
      }
    ];

    var dayCycle = new DayCycle(this.game, this.game.dayLength);

    dayCycle.initShading(backgroundSprites);

    dayCycle.initSun(this.sunSprite);

    dayCycle.initMoon(this.moonSprite);

  },
  addGround: function () {

    platforms = this.game.add.group();

    platforms.enableBody = true;

    var ground = platforms.create(0, this.game.world.height - 209, 'ground');

    ground.scale.setTo(2, 2);

    this.game.physics.enable(ground);

    ground.body.immovable = true;

  },
  addVehicles: function () {

    this.cars = this.game.add.group();

    for (var i = 0; i < this.numcars; i++) {

      var left_car = this.randomChoice(this.cars_sprites_array);

      var right_car = this.randomChoice(this.cars_sprites_array);

      var car_pos_dict_array = [{
          "LEFT": {
            x: this.game.world.width + 270,
            y: this.game.world.height - 120,
            car: left_car
          }
        },
        {
          "RIGHT":
          {
            x: this.game.world.x - 300,
            y: this.game.world.height - 180,
            car: right_car
          }
        }
      ];

      var cars_array = this.randomChoice(car_pos_dict_array);

      for (var item in cars_array) {

        if (cars_array.hasOwnProperty(item)) {

          var car = new Car(this.game, cars_array[item].x, cars_array[item].y, cars_array[item].car, item);
          this.cars.add(car);

        }
      }

    }

    this.cars.children = this.cars.children.sort(function (a, b) {

      return (b.direction > a.direction) ? 1 : ((a.direction > b.direction) ? -1 : 0);

    });

    for (var grp_car in this.cars.children) {

      if (this.cars.hasOwnProperty(grp_car)) {

        this.game.add.existing(grp_car);

      }

    }


  },
  create: function () {

    console.log("GAME");

    var backgroundSprite = this.addGradientBackground();

    this.addGround();

    this.addBackgroundSprites();

    this.animateDayNight(backgroundSprite);

    this.game.door = this.game.add.sprite(3785, 7942, 'door');

    this.game.physics.arcade.enable(this.game.door);

    this.game.door.anchor.setTo(0.5, 0.5);

    this.game.player = new Hero(this.game, this.game.world.centerX, this.game.world.height - 260, this.game.world.height / 2);


    var pedestrians = this.game.add.group();
    for (var i = 0; i < this.numpredestrians; i++) {
      var pedestrian = new Pedestrian(this.game, this.game.world.height - 260, "pedestrian");
      pedestrian.tint = Math.random() * 0xffffff;
      this.game.add.existing(pedestrian);
      pedestrians.add(pedestrian);
    }

    this.game.add.existing(this.game.player);

    this.addVehicles();

    this.game.hud = new Hud(this.game);

    this.game.add.existing(this.game.hud);

    cursors = this.game.input.keyboard.createCursorKeys();

  },

  update: function () {

    this.game.physics.arcade.collide(this.game.player, platforms);

  },
  render: function () {

  }

};

module.exports = Uberman.Game;
},{"./prefabs/Car":6,"./prefabs/DayCycle":7,"./prefabs/Hero":8,"./prefabs/Hud":9,"./prefabs/Pedestrian":10}],3:[function(require,module,exports){
var Uberman = Uberman || {};


Uberman.MainMenu = function (Uberman) {

};

Uberman.MainMenu.prototype = {


  preload: function () {



  },
  gofull: function() {

    this.game.scale.startFullScreen(false);

},

  create: function () {
    console.log("MAINMENU");

    var message = ["Uberman!"];
    message.push("Start");
    message.push("Continue");
    message.push("Full Screen");

    var title = this.game.add.bitmapText((this.game.width/2), this.game.height/2-200, 'font',message[0],48);
    title.anchor.set(0.5, 0.5);


    var menu_item = this.game.add.bitmapText((this.game.width/2), this.game.height/2-100, 'font',message[1],38);
    menu_item.anchor.set(0.5, 0.5);

    var tween = this.game.add.tween(menu_item.scale).to( { x: 1.1, y:1.1 }, 350, Phaser.Easing.Linear.InOut, true, -1, -1, true).loop(true);
    menu_item.inputEnabled = true;

    var menu_item2 = this.game.add.bitmapText((this.game.width/2), this.game.height/2, 'font',message[3],38);
    menu_item2.anchor.set(0.5, 0.5);
    menu_item2.inputEnabled = true;
    menu_item2.events.onInputUp.add(this.gofull, this);

    var that = this;
    menu_item.events.onInputUp.add(function () {

      that.game.add.tween(menu_item.scale).to( { x:0.8, y:0.8 }, 350, Phaser.Easing.Circular.In, true);

      var tween = that.game.add.tween(menu_item).to( { y: -100 }, 350, Phaser.Easing.Circular.In, true);

      tween.onComplete.add(function(){

        that.game.state.start("Game");

      });

    });
    menu_item.events.onInputOver.add(function () {

      console.log("Hover");

    });
  },


  update: function () {


  },

  render: function () {

  }

};

module.exports = Uberman.MainMenu;
},{}],4:[function(require,module,exports){
var Uberman = Uberman || {};


Uberman.Preloader = function (Uberman) {

};

Uberman.Preloader.prototype = {


  preload: function () {

    this.game.load.bitmapFont('digits', 'font/digits.png', 'font/digits.xml');
    this.game.load.bitmapFont('font', 'font/font.png', 'font/font.xml');
    this.game.load.bitmapFont('smallfont', 'font/small_font.png', 'font/small_font.xml');

    //this.game.load.image('platform', 'sprites/platform.png');
    this.game.load.image('door', 'images/door.gif', 70, 80);
    this.game.load.image('orbit', 'images/orbit.png', 4267, 894);
    this.game.load.image('ground', 'images/ground.gif', 4267, 10);
    this.game.load.image('city_foreground', 'images/city_foreground.gif', 4267, 2133);
    this.game.load.image('city_background', 'images/city_background.gif', 4267, 2133);
    this.game.load.image('city_fade', 'images/city_fade_background.gif', 4267, 2133);
    this.game.load.image('cape_streak', 'images/cape_streak.png');
    this.game.load.image('sun', 'images/sun.png');
    this.game.load.image('moon', 'images/moon.png');
    this.game.load.spritesheet('hero', 'images/uber_sprite.gif', 55, 110, 28);
    this.game.load.spritesheet('pedestrian', 'images/pedestrians.gif', 55, 110, 67);
    this.game.load.image('car', 'images/car.gif', 300, 95);
    this.game.load.image('car2', 'images/car2.gif', 270, 81);
    this.game.load.image('uber_disk', 'images/UBER_DISK.png', 138,138);
    this.game.load.image('alter_disk', 'images/ALTER_DISK.png', 138,138);

  },


  create: function () {
    console.log("PRELOADER");
    this.game.state.start("Game");
    //this.game.state.start("MainMenu");


  },


  update: function () {


  },

  render: function () {

  }

};

module.exports = Uberman.Preloader;
},{}],5:[function(require,module,exports){
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
var Uberman = Uberman || {};
Boot = require("./Boot");
Preloader = require("./Preloader");
MainMenu = require("./MainMenu");
Game = require("./Game");



var size = {
  width:window.innerWidth,
  height:window.innerHeight
};


(function (size) {
  // initialize the framework

  var game = new Phaser.Game(size.width, size.height, Phaser.AUTO, '');





  // add game states
  game.state.add('Boot', Boot);
  game.state.add('Preloader', Preloader);
  game.state.add('MainMenu', MainMenu);
  game.state.add('Game', Game);
  // start the Boot state
  game.state.start('Boot');

})(size);

},{"./Boot":1,"./Game":2,"./MainMenu":3,"./Preloader":4}],6:[function(require,module,exports){
Car = function (game, x, y, frame, direction) {
  Phaser.Sprite.call(this, game, x, y, frame, 0);
  this.direction = direction;
  this.game.physics.enable(this, Phaser.Physics.ARCADE);


  this.car_tween = this.game.add.tween(this);
  this.driveby = this.game.add.audio('driveby');
  this.start();
  //this.game.sound.setDecodedCallback([ this.driveby ], this.start, this);
this.loaded = false;







};

Car.prototype = Object.create(Phaser.Sprite.prototype);

Car.prototype.constructor = Car;

Car.prototype.start = function () {
  var goal;

  if(this.direction=="LEFT"){
    goal = this.game.world.x-this.width;
    this.scale.x = -1;
  }else{
    goal = this.game.world.width+this.width;
    this.scale.x = 1;
  }
  this.car_tween.to({ x: goal}, this.game.rnd.integerInRange(5000,7000)).loop(true);

  this.car_tween.delay(this.game.rnd.integerInRange(100,10000));

  this.car_tween.start();
  this.loaded = true;
};

Car.prototype.update = function () {
  if(this.loaded){
    //if(this.x-this.width > this.game.camera.x && this.x < this.game.camera.x + this.game.camera.width - this.width){
    //  this.driveby.play();
    //}
  }

};




module.exports = Car;
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
Hero = function (game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'hero', frame);

  this.originHeight = this.game.world.height;
  this.isZooming = false;
  // initialize your prefab here
  this.frame = 0;
  this.currentState = "uber";
  this.isClicked = false;
  this.sprite_message = "";
  this.pointerHover = false;
  //this.dummy = this.game.add.sprite(0, 0);
  this.inputEnabled = true;
  this.events.onInputDown.add(this.onSpriteClick, this);
  this.events.onInputOver.add(this.onSpriteHover, this);
  this.events.onInputOut.add(this.onSpriteBlur, this);

  this.zoom_in_on = [];

  this.followedObject = this.body;

  this.game.physics.arcade.enable(this);
  this.directions = ["LEFT", "UP_LEFT", "UP", "UP_RIGHT", "RIGHT", "DOWN_RIGHT", "DOWN", "DOWN_LEFT"];
  this.alter_walk = this.animations.add("alter_up", [5], 6, false);
  this.alter_walk = this.animations.add("alter_fall", [5, 6, 7, 8, 9, 10], 6, false);
  this.alter_walk = this.animations.add("alter_walk", [5, 6, 7, 8, 9, 10], 6, false);
  this.alter_walk = this.animations.add("alter_stand", [5], 6, false);
  this.alter_walk = this.animations.add("uber_stand", [0], 6, false);
  this.alter_walk = this.animations.add("uber_walk", [17, 18, 19, 20, 21, 22], 6, false);

  this.alter_walk = this.animations.add("fly_get_ready", [23], 1, true);
  this.alter_walk = this.animations.add("fly_side", [3, 4], 6, false);
  this.alter_walk = this.animations.add("fly_side_up", [11, 12], 6, true);
  this.alter_walk = this.animations.add("fly_side_down", [13, 14], 6, true);
  this.alter_walk = this.animations.add("fly_hover", [1, 2], 6, true);
  this.alter_walk = this.animations.add("fly_up", [15, 16], 6, true);
  this.alter_walk = this.animations.add("fly_down", [15, 16], 6, true);
  this.alter_walk = this.animations.add("fly_up_diagonal", [3, 4], 6, true);
  this.alter_walk = this.animations.add("fly_down_diagonal", [3, 4], 6, true);

  this.body.gravity.y = 300;
  this.body.collideWorldBounds = true;
  this.body.fixedRotation = true;
  this.anchor.setTo(0.5, 0.5);


  this.game.camera.follow(this, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);


};

Hero.prototype = Object.create(Phaser.Sprite.prototype);

Hero.prototype.constructor = Hero;


Hero.prototype.spriteMessage = function (sprite, message) {


  if (!this.game.input.activePointer.isDown) {
    this.sprite_message = this.game.add.bitmapText(sprite.x - sprite.body.width * 2, sprite.y - sprite.body.height / 2, 'smallfont', message, 18);

    var tween = this.game.add.tween(this.sprite_message).to({y: (sprite.y - sprite.body.height / 2) - 10}, 200, "Linear", true, -1, -1, true).loop(true);

  }


};

Hero.prototype.onSpriteHover = function (sprite, pointer) {
  this.pointerHover = true;
  if (!this.checkOverlap(this, this.game.door)) {
    var message;
    if (this.currentState == "uber") {
      message = "[click] Change into Secret Identity!";
    } else {
      message = "[click] Change into Uberman!";
    }

    if (this.body.touching.down) {
      this.spriteMessage(this, message);
    }
  } else {
    this.onDoorHover();
  }


};

Hero.prototype.onSpriteBlur = function (sprite, pointer) {
  if (this.sprite_message) {
    this.sprite_message.destroy();

  }
  this.pointerHover = false;


};
Hero.prototype.onDoorClick = function (door) {
  console.log("DOOR CLICKED");

  this.zoom_in_on = [door.x, door.y];
  this.followedObject = door;
};
Hero.prototype.onDoorHover = function () {

  var message;
  if (this.currentState == "uber") {
    message = "[click] Change before entering!";
  } else {
    message = "[click] Enter Daily Planet!";

  }


  this.spriteMessage(this.game.door, message);

};
Hero.prototype.onDoorBlur = function () {

};
Hero.prototype.switch_char = function (sprite) {
  if (sprite.body.touching.down) {
    console.log("ON GROUND");
    if (sprite.currentState == "uber") {
      console.log("GOING CLARK");
      sprite.currentState = "alter";
      sprite.angle = 0;
      sprite.animations.play("alter_stand");

    } else {
      console.log("GOING UBER");
      sprite.currentState = "uber";
      sprite.animations.play("uber_stand");
    }
  }
};
Hero.prototype.onSpriteClick = function (sprite, pointer) {

  if (this.sprite_message) {
    this.sprite_message.destroy();
  }

  if (!this.checkOverlap(this, this.game.door)) {


    this.switch_char(sprite);
  } else if (this.currentState != "uber" && this.checkOverlap(this, this.game.door)) {
    this.onDoorClick(this.game.door);
  } else {
    console.log("SWITCHING");
    this.switch_char(sprite);
  }


};
Hero.prototype.checkOverlap = function (spriteA, spriteB) {
  var boundsA = spriteA.getBounds();
  var boundsB = spriteB.getBounds();

  return Phaser.Rectangle.intersects(boundsA, boundsB);
};
Hero.prototype.onSpriteRelease = function (sprite, pointer) {
  this.isClicked = false;
};
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
    this.game.back.x -= this.body.velocity.x * (0.001);

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


  this.game.back.x -= this.body.velocity.x * (0.001);
  this.game.fade.x -= this.body.velocity.x * (0.0005);
  if (!onGround) {
    this.game.back.y -= this.body.velocity.y * (0.001);
    this.game.fade.y -= this.body.velocity.y * (0.0005);
  }


  this.scale.y = 1;

  switch (direction) {


    case "UP":
      this.angle = 0;

      if (!onGround) {
        this.animations.play("fly_up");
      } else {
        this.animations.play("uber_stand");
        //this.animations.currentAnim.onComplete.add(function () {	this.animations.play("fly_up");}, this);

      }


      break;
    case "DOWN":
      this.angle = 0;
      this.scale.y = -1;

      if (!onGround) {
        if (this.y > this.game.world.height - 1200) {


          if (this.animations.currentAnim.name == "fly_down") {

            this.animations.play("fly_get_ready");
            this.events.onAnimationComplete.add(function () {

              this.scale.y = 1;
              this.animations.play("fly_hover");
            }, this);


          } else {
            this.scale.y = 1;
            this.animations.play("fly_hover");
          }


        } else {
          this.animations.play("fly_down");
        }
      } else {
        this.scale.y = 1;
        this.animations.play("uber_stand");
      }


      break;
    case "UP_LEFT":

      this.scale.x = -1;
      if (!onGround) {
        this.angle = -45;
        this.animations.play("fly_side_up");
      } else {
        this.animations.play("uber_stand");
        //this.animations.currentAnim.onComplete.add(function () {
        //  this.angle = -45;
        //  this.animations.play("fly_up_diagonal");
        //}, this);
      }


      break;
    case "UP_RIGHT":
      this.scale.x = 1;

      if (!onGround) {
        this.angle = 45;
        this.animations.play("fly_side_up");
      } else {
        this.animations.play("take_off");
        //this.animations.currentAnim.onComplete.add(function () {
        //  this.angle = 45;
        //  this.animations.play("fly_up_diagonal");
        //}, this);
      }

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
        this.animations.play("fly_side_down");
      } else {

        this.angle = 0;
        this.animations.play("uber_walk");
      }

      break;
    case "DOWN_LEFT":
      this.scale.x = -1;
      if (!onGround) {
        this.angle = -135;
        this.animations.play("fly_side_down");
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


Hero.prototype.update = function () {

  var onGround = this.body.touching.down;
  var direction;
  if (!this.isZooming) {


    if (this.game.input.activePointer.isDown) {
      if (!this.pointerHover) {

        if (this.currentState == "uber") {
          this.uber_movement(onGround);
        } else {
          this.alter_movement(onGround);
        }
      } else {

        this.pointerHover = false;
      }

    }

    if (!this.game.input.activePointer.isDown) {
      this.angle = 0;
      this.body.velocity.set(0);
      direction = null;

      if (this.currentState == "uber") {
        this.scale.y = 1;
        this.animations.play("fly_hover");
        if (onGround) {
          this.animations.play("uber_stand");
        }
      } else {
        this.animations.stop();
      }

    }
  }


  //console.log(this.originHeight, this.y);
};


Hero.prototype.render = function () {
  this.game.debug.text(direction || "--", 2, 14, '#0f0');
};


module.exports = Hero;
},{}],9:[function(require,module,exports){

HUD = function (game,  x, y) {
  // the bar itself
  this.player = game.player;
  this.bar = game.add.bitmapData(128, 20);
  Phaser.Sprite.call(this, game, 0, 0, this.bar);
  this.fixedToCamera = true;
  this.cameraOffset.setTo(162, 100);
  this.damage = 0;

  var clock = this.game.add.bitmapText(this.game.width/2, 100, 'digits', "", 62);

  clock.anchor.setTo(0.5, 0.5);
  clock.fixedToCamera = true;
  clock.align = "center";
  console.log(clock);
  var timeValue = {};
  timeValue.time = 0;
  this.timeTween = this.game.add.tween(timeValue).to({time:  this.game.dayLength}, this.game.dayLength);

  this.timeTween.onUpdateCallback(function() {


    clock.text = ((parseInt(timeValue.time / 1000 / 60 )%12)===0?12:(parseInt(timeValue.time / 1000 / 60 )%12)) + ":" + parseInt(timeValue.time / 1000 % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
  });
  this.timeTween.start();
  //this.clockTween.onComplete.add(this.sunset, this);

  //this.clock.bringToTop();

  this.uber_disk = this.game.add.sprite(0,0, 'uber_disk');
  this.uber_disk.anchor.setTo(0.5, 0.5);
  this.uber_disk.fixedToCamera = true;
  this.uber_disk.cameraOffset.setTo(89, 89);
  this.alter_disk = this.game.add.sprite(0,0, 'alter_disk');
  this.alter_disk.anchor.setTo(0.5, 0.5);
  this.alter_disk.fixedToCamera = true;
  this.alter_disk.cameraOffset.setTo(89,89);


  // just a property we can tween so the bar has a progress to show
  this.barProgress = 128;


};

HUD.prototype = Object.create(Phaser.Sprite.prototype);
HUD.prototype.constructor = HUD;

HUD.prototype.preload = function () {
  this.game.time.advancedTiming = true;
};

HUD.prototype.switchState = function() {
  if (this.player.currentState == "uber") {
    //console.log("SCALE:", this.uber_disk.scale, this.uber_disk.alpha, this.uber_disk.x);
    //this.game.add.tween(this.alter_disk).to({alpha:0}, 100, Phaser.Easing.Bounce.InOut, true);
    this.game.add.tween(this.alter_disk.scale).to({x:0, y:0}, 30, Phaser.Easing.Bounce.InOut, true);
    //this.game.add.tween(this.uber_disk).to({alpha:1}, 100, Phaser.Easing.Bounce.InOut, true);
    this.game.add.tween(this.uber_disk.scale).to({x:1, y:1}, 30, Phaser.Easing.Bounce.InOut, true);
    this.uber_disk.bringToTop();

  }
  if (this.player.currentState == "alter") {
    //this.game.add.tween(this.uber_disk).to({alpha:0}, 100, Phaser.Easing.Bounce.InOut, true);
    this.game.add.tween(this.uber_disk.scale).to({x:0, y:0}, 30, Phaser.Easing.Bounce.InOut, true);
    //this.game.add.tween(this.alter_disk).to({alpha:1}, 100, Phaser.Easing.Bounce.InOut, true);
    this.game.add.tween(this.alter_disk.scale).to({x:1, y:1}, 30, Phaser.Easing.Bounce.InOut, true);
    this.alter_disk.bringToTop();
  }
};



HUD.prototype.animateDamage = function() {
  if(this.damage > 0){
    this.game.add.tween(this).to({barProgress:this.barProgress-this.damage}, 200, "Linear", true);
    this.damage = 0;
  }

};
HUD.prototype.update = function() {
  this.switchState();




  // ensure you clear the context each time you update it or the bar will draw on top of itself
  this.bar.context.clearRect(0, 0, this.bar.width, this.bar.height);

  // some simple colour changing to make it look like a health bar
  if (this.barProgress < 32) {
    this.bar.context.fillStyle = '#f00';
  }
  else if (this.barProgress < 64) {
    this.bar.context.fillStyle = '#ff0';
  }
  else {
    this.bar.context.fillStyle = '#0f0';
  }

  // draw the bar
  this.bar.context.fillRect(0, 0, this.barProgress, 20);

  // important - without this line, the context will never be updated on the GPU when using webGL
  this.bar.dirty = true;
  this.animateDamage();
};

module.exports = HUD;
},{}],10:[function(require,module,exports){

Pedestrian = function (game, y, sprite) {
  Phaser.Sprite.call(this, game, game.rnd.integerInRange(-200, game.world.width+200), y, sprite, 0);

  this.anchor.setTo(0.5, 0.5);
  this.goal = game.world.centerX;
  //this.goal = this.setGoal();
  this.isMoving = false;
  this.frame = 0;
  this.frames = [];
  this.pedestrian_array = ["oldman-wait","businessman-wait", "delivery-wait","boy-wait", "slick-wait", "hapgood-wait", "foreign-wait"];
  this.visible = true;
  this.thoughts = {
    "needs": [
      {
        "maslow": [
          {
            "need": "WATER",
            "weight": 2.4,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 2.4,
            "emotion": "I'm THIRSTY",
            "goal":677,
            "acts":[
              this.removePedestrian,
              this.putBack
            ]
          },
          {
            "need": "FOOD",
            "weight": 2.1,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 2.1,
            "emotion": "I'm HUNGRY",
            "goal":776,
            "acts":[
              this.removePedestrian,
              this.putBack
            ]
          }
        ], "totalWeight": 4.5
      },
      {
        "maslow": [
          {
            "need": "SECURITY",
            "weight": 1.09,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 1.09,
            "emotion": "I'm SCARED",
            "goal":1700,
            "acts":[
              this.removePedestrian,
              this.putBack
            ]
          },
          {
            "need": "MONEY",
            "weight": 1.08,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 1.08,
            "emotion": "I'm BROKE",
            "goal":2300,
            "acts":[
              this.removePedestrian,
              this.putBack
            ]
          },
          {
            "need": "WARMTH",
            "weight": 1.07,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 1.07,
            "emotion": "I'm COLD",
            "goal":250,
            "acts":[
              this.removePedestrian,
              this.putBack
            ]
          }
        ],
        "totalWeight": 4.4
      },
      {
        "maslow": [
          {
            "need": "FRIENDSHIP",
            "weight": 1.06,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 1.06,
            "emotion": "No one LIKES ME",
            "goal":90,
            "acts":[
              this.removePedestrian,
              this.putBack
            ]
          },
          {
            "need": "INTIMACY",
            "weight": 1.05,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 1.05,
            "emotion": "I'm LONELY",
            "goal":1200,
            "acts":[
              this.removePedestrian,
              this.putBack
            ]
          },
          {
            "need": "FAMILY",
            "weight": 1.04,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 1.04,
            "emotion": "I have no SUPPORT",
            "goal":900,
            "acts":[
              this.removePedestrian,
              this.putBack
            ]
          }
        ], "totalWeight": 2.5
      },
      {
        "maslow": [
          {
            "need": "CONFIDENCE",
            "weight": 1.03,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 1.03,
            "emotion": "I'm WEAK",
            "goal":200,
            "acts":[
              this.removePedestrian,
              this.putBack
            ]
          }
        ], "totalWeight": 1.03
      },
      {
        "maslow": [
          {
            "need": "ART",
            "weight": 1.02,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 1.02,
            "emotion": "I'm un-CREATIVE",
            "goal":1500,
            "acts":[
              this.removePedestrian,
              this.putBack
            ]
          },
          {
            "need": "EDUCATION",
            "weight": 1.01,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 1.01,
            "emotion": "I'm not SMART",
            "goal":2000,
            "acts":[
              this.removePedestrian,
              this.putBack
            ]
          }
        ], "totalWeight": 1.03
      }
    ]

  };

  this.direction = this.setDirection();
  this.sprite_message = "";

  this.animations.add("oldman-wait", [14], 6, true);
  this.animations.add("oldman-walk", [0, 1, 2, 3, 4, 5], 6, true);
  this.animations.add("businessman-walk", [6, 7, 8, 9], 6, true);
  this.animations.add("businessman-wait", [10, 11, 12, 13], 6, true);
  this.animations.add("delivery-wait", [21], 6, true);
  this.animations.add("delivery-walk", [15,16,17,18,19,20], 6, true);
  this.animations.add("boy-walk", [22, 23, 24, 25, 26, 27], 6, true);
  this.animations.add("boy-wait", [28], 6, true);
  this.animations.add("slick-walk", [29, 30, 31, 32, 33, 34,35,36,37], 9, true);
  this.animations.add("slick-wait", [38], 6, true);
  this.animations.add("hapgood-walk", [39, 40, 41, 42, 43, 44,45,46,47, 48, 49, 50], 12, true);
  this.animations.add("hapgood-wait", [51,52,53,54], 6, true);

  this.animations.add("foreign-walk", [55,56,57,58,59,60], 6, true);
  this.animations.add("foreign-wait", [61], 6, true);



  this.anim = this.randomChoice(this.pedestrian_array);

  this.check_animation();
  this.movement();




};

Pedestrian.prototype = Object.create(Phaser.Sprite.prototype);

Pedestrian.prototype.constructor = Pedestrian;







Pedestrian.prototype.spriteMessage = function (sprite, message) {

  console.log("DONE");



};

Pedestrian.prototype.removePedestrian = function (next, sprite) {


console.log("CURRENTLY EATING");
  sprite.visible = false;
  sprite.thoughts.needs[0].maslow[0].value = 0;
  next();


};

Pedestrian.prototype.putBack = function () {





};

Pedestrian.prototype.onSpriteHover = function (sprite, pointer) {




};

Pedestrian.prototype.getWeight= function (x,y,i) {
  return ( (y*(i+1)-y*(i))/(x*(i+1)-x*(i)) - (y*(i)-y*(i-1))/(x*(i)-x*(i-1))/(x*(i+1)-x*(i-1)));
};

Pedestrian.prototype.getRandomRange= function (low, high) {
return this.game.rnd.integerInRange(low, high);
};
Pedestrian.prototype.life = function () {
  //console.log(this.hunger);




  for ( var i = 0; i < this.thoughts.needs.length; i++)
  {
    var needs = this.thoughts.needs[i];

    for(var j = 0; j< needs.maslow.length;j++){

      //TODO: adjust calculation of 0.0032 to reflaect maslow hierarchy

        this.thoughts.needs[i].maslow[j].value += 0.01;
        this.thoughts.needs[i].maslow[j].weight = this.getWeight(this.thoughts.needs[i].maslow[j].baseWeight,this.thoughts.needs[i].maslow[j].value,i);


      
      //console.log(needs.maslow[j].need, this.thoughts.needs[i].maslow[j].weight);
    }


  }
  
  //this.goal = this.thoughts.needs[0].maslow[0].goal;

};

Pedestrian.prototype.sortThoughts = function() {
  for (var i = 0; i < this.thoughts.needs.length; i++) {
    var total = 0;
    for (var k = 0; k < this.thoughts.needs[i].maslow.length; k++) {
      total += this.thoughts.needs[i].maslow[k].weight;
    }
    this.thoughts.needs[i].totalWeight = total;
    //console.log("TOTAL:",this.thoughts.needs[i].totalWeight);

    this.thoughts.needs[i].maslow.sort(function (a, b) {
      return b.weight - a.weight;
    });
    this.thoughts.needs.sort(function (a, b) {
      return b.totalWeight - a.totalWeight;
    });

  }

  //this.thoughts.needs[0].maslow[0].value = 100;
  //console.log(this.thoughts.needs[0].maslow[0].emotion);
};

Pedestrian.prototype.setGoal = function () {

  this.sortThoughts();
  return this.thoughts.needs[0].maslow[0].goal;
  //var startXArray = this.randomChoice([[0, this.x+1000], [0, this.x-1000]]);
  //  var start = this.getRandomRange(startXArray[0], startXArray[1]);
  //  return this.getRandomRange(start, this.game.world.width-20);

  };

Pedestrian.prototype.setDirection = function () {

  if(this.goal < this.x){
    return "LEFT";
  }else{
    return "RIGHT";
  }


};
Pedestrian.prototype.randomChoice=function(choices){
  var index =  Math.floor(Math.random() * choices.length);
  return choices[index];
};


Pedestrian.prototype.getSpeed = function(speed, vary) {
  var return_speed = speed + this.game.rnd.integerInRange(100, vary);
  return (Math.round((Phaser.Math.distance(this.x, this.y, this.goal, this.y) / return_speed) * 1000000));
};
Pedestrian.prototype.brain = function() {


  switch (this.anim) {
    case "delivery-walk":
      this.speed = this.getSpeed(15000, 5000);
      this.isMoving = true;
      break;
    case "delivery-wait":
      this.speed = 0;
      this.isMoving = false;
      break;
    case "businessman-walk":
      this.speed = this.getSpeed(20000, 2000);
      this.isMoving = true;
      break;
    case "businessman-wait":
      this.speed = 0;
      this.isMoving = false;
      break;
    case "oldman-walk":
      this.speed = this.getSpeed(40000, 5000);
      this.isMoving = true;
      break;
    case "oldman-wait":
      this.speed = 0;
      this.isMoving = false;
      break;
    case "boy-walk":
      this.speed = this.getSpeed(15000, 5000);
      this.isMoving = true;
      break;
    case "boy-wait":
      this.speed = 0;
      this.isMoving = false;
      break;
    case "slick-walk":
      this.speed = this.getSpeed(50000, 5000);
      this.isMoving = true;
      break;
    case "slick-wait":
      this.speed = 0;
      this.isMoving = false;
      break;
    case "hapgood-walk":
      this.speed = this.getSpeed(70000, 5000);
      this.isMoving = true;
      break;
    case "hapgood-wait":
      this.speed = 0;
      this.isMoving = false;
      break;
    case "foreign-walk":
      this.speed = this.getSpeed(20000, 5000);
      this.isMoving = true;
      break;
    case "foreign-wait":
      this.speed = 0;
      this.isMoving = false;
      break;
  }

};
Pedestrian.prototype.check_animation = function() {
  this.move_tween = this.game.add.tween(this);
  var delay = this.game.rnd.integerInRange(1000, 6000);
  this.brain();



  if(this.isMoving){
    this.move_tween.to({ x: this.goal}, this.speed).delay(delay);
  }



  this.move_tween.start();
  this.move_tween.onStart.add(function(){
      this.isMoving = this.anim.indexOf("-walk") === true;
    this.movement();},
    this);

  this.move_tween.onComplete.add(function(){
      this.anim = this.anim.replace("-walk", "-wait");
      this.movement();
      this.thoughts.needs[0].maslow[0].acts[0](this.thoughts.needs[0].maslow[0].acts[1], this);
    },
    this);


};


Pedestrian.prototype.movement = function () {


  this.animations.play(this.anim);


  if(this.direction=="LEFT"){
    this.scale.x = -1;
  }else{
    this.scale.x = 1;
  }

  this.loaded = true;

};




Pedestrian.prototype.update = function () {
  if(this.visible){
    this.life();
    if(this.x == this.goal){

      if(this.anim.indexOf("-wait") === -1){
        this.isMoving = false;
        this.anim = this.anim.replace("-walk", "-wait");
        this.check_animation();
      }

    }







    if(this.animations.currentAnim.name.indexOf("-walk") === -1 && this.isMoving !== true){


      this.anim = this.anim.replace("-wait", "-walk");

      this.goal = this.setGoal();
      this.direction = this.setDirection();
      this.check_animation();
      //console.log(this.anim, "CHANGED GOAL");

    }
  }else{
    this.thoughts.needs[0].maslow[0].value -= 0.01;
    if(this.thoughts.needs[0].maslow[0].value <= 0){
      this.thoughts.needs[0].maslow[0].value = 0;
      this.visible = true;
      console.log("GOAL COMPLETED");
      //console.log(this.thoughts);
    }
  }


};



module.exports = Pedestrian;

},{}]},{},[5]);

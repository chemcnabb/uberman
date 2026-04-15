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
var City = require('./prefabs/City');
var Economy = require('./sim/Economy');


Uberman.Game = function (game) {


};

Uberman.Game.prototype = {

  preload: function () {

    this.cars_sprites_array = ['car', 'car2'];
    this.numcars = 10;
    this.numpredestrians = 10;
    this.game.dayLength = 60000 * 5;
    this.game.development = true;
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
    this.game.back = this.game.add.sprite(this.game.world.centerX - (4267 / 2), this.game.world.height - 2100, 'city_background');
    this.game.fore = this.game.add.sprite(this.game.world.centerX - (4267 / 2), this.game.world.height - 2133, 'city_foreground');
    this.city = new City(this.game, 0,0);
    this.game.city = this.city;


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
        sprite: this.game.fore,
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

    this.game.player = new Hero(this.game, this.game.world.centerX, this.game.world.height - 260, this.game.world.height / 2);

    var backgroundSprite = this.addGradientBackground();

    this.addGround();

    this.addBackgroundSprites();

    this.animateDayNight(backgroundSprite);







    this.game.economy = new Economy(this.game);

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
    if (this.game.economy) {
      this.game.economy.update(this.game.time.elapsedMS || 16);
    }
    this.city.update();

  },
  render: function () {

  }

};

module.exports = Uberman.Game;
},{"./prefabs/Car":8,"./prefabs/City":9,"./prefabs/DayCycle":10,"./prefabs/Hero":11,"./prefabs/Hud":12,"./prefabs/Pedestrian":13,"./sim/Economy":14}],3:[function(require,module,exports){
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

    this.game.load.image('door', 'images/door.gif', 70, 80);
    this.game.load.image('orbit', 'images/orbit.png', 4267, 894);
    this.game.load.image('ground', 'images/ground.gif', 4267, 10);
    this.game.load.image('city_foreground', 'images/city_foreground.gif', 4267, 2133);
    this.game.load.image('city_background', 'images/city_background.gif', 4267, 2133);
    this.game.load.image('city_fade', 'images/city_fade_background.gif', 4267, 2133);

    this.loadBuildingSet([
      {id: 1, floor: {w: 428, h: 25}, ground: {w: 428, h: 98}, top: {w: 428, h: 34}},
      {id: 2, floor: {w: 273, h: 52}, ground: {w: 273, h: 41}, top: {w: 273, h: 78}},
      {id: 3, floor: {w: 301, h: 136}, ground: {w: 301, h: 50}, top: {w: 301, h: 111}},
      {id: 4, floor: {w: 501, h: 52}, ground: {w: 501, h: 85}, top: {w: 501, h: 166}}
    ]);

    this.game.load.image('bank', 'images/buildings/bank.gif', 288, 279);
    this.game.load.image('library', 'images/buildings/Library.gif', 596, 231);
    this.game.load.image('bakery', 'images/buildings/bakery.gif');
    this.game.load.image('cafe', 'images/buildings/cafe.gif');
    this.game.load.image('bookstore', 'images/buildings/bookstore.gif');

    this.game.load.image('cape_streak', 'images/cape_streak.png');
    this.game.load.image('sun', 'images/sun.png');
    this.game.load.image('moon', 'images/moon.png');
    this.game.load.spritesheet('hero', 'images/sprites/uber_sprite.png', 65, 111, 28);
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

  },

  loadBuildingSet: function (buildingParts) {
    for (var i = 0; i < buildingParts.length; i++) {
      var part = buildingParts[i];
      var basePath = 'images/buildings/';

      this.game.load.image('floor_' + part.id, basePath + 'building' + part.id + '_floor.gif', part.floor.w, part.floor.h);
      this.game.load.image('ground_' + part.id, basePath + 'building' + part.id + '_ground.gif', part.ground.w, part.ground.h);
      this.game.load.image('top_' + part.id, basePath + 'building' + part.id + '_top.gif', part.top.w, part.top.h);
    }
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
 * Updated to Phaser CE 2.19.0
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
module.exports={
  "tierOrder": [
    "physiological",
    "safety",
    "social",
    "esteem",
    "selfActualization"
  ],
  "tierUrgency": {
    "physiological": 1.8,
    "safety": 1.4,
    "social": 1.15,
    "esteem": 1.0,
    "selfActualization": 0.85
  },
  "clamp": {
    "min": 0,
    "max": 100
  },
  "weightCurve": {
    "baseline": 0.25,
    "deficitExponent": 1.35
  },
  "defaultCurve": {
    "decayPerTick": 0.08,
    "passiveRecoveryPerTick": 0.0,
    "recoveryOnResolve": 55
  },
  "needCurves": {
    "WATER": { "decayPerTick": 0.18, "passiveRecoveryPerTick": 0.01, "recoveryOnResolve": 82 },
    "FOOD": { "decayPerTick": 0.15, "passiveRecoveryPerTick": 0.01, "recoveryOnResolve": 78 },
    "SECURITY": { "decayPerTick": 0.1, "passiveRecoveryPerTick": 0.01, "recoveryOnResolve": 60 },
    "MONEY": { "decayPerTick": 0.12, "passiveRecoveryPerTick": 0.0, "recoveryOnResolve": 70 },
    "WARMTH": { "decayPerTick": 0.11, "passiveRecoveryPerTick": 0.01, "recoveryOnResolve": 62 },
    "FRIENDSHIP": { "decayPerTick": 0.09, "passiveRecoveryPerTick": 0.01, "recoveryOnResolve": 58 },
    "INTIMACY": { "decayPerTick": 0.08, "passiveRecoveryPerTick": 0.01, "recoveryOnResolve": 56 },
    "FAMILY": { "decayPerTick": 0.08, "passiveRecoveryPerTick": 0.01, "recoveryOnResolve": 56 },
    "CONFIDENCE": { "decayPerTick": 0.07, "passiveRecoveryPerTick": 0.01, "recoveryOnResolve": 54 },
    "ART": { "decayPerTick": 0.06, "passiveRecoveryPerTick": 0.01, "recoveryOnResolve": 52 },
    "EDUCATION": { "decayPerTick": 0.06, "passiveRecoveryPerTick": 0.01, "recoveryOnResolve": 52 }
  },
  "gating": {
    "lowerTierDeficitThreshold": 0.35,
    "unstableLowerTierMultiplier": 0.55,
    "stableLowerTierBoost": 0.65
  },
  "cooldown": {
    "lookbackTicks": 240,
    "graceTicks": 45,
    "penaltyPerRepeat": 0.35,
    "recentVisitBonusCount": 1,
    "historyLimit": 40
  }
}

},{}],7:[function(require,module,exports){
var NEED_BALANCING = require('../data/brainNeedBalancing.json');

BRAIN = function (game) {
  this.game = game;
  this.needBalancing = NEED_BALANCING;
  this.profile = this.generateProfile();
  this.thoughts = {
    "needs": [
      {
        "maslow": [
          {
            "need": "WATER",
            "weight": 2.4,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 2.4,
            "emotion": "Mouth is dry—need a drink before I keel over",
            "emotionLines": [
              "Mouth is dry—need a drink before I keel over",
              "Throat feels like sandpaper; I need something cold",
              "Every step kicks up more dust inside me—water, now",
              "I can taste the air—give me a cup to quiet this cough",
              "Craving something crisp to rinse the day out"
            ],
            "goal":677,
            "acts":[
              "cafe",
              "RETURN"
            ]
          },
          {
            "need": "FOOD",
            "weight": 2.1,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 2.1,
            "emotion": "Stomach is growling for something warm",
            "emotionLines": [
              "Stomach is growling for something warm",
              "Need a solid bite before I tip over",
              "Fantasizing about anything hearty and fresh",
              "Energy is fading—time to refuel with real food",
              "Craving a quick sit-down and a hot plate"
            ],
            "goal":776,
            "acts":[
              "bakery",
              "RETURN"
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
            "emotion": "Need a safe corner where I can breathe",
            "emotionLines": [
              "Need a safe corner where I can breathe",
              "Stomach knots up—I want somewhere steady",
              "Too exposed out here, I need a calm nook",
              "Heart is racing; I should tuck into someplace safe",
              "Looking for walls that feel like they have my back"
            ],
            "goal":1700,
            "acts":[
              "library",
              "RETURN"
            ]
          },
          {
            "need": "MONEY",
            "weight": 1.08,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 1.08,
            "emotion": "Wallet feels too light—time to earn",
            "emotionLines": [
              "Wallet feels too light—time to earn",
              "Funds are thin; better clock in and rebuild",
              "Bank account is sighing—need to stack some bills",
              "Too close to empty for comfort; payday mindset engaged",
              "I can almost hear my savings goal calling me back"
            ],
            "goal":2300,
            "acts":[
              "BANK",
              "RETURN"
            ]
          },
          {
            "need": "WARMTH",
            "weight": 1.07,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 1.07,
            "emotion": "Freezing up here, must find a warm spot",
            "emotionLines": [
              "Freezing up here, must find a warm spot",
              "Fingers are numb—need a heater and a mug",
              "This chill is sinking in; any cozy corner will do",
              "Shoulders are stiff; need someplace with steam or sun",
              "Dreaming of blankets and a hot drink"
            ],
            "goal":250,
            "acts":[
              "library",
              "RETURN"
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
            "emotion": "Craving some company, not just crowds",
            "emotionLines": [
              "Craving some company, not just crowds",
              "Need real chatter, not just passing faces",
              "Hoping to bump into someone warm and familiar",
              "Would love to hear a friendly voice right now",
              "Longing for a laugh with someone nearby"
            ],
            "goal":90,
            "acts":[
              "bank",
              "RETURN"
            ]
          },
          {
            "need": "INTIMACY",
            "weight": 1.05,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 1.05,
            "emotion": "Wish I had someone to share the walk with",
            "emotionLines": [
              "Wish I had someone to share the walk with",
              "Looking for a spark, not just a hello",
              "Want to lean on someone who leans back",
              "Missing closeness; even a quick moment would do",
              "My heart is wandering; maybe I can meet someone"
            ],
            "goal":1200,
            "acts":[
              "library",
              "RETURN"
            ]
          },
          {
            "need": "FAMILY",
            "weight": 1.04,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 1.04,
            "emotion": "Missing the comfort of my people",
            "emotionLines": [
              "Missing the comfort of my people",
              "Need familiar voices to steady me",
              "Hoping to feel rooted with someone who knows me",
              "Craving a reminder that I belong somewhere",
              "Would love to check in with the folks who get me"
            ],
            "goal":900,
            "acts":[
              "bank",
              "RETURN"
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
            "emotion": "Confidence is thin—I need a win",
            "emotionLines": [
              "Confidence is thin—I need a win",
              "Need a small victory to steady my stride",
              "Looking for proof I can handle today",
              "Feeling small; want to stand taller again",
              "A quick success would switch my mood around"
            ],
            "goal":200,
            "acts":[
              "library",
              "RETURN"
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
            "emotion": "I feel dull—need art to spark me",
            "emotionLines": [
              "I feel dull—need art to spark me",
              "My mind is gray; I want color and music",
              "Need a gallery of ideas to recharge",
              "Craving stories, paint, anything bright",
              "Would love to browse something beautiful"
            ],
            "goal":1500,
            "acts":[
              "bookstore",
              "RETURN"
            ]
          },
          {
            "need": "EDUCATION",
            "weight": 1.01,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 1.01,
            "emotion": "Brain fog. I should learn something new",
            "emotionLines": [
              "Brain fog. I should learn something new",
              "Mind feels slow—time for a fresh idea",
              "Need to stretch my head with something challenging",
              "Hungry for a fact or two to brighten my thinking",
              "Could use a good read to sharpen my focus"
            ],
            "goal":2000,
            "acts":[
              "LIBRARY",
              "RETURN"
            ]
          }
        ], "totalWeight": 1.03
      }
    ]

  };

  this.profile = this.generateProfile();
  this.profile.simTick = 0;
  this.profile.venueHistory = [];
  this.initializeNeedRuntimeData();


};

BRAIN.prototype = Object.create(Phaser.Sprite.prototype);
BRAIN.prototype.constructor = BRAIN;

BRAIN.prototype.createPersonality = function () {
  var archetypes = [
    {
      id: 'earnest',
      openers: ["Honestly,", "Note to self:", "For real,"],
      closers: ["gotta take this seriously.", "no excuses this time.", "focus up."],
      tempo: 'steady'
    },
    {
      id: 'chatty',
      openers: ["You know what?", "Oh!", "Fun fact:"],
      closers: ["let's make a moment of it.", "maybe I’ll talk someone’s ear off.", "I could share this with someone."],
      tempo: 'quick'
    },
    {
      id: 'dreamer',
      openers: ["Drifting along,", "Huh,", "Imagine this:"],
      closers: ["maybe I’ll find inspiration.", "let’s follow the vibe.", "could be a story in this."],
      tempo: 'calm'
    },
    {
      id: 'pragmatic',
      openers: ["Practical move:", "Plan:", "Next step:"],
      closers: ["keep it efficient.", "in and out.", "stick to the plan."],
      tempo: 'brisk'
    }
  ];
  return archetypes[this.getRandomRange(0, archetypes.length - 1)];
};

BRAIN.prototype.generateProfile = function () {
  var workplaces = ['bank', 'library', 'cafe', 'bakery', 'bookstore'];
  var shiftStart = this.getRandomRange(7, 10);
  var personality = this.createPersonality();
  var needsPool = (this.thoughts && this.thoughts.needs) ? this.thoughts.needs : [];
  var favoriteNeed = 'WATER';

  if (needsPool.length) {
    var poolIndex = this.getRandomRange(0, needsPool.length - 1);
    var pick = needsPool[poolIndex];
    if (pick && pick.maslow && pick.maslow.length) {
      favoriteNeed = pick.maslow[0].need;
    }
  }

  return {
    homeX: this.getRandomRange(100, this.game.world.width - 100),
    workplace: workplaces[this.getRandomRange(0, workplaces.length - 1)],
    shiftStart: shiftStart,
    shiftEnd: shiftStart + this.getRandomRange(6, 9),
    income: this.getRandomRange(5, 25),
    wallet: this.getRandomRange(15, 65),
    lastIntent: null,
    fatigue: this.getRandomRange(10, 40),
    savingsGoal: this.getRandomRange(25, 60),
    favoriteNeed: favoriteNeed,
    personality: personality,
    memory: {
      outcomes: {},
      venuePreferenceWeights: {},
      maxOutcomeHistory: 8
    }
  };
};

BRAIN.prototype.getCurrentHour = function () {
  var dayLength = this.game.dayLength || 60000 * 5;
  var elapsed = this.game.time.now % dayLength;
  return Math.floor((elapsed / dayLength) * 24);
};

BRAIN.prototype.isWorkingHour = function (hour) {
  return hour >= this.profile.shiftStart && hour < this.profile.shiftEnd;
};

BRAIN.prototype.getNeedCost = function (need) {
  var economy = this.game && this.game.economy;
  if (economy && economy.needVenueMap && economy.needVenueMap[need]) {
    var venueSnapshot = economy.getVenueSnapshot(economy.needVenueMap[need]);
    if (venueSnapshot && venueSnapshot.price !== undefined) {
      return venueSnapshot.price;
    }
  }
  var costs = {
    WATER: 3,
    FOOD: 6,
    ART: 8,
    EDUCATION: 8,
    CONFIDENCE: 4,
    WARMTH: 2
  };
  return costs[need] || 0;
};

BRAIN.prototype.hasBudgetFor = function (needName) {
  var cost = this.getNeedCost(needName);
  var reserve = Math.floor(this.profile.savingsGoal * 0.5);
  return (this.profile.wallet - cost) >= reserve;
};

BRAIN.prototype.getEconomy = function () {
  return this.game && this.game.economy ? this.game.economy : null;
};


BRAIN.prototype.getCity = function () {
  return this.game && this.game.city ? this.game.city : null;
};

BRAIN.prototype.ensureMemoryState = function () {
  if (!this.profile.memory) {
    this.profile.memory = { outcomes: {}, venuePreferenceWeights: {}, maxOutcomeHistory: 8 };
  }
  if (!this.profile.memory.outcomes) {
    this.profile.memory.outcomes = {};
  }
  if (!this.profile.memory.venuePreferenceWeights) {
    this.profile.memory.venuePreferenceWeights = {};
  }
  if (!this.profile.memory.maxOutcomeHistory) {
    this.profile.memory.maxOutcomeHistory = 8;
  }
  return this.profile.memory;
};

BRAIN.prototype.getNeedVenueOutcomeMemory = function (needName, venue) {
  var memory = this.ensureMemoryState();
  if (!memory.outcomes[needName]) {
    memory.outcomes[needName] = {};
  }
  if (!memory.outcomes[needName][venue]) {
    memory.outcomes[needName][venue] = { successes: [], failures: [] };
  }
  return memory.outcomes[needName][venue];
};

BRAIN.prototype.getVenuePreferenceWeight = function (needName, venue) {
  var memory = this.ensureMemoryState();
  if (!memory.venuePreferenceWeights[needName]) {
    memory.venuePreferenceWeights[needName] = {};
  }
  if (memory.venuePreferenceWeights[needName][venue] === undefined) {
    memory.venuePreferenceWeights[needName][venue] = 1;
  }
  return memory.venuePreferenceWeights[needName][venue];
};

BRAIN.prototype.adjustVenuePreferenceWeight = function (needName, venue, delta) {
  var memory = this.ensureMemoryState();
  var current = this.getVenuePreferenceWeight(needName, venue);
  memory.venuePreferenceWeights[needName][venue] = Math.max(0.35, Math.min(1.8, current + delta));
};

BRAIN.prototype.rememberVenueOutcome = function (needName, venue, wasSuccess) {
  if (!needName || !venue) {
    return;
  }
  var memory = this.ensureMemoryState();
  var bucket = this.getNeedVenueOutcomeMemory(needName, venue);
  var tick = this.profile.simTick || 0;
  if (wasSuccess) {
    bucket.successes.push(tick);
    this.adjustVenuePreferenceWeight(needName, venue, 0.08);
  } else {
    bucket.failures.push(tick);
    this.adjustVenuePreferenceWeight(needName, venue, -0.12);
  }
  if (bucket.successes.length > memory.maxOutcomeHistory) {
    bucket.successes.shift();
  }
  if (bucket.failures.length > memory.maxOutcomeHistory) {
    bucket.failures.shift();
  }
};

BRAIN.prototype.decayRecentFailurePenalty = function (needName, venue) {
  var bucket = this.getNeedVenueOutcomeMemory(needName, venue);
  if (bucket.failures.length === 0) {
    return 0;
  }
  var tick = this.profile.simTick || 0;
  var penalty = 0;
  for (var i = 0; i < bucket.failures.length; i++) {
    var age = Math.max(0, tick - bucket.failures[i]);
    penalty += 1.15 * Math.exp(-age / 65);
  }
  return Math.min(2.8, penalty);
};

BRAIN.prototype.getVenuePressurePenalty = function (venue, quote) {
  var economy = this.getEconomy();
  if (!economy || !economy.getVenueSnapshot) {
    return 0;
  }
  var snapshot = economy.getVenueSnapshot(venue);
  if (!snapshot) {
    return 0;
  }
  var crowdPenalty = Math.max(0, snapshot.demandPressure || 0) * 0.45;
  var queuePenalty = 0;
  if (quote && quote.reason === 'capacity') {
    queuePenalty = 2;
  } else if ((snapshot.operationalCapacity || 0) <= 1) {
    queuePenalty = 0.6;
  }
  return crowdPenalty + queuePenalty;
};

BRAIN.prototype.scoreVenueForNeed = function (needName, venue, quote) {
  var weight = this.getVenuePreferenceWeight(needName, venue);
  var memoryBonus = (weight - 1) * 1.5;
  var failurePenalty = this.decayRecentFailurePenalty(needName, venue);
  var pressurePenalty = this.getVenuePressurePenalty(venue, quote);
  var costPenalty = quote && quote.price ? (quote.price * 0.02) : 0;
  if (quote && !quote.ok) {
    return -999;
  }
  return 10 + memoryBonus - failurePenalty - pressurePenalty - costPenalty;
};

BRAIN.prototype.composeMemoryRouteMessage = function (needName, chosenVenue, skippedVenue) {
  if (!chosenVenue || !skippedVenue || chosenVenue === skippedVenue) {
    return '';
  }
  var skippedBucket = this.getNeedVenueOutcomeMemory(needName, skippedVenue);
  if (!skippedBucket.failures.length) {
    return '';
  }
  var lastFailureTick = skippedBucket.failures[skippedBucket.failures.length - 1];
  var age = (this.profile.simTick || 0) - lastFailureTick;
  if (age > 90) {
    return '';
  }
  return this.toTitleCase(skippedVenue) + ' was crowded earlier, trying ' + chosenVenue;
};

BRAIN.prototype.resolveVenueForNeed = function (needName) {
  var excludedVenues = arguments.length > 1 && arguments[1] ? arguments[1] : {};
  var need = this.findNeedByName(needName);
  if (!need || !need.acts || need.acts.length === 0) {
    return null;
  }

  var city = this.getCity();
  var economy = this.getEconomy();

  var primary = need.acts[0].toLowerCase();
  var candidates = [];
  var seen = {};

  for (var i = 0; i < need.acts.length; i++) {
    var venue = need.acts[i].toLowerCase();
    if (excludedVenues[venue] || seen[venue]) {
      continue;
    }
    seen[venue] = true;
    var quote = economy ? economy.requestService({ type: 'FULFILL_NEED', door: venue, need: needName }, this.profile) : { ok: true };
    if (city && !city.isVenueOperational(venue)) {
      continue;
    }
    if (quote && quote.ok) {
      candidates.push({
        venue: venue,
        quote: quote,
        rerouted: venue !== primary,
        score: this.scoreVenueForNeed(needName, venue, quote)
      });
    }
  }

  if (city && city.getVenueAlternatives) {
    var alternatives = city.getVenueAlternatives(primary, needName);
    for (var j = 0; j < alternatives.length; j++) {
      var alternative = alternatives[j];
      if (excludedVenues[alternative] || seen[alternative]) {
        continue;
      }
      seen[alternative] = true;
      var altQuote = economy ? economy.requestService({ type: 'FULFILL_NEED', door: alternative, need: needName }, this.profile) : { ok: true };
      if (altQuote && altQuote.ok) {
        candidates.push({
          venue: alternative,
          quote: altQuote,
          rerouted: true,
          score: this.scoreVenueForNeed(needName, alternative, altQuote)
        });
      }
    }
  }

  if (!candidates.length) {
    return null;
  }
  candidates.sort(function (a, b) {
    return b.score - a.score;
  });
  var chosen = candidates[0];
  chosen.memoryMessage = this.composeMemoryRouteMessage(needName, chosen.venue, primary);
  return chosen;
};

BRAIN.prototype.applyUnmetNeedPressure = function (needName, amount) {
  var need = this.findNeedByName(needName);
  if (need) {
    need.value = this.clampNeedValue(need.value + (amount || 3));
  }
  var economy = this.getEconomy();
  if (economy && economy.registerUnmetNeed) {
    economy.registerUnmetNeed(needName, 0.35);
  }
};


BRAIN.prototype.attachServiceQuote = function (intent) {
  if (!intent) {
    return intent;
  }
  var economy = this.getEconomy();
  if (!economy) {
    intent.quote = { ok: true, price: this.getNeedCost(intent.need), reason: 'legacy' };
    return intent;
  }
  intent.quote = economy.requestService(intent, this.profile);
  return intent;
};

BRAIN.prototype.findNeedByName = function (name) {
  for (var i = 0; i < this.thoughts.needs.length; i++) {
    var needs = this.thoughts.needs[i].maslow;
    for (var k = 0; k < needs.length; k++) {
      if (needs[k].need === name) {
        return needs[k];
      }
    }
  }
  return null;
};

BRAIN.prototype.toTitleCase = function (value) {
  if (!value) {
    return 'venue';
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
};

BRAIN.prototype.queueDeferredIntent = function (intent) {
  this.profile.deferredIntent = intent || null;
};

BRAIN.prototype.consumeDeferredIntent = function () {
  var deferred = this.profile.deferredIntent || null;
  this.profile.deferredIntent = null;
  return deferred;
};

BRAIN.prototype.applyFailureState = function (needName, pressure, emotion) {
  if (!needName) {
    return;
  }
  var need = this.findNeedByName(needName);
  if (!need) {
    return;
  }
  var amount = pressure || 2;
  need.value = this.clampNeedValue(need.value + amount);
  if (emotion) {
    need.emotion = emotion;
  }
  this.applyUnmetNeedPressure(needName, amount * 0.15);
};

BRAIN.prototype.mapServiceStatus = function (intent, quote) {
  if (!intent || intent.type === 'REST') {
    return 'SUCCESS';
  }
  if (!quote) {
    return 'DEFER';
  }
  if (quote.ok) {
    if (intent.type === 'FULFILL_NEED' && this.profile.wallet < quote.price) {
      return 'TOO_EXPENSIVE';
    }
    return 'SUCCESS';
  }
  if (quote.reason === 'capacity') {
    return 'QUEUE';
  }
  if (quote.reason === 'stock') {
    return 'OUT_OF_STOCK';
  }
  if (quote.reason === 'closed' || quote.reason === 'no_venue') {
    return 'CLOSED';
  }
  return 'DEFER';
};

BRAIN.prototype.requestServiceStatus = function (intent) {
  var economy = this.getEconomy();
  if (!intent || intent.type === 'REST') {
    return { status: 'SUCCESS', quote: { ok: true, reason: 'rested', price: 0 } };
  }
  if (!economy) {
    return { status: 'SUCCESS', quote: { ok: true, reason: 'legacy', price: this.getNeedCost(intent.need) } };
  }
  var quote = economy.requestService(intent, this.profile);
  intent.quote = quote;
  return {
    status: this.mapServiceStatus(intent, quote),
    quote: quote
  };
};

BRAIN.prototype.makeWorkIntentFromFailure = function (reasonText) {
  var workIntent = this.buildIntent('WORK', this.profile.workplace, this.game.world.centerX, 'Need to earn first', 'MONEY');
  workIntent.message = reasonText + ', taking a work shift';
  return this.attachServiceQuote(workIntent);
};

BRAIN.prototype.makeNeedIntentFromRoute = function (needName, route, reasonText) {
  var need = this.findNeedByName(needName);
  var emotion = need ? need.emotion : 'Trying a different spot';
  var intent = this.buildIntent('FULFILL_NEED', route.venue, this.game.world.centerX, emotion, needName);
  intent.quote = route.quote;
  intent.rerouted = true;
  intent.message = reasonText + ', trying ' + route.venue;
  return intent;
};

BRAIN.prototype.handleArrival = function (intent) {
  if (!intent) {
    return { nextIntent: this.chooseIntent(), waitMs: Phaser.Timer.SECOND * 4 };
  }

  var service = this.requestServiceStatus(intent);
  var venueName = this.toTitleCase(intent.door);
  var status = service.status;

  if (status === 'SUCCESS') {
    this.resolveIntent(intent);
    return {
      status: status,
      waitMs: Phaser.Timer.SECOND * 4,
      nextIntent: this.chooseIntent(),
      bubbleMessage: intent.message
    };
  }

  if (status === 'QUEUE') {
    this.rememberVenueOutcome(intent.need, intent.door, false);
    this.applyFailureState(intent.need, 1.5, 'Queue is long and patience is thinning');
    var queueIntent = {
      type: intent.type,
      door: intent.door,
      goal: intent.goal,
      need: intent.need,
      message: venueName + ' line is packed, waiting in queue',
      queued: true
    };
    this.queueDeferredIntent(queueIntent);
    return { status: status, waitMs: Phaser.Timer.SECOND * 6, bubbleMessage: queueIntent.message };
  }

  if ((status === 'CLOSED' || status === 'OUT_OF_STOCK') && intent.need) {
    this.rememberVenueOutcome(intent.need, intent.door, false);
    this.applyFailureState(intent.need, 2.5, 'Need is still unresolved after a failed stop');
    var excluded = {};
    if (intent.door) {
      excluded[intent.door] = true;
    }
    var route = this.resolveVenueForNeed(intent.need, excluded);
    var reasonMessage = status === 'CLOSED' ? venueName + ' closed' : venueName + ' out of stock';
    if (route) {
      var rerouteIntent = this.makeNeedIntentFromRoute(intent.need, route, reasonMessage);
      this.queueDeferredIntent(rerouteIntent);
      return { status: status, waitMs: Phaser.Timer.SECOND * 3, bubbleMessage: rerouteIntent.message };
    }
    var deferIntent = this.buildIntent('REST', null, this.profile.homeX, 'No alternatives, deferring for now', intent.need);
    deferIntent.message = reasonMessage + ', deferring until later';
    this.queueDeferredIntent(deferIntent);
    return { status: 'DEFER', waitMs: Phaser.Timer.SECOND * 5, bubbleMessage: deferIntent.message };
  }

  if (status === 'TOO_EXPENSIVE') {
    this.rememberVenueOutcome(intent.need, intent.door, false);
    if (intent.need) {
      this.applyFailureState(intent.need, 3, 'Prices spiked and the need remains urgent');
    }
    var workIntent = this.makeWorkIntentFromFailure(venueName + ' is too expensive');
    this.queueDeferredIntent(workIntent);
    return { status: status, waitMs: Phaser.Timer.SECOND * 2, bubbleMessage: workIntent.message };
  }

  if (intent.need) {
    this.rememberVenueOutcome(intent.need, intent.door, false);
    this.applyFailureState(intent.need, 2, 'Could not get service, holding the plan');
  }
  this.queueDeferredIntent(intent);
  return { status: 'DEFER', waitMs: Phaser.Timer.SECOND * 5, bubbleMessage: 'Service failed, trying again soon' };
};

BRAIN.prototype.buildIntent = function (type, doorKey, fallbackX, emotion, needName) {
  var goalX = fallbackX;
  if (doorKey && this.game.doors[doorKey]) {
    goalX = this.game.doors[doorKey].centerX;
  }
  return {
    type: type,
    door: doorKey,
    goal: goalX,
    message: emotion,
    need: needName
  };
};

BRAIN.prototype.pickLine = function (lines) {
  if (!lines || lines.length === 0) {
    return '';
  }
  var index = this.getRandomRange(0, lines.length - 1);
  return lines[index];
};

BRAIN.prototype.composeNeedThought = function (needName, fallbackEmotion) {
  var need = this.findNeedByName(needName);
  var baseLines = need && need.emotionLines ? need.emotionLines : [];
  if (baseLines.length === 0 && need && need.emotion) {
    baseLines.push(need.emotion);
  }
  if (baseLines.length === 0 && fallbackEmotion) {
    baseLines.push(fallbackEmotion);
  }

  var line = this.pickLine(baseLines);
  var personality = this.profile.personality || { openers: [], closers: [] };
  var opener = this.pickLine(personality.openers);
  var closer = this.pickLine(personality.closers);
  var budgetHint = '';
  if (!this.hasBudgetFor(needName) && needName !== 'MONEY') {
    budgetHint = ' (but I have to keep it cheap)';
  }
  var fatigueHint = this.profile.fatigue > 70 ? ' Moving slower than usual.' : '';
  var sentence = '';
  if (opener) {
    sentence += opener + ' ';
  }
  sentence += line;
  if (budgetHint) {
    sentence += budgetHint;
  }
  if (closer) {
    sentence += ' ' + closer;
  }
  if (fatigueHint) {
    sentence += fatigueHint;
  }
  return sentence;
};

BRAIN.prototype.composeWorkThought = function () {
  var personality = this.profile.personality || { openers: [], closers: [] };
  var openers = ['Off to my ' + this.profile.workplace + ' shift to refill the wallet', 'Clocking in at the ' + this.profile.workplace + ', chasing those bills', 'Heading to the ' + this.profile.workplace + ' before the day gets away'];
  var closer = this.pickLine(personality.closers);
  var line = this.pickLine(openers);
  if (closer) {
    line += ' ' + closer;
  }
  return line;
};

BRAIN.prototype.composeRestThought = function () {
  var fatigue = this.profile.fatigue;
  var personality = this.profile.personality || { openers: [], closers: [] };
  var restReasons = fatigue > 90 ? ['Eyes sting—home is the only answer', 'Too worn out; need to collapse for a bit', 'Every step feels heavy; home, now'] : ['Better recharge before the next shift', 'A quick breather will help me focus', 'Should rest up so I don’t drag tomorrow'];
  var opener = this.pickLine(personality.openers);
  var closer = this.pickLine(personality.closers);
  var line = this.pickLine(restReasons);
  var text = opener ? opener + ' ' + line : line;
  return closer ? text + ' ' + closer : text;
};

BRAIN.prototype.describeIntent = function (type, data) {
  if (type === 'WORK') {
    return this.composeWorkThought();
  }
  if (type === 'REST') {
    return this.composeRestThought();
  }
  if (type === 'FULFILL_NEED' && data && data.need) {
    var thought = this.composeNeedThought(data.need, data.emotion);
    var cost = data.price !== undefined ? data.price : this.getNeedCost(data.need);
    return cost ? thought + ' ($' + cost + ')' : thought;
  }
  return data && data.emotion ? data.emotion : 'On the move';
};

BRAIN.prototype.initializeNeedRuntimeData = function () {
  for (var i = 0; i < this.thoughts.needs.length; i++) {
    var tierName = this.getTierName(i);
    var tierNeeds = this.thoughts.needs[i].maslow;
    for (var j = 0; j < tierNeeds.length; j++) {
      tierNeeds[j].tier = tierName;
      tierNeeds[j].lastServedVenue = null;
      tierNeeds[j].lastServedTick = -99999;
    }
  }
};

BRAIN.prototype.decayMemory = function () {
  var memory = this.ensureMemoryState();
  var revertRate = 0.004;
  var pruneAfterTicks = 240;
  var tick = this.profile.simTick || 0;
  var needKeys = Object.keys(memory.venuePreferenceWeights);
  for (var i = 0; i < needKeys.length; i++) {
    var needName = needKeys[i];
    var venueWeights = memory.venuePreferenceWeights[needName];
    var venues = Object.keys(venueWeights);
    for (var j = 0; j < venues.length; j++) {
      var venue = venues[j];
      var current = venueWeights[venue];
      venueWeights[venue] = current + (1 - current) * revertRate;
    }
  }

  var outcomeNeeds = Object.keys(memory.outcomes);
  for (var n = 0; n < outcomeNeeds.length; n++) {
    var outcomeNeed = outcomeNeeds[n];
    var outcomeVenues = Object.keys(memory.outcomes[outcomeNeed]);
    for (var v = 0; v < outcomeVenues.length; v++) {
      var key = outcomeVenues[v];
      var bucket = memory.outcomes[outcomeNeed][key];
      bucket.successes = bucket.successes.filter(function (t) { return (tick - t) <= pruneAfterTicks; });
      bucket.failures = bucket.failures.filter(function (t) { return (tick - t) <= pruneAfterTicks; });
    }
  }
};

BRAIN.prototype.getTierName = function (tierIndex) {
  var order = this.needBalancing.tierOrder;
  return order[tierIndex] || order[order.length - 1];
};

BRAIN.prototype.clampNeedValue = function (value) {
  var clamp = this.needBalancing.clamp;
  return Math.max(clamp.min, Math.min(clamp.max, value));
};

BRAIN.prototype.getNeedCurve = function (needName) {
  var curves = this.needBalancing.needCurves || {};
  return curves[needName] || this.needBalancing.defaultCurve;
};

BRAIN.prototype.getTierGateMultiplier = function (tierIndex, lowerTierStable, normalizedDeficit) {
  var gating = this.needBalancing.gating;
  if (tierIndex === 0) {
    return 1;
  }
  if (lowerTierStable) {
    return 1 + gating.stableLowerTierBoost * normalizedDeficit;
  }
  return gating.unstableLowerTierMultiplier;
};

BRAIN.prototype.getNeedCooldownPenalty = function (need) {
  if (!need) {
    return 0;
  }
  var cooldown = this.needBalancing.cooldown;
  var history = this.profile.venueHistory || [];
  if (!need.lastServedVenue || history.length === 0) {
    return 0;
  }

  var repeatCount = 0;
  for (var i = history.length - 1; i >= 0; i--) {
    if ((this.profile.simTick - history[i].tick) > cooldown.lookbackTicks) {
      break;
    }
    if (history[i].venue === need.lastServedVenue) {
      repeatCount += 1;
    }
  }

  var sinceLastServed = this.profile.simTick - (need.lastServedTick || 0);
  if (sinceLastServed <= cooldown.graceTicks) {
    repeatCount += cooldown.recentVisitBonusCount;
  }
  return repeatCount * cooldown.penaltyPerRepeat;
};

BRAIN.prototype.getWeight= function (x,y,i) {
  var clampedValue = this.clampNeedValue(y);
  var tierName = this.getTierName(i);
  var tierUrgency = this.needBalancing.tierUrgency[tierName] || 1;
  var normalizedDeficit = (this.needBalancing.clamp.max - clampedValue) / this.needBalancing.clamp.max;
  normalizedDeficit = Math.max(0, Math.min(1, normalizedDeficit));
  var deficitCurve = Math.pow(normalizedDeficit, this.needBalancing.weightCurve.deficitExponent);
  return x * tierUrgency * (this.needBalancing.weightCurve.baseline + deficitCurve);
};

BRAIN.prototype.life = function () {
  this.profile.simTick += 1;
  this.decayMemory();
  var lowerTierStable = true;
  for ( var i = 0; i < this.thoughts.needs.length; i++) {
    var needs = this.thoughts.needs[i];
    var tierDeficitPeak = 0;
    for(var j = 0; j< needs.maslow.length;j++){
      var need = needs.maslow[j];
      var curve = this.getNeedCurve(need.need);
      need.value = this.clampNeedValue(need.value + curve.decayPerTick - curve.passiveRecoveryPerTick);
      var normalizedDeficit = (this.needBalancing.clamp.max - need.value) / this.needBalancing.clamp.max;
      tierDeficitPeak = Math.max(tierDeficitPeak, normalizedDeficit);
      var gateMultiplier = this.getTierGateMultiplier(i, lowerTierStable, normalizedDeficit);
      need.weight = this.getWeight(need.baseWeight, need.value, i) * gateMultiplier;
      need.weight = Math.max(0, need.weight - this.getNeedCooldownPenalty(need));
    }
    lowerTierStable = lowerTierStable && tierDeficitPeak <= this.needBalancing.gating.lowerTierDeficitThreshold;
  }
  this.profile.fatigue = Math.min(100, this.profile.fatigue + 0.05);
  if (this.profile.wallet < 10) {
    var moneyNeed = this.findNeedByName('MONEY');
    if (moneyNeed) {
      moneyNeed.value = this.clampNeedValue(moneyNeed.value + 0.5);
    }
  }
  if (this.getCurrentHour() > 21 || this.getCurrentHour() < 6) {
    var warmthNeed = this.findNeedByName('WARMTH');
    if (warmthNeed) {
      warmthNeed.value = this.clampNeedValue(warmthNeed.value - 0.3);
    }
  }
};

BRAIN.prototype.sortThoughts = function() {
  for (var i = 0; i < this.thoughts.needs.length; i++) {
    var total = 0;
    var needs = this.thoughts.needs[i];
    for (var k = 0; k < needs.maslow.length; k++) {
      total += needs.maslow[k].weight;
    }
    needs.totalWeight = total;
    //console.log("TOTAL:",this.thoughts.needs[i].totalWeight);

    needs.maslow.sort(function (a, b) {
      return b.weight - a.weight;
    });
    this.thoughts.needs.sort(function (a, b) {
      return b.totalWeight - a.totalWeight;
    });

  }

  //this.thoughts.needs[0].maslow[0].value = 100;
  //console.log(this.thoughts.needs[0].maslow[0].emotion);
};

BRAIN.prototype.getRandomRange= function (low, high) {
  return this.game.rnd.integerInRange(low, high);
};

BRAIN.prototype.pickTopNeed = function () {
  var fallback = null;
  var best = null;
  var bestScore = -Infinity;
  this.sortThoughts();
  for (var i = 0; i < this.thoughts.needs.length; i++) {
    var needs = this.thoughts.needs[i].maslow;
    for (var k = 0; k < needs.length; k++) {
      var candidate = needs[k];
      var score = candidate.weight;
      if (!fallback) {
        fallback = candidate;
      }
      if (this.profile.lastIntent && this.profile.lastIntent.need === candidate.need) {
        score -= 0.2;
      }
      if (candidate.need === this.profile.favoriteNeed) {
        score += 0.1;
      }
      if (score > bestScore) {
        bestScore = score;
        best = candidate;
      }
    }
  }
  return best || fallback;
};

BRAIN.prototype.chooseIntent = function () {
  var hour = this.getCurrentHour();
  var approachingShift = hour >= this.profile.shiftStart - 1 && hour < this.profile.shiftEnd;
  if (approachingShift && this.profile.fatigue < 90) {
    var workIntent = this.buildIntent('WORK', this.profile.workplace, this.game.world.centerX, 'Heading to work', 'MONEY');
    workIntent.message = this.describeIntent('WORK', { need: 'MONEY' });
    return this.attachServiceQuote(workIntent);
  }

  if (this.profile.fatigue > 80 || hour >= 22 || hour < 6) {
    var restIntent = this.buildIntent('REST', null, this.profile.homeX, 'Heading home to rest', null);
    restIntent.message = this.describeIntent('REST');
    return restIntent;
  }

  var topNeed = this.pickTopNeed();
  if (!this.hasBudgetFor(topNeed.need) && topNeed.need !== 'MONEY') {
    var brokeIntent = this.buildIntent('WORK', this.profile.workplace, this.game.world.centerX, "I need cash first", 'MONEY');
    brokeIntent.message = this.describeIntent('WORK', { need: 'MONEY' });
    return this.attachServiceQuote(brokeIntent);
  }
  var route = this.resolveVenueForNeed(topNeed.need);
  if (!route) {
    this.applyUnmetNeedPressure(topNeed.need, 4);
    var fallbackIntent = this.buildIntent('REST', null, this.profile.homeX, 'No safe venue is open; heading home', topNeed.need);
    fallbackIntent.message = this.describeIntent('REST') + ' Service outage is making needs worse.';
    return fallbackIntent;
  }

  var intent = this.buildIntent('FULFILL_NEED', route.venue, this.game.world.centerX, topNeed.emotion, topNeed.need);
  intent.quote = route.quote;
  intent.rerouted = !!route.rerouted;
  if (route.memoryMessage) {
    intent.message = route.memoryMessage + '. ' + this.describeIntent('FULFILL_NEED', { need: topNeed.need, emotion: topNeed.emotion, price: intent.quote && intent.quote.price });
  } else if (intent.rerouted) {
    intent.message = 'Rerouting to ' + route.venue + ' due to disruption. ' + this.describeIntent('FULFILL_NEED', { need: topNeed.need, emotion: topNeed.emotion, price: intent.quote && intent.quote.price });
  } else {
    intent.message = this.describeIntent('FULFILL_NEED', { need: topNeed.need, emotion: topNeed.emotion, price: intent.quote && intent.quote.price });
  }
  return intent;
};

BRAIN.prototype.resolveIntent = function (intent) {
  if (!intent) {
    return;
  }
  var economy = this.getEconomy();
  var settlement = null;
  if (economy) {
    settlement = economy.settleTransaction(intent, this.profile);
    this.profile.wallet = Math.max(0, this.profile.wallet + settlement.walletDelta);
  }
  if (intent.type === 'WORK') {
    if (!economy) {
      this.profile.wallet += this.profile.income;
    }
    var moneyNeed = this.findNeedByName('MONEY');
    if (moneyNeed && (!settlement || settlement.ok)) {
      moneyNeed.value = this.clampNeedValue(moneyNeed.value - this.getNeedCurve('MONEY').recoveryOnResolve);
      moneyNeed.emotion = "Wallet's breathing again after that shift";
    }
    if (!settlement || settlement.ok) {
      this.profile.fatigue = Math.min(100, this.profile.fatigue + 5);
    }
  }

  if (intent.type === 'FULFILL_NEED' && intent.need) {
    var need = this.findNeedByName(intent.need);
    if (need && (!settlement || settlement.ok)) {
      this.rememberVenueOutcome(intent.need, intent.door, true);
      var recovery = this.getNeedCurve(intent.need).recoveryOnResolve;
      need.value = this.clampNeedValue(need.value - recovery);
      need.emotion = "That helped; the pressure eased for now";
      this.profile.fatigue = Math.max(0, this.profile.fatigue - 2);
      need.lastServedVenue = intent.door || null;
      need.lastServedTick = this.profile.simTick;
      this.profile.venueHistory.push({
        venue: intent.door || 'unknown',
        tick: this.profile.simTick
      });
      if (this.profile.venueHistory.length > this.needBalancing.cooldown.historyLimit) {
        this.profile.venueHistory.shift();
      }
    } else if (need && settlement && !settlement.ok) {
      this.rememberVenueOutcome(intent.need, intent.door, false);
      need.value = this.clampNeedValue(need.value + 2);
      this.applyUnmetNeedPressure(intent.need, 2);
      need.emotion = "Didn't get served; still chasing relief";
    }
    if (!economy && need) {
      var cost = this.getNeedCost(intent.need);
      this.profile.wallet = Math.max(0, this.profile.wallet - cost);
    }
  }

  if (intent.type === 'REST') {
    var securityNeed = this.findNeedByName('SECURITY');
    if (securityNeed) {
      securityNeed.value = Math.max(0, securityNeed.value - 10);
    }
    this.profile.fatigue = Math.max(0, this.profile.fatigue - 25);
  }
  intent.outcome = settlement;
  this.profile.lastIntent = intent;
};

BRAIN.prototype.setGoal = function () {
  var intent = this.chooseIntent();
  this.profile.lastIntent = intent;
  return intent.goal;
};

BRAIN.prototype.preload = function () {

};


BRAIN.prototype.update = function() {

};

module.exports = BRAIN;

},{"../data/brainNeedBalancing.json":6}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){

CITY = function (game,  x, y) {
  Phaser.Sprite.call(this, game, x, y, '', 0);
  this.game = game;
  this.buildings = this.game.add.group();
  this.game.doors = {};
  this.game.fade = {};

  this.building_data = [
    {"building":1, "ground":37, "floor":25, "top":34, "earth":270, "max_height":40},
    {"building":2, "ground":0, "floor":52, "top":78, "earth":250, "max_height":45},
    {"building":3, "ground":0, "floor":136, "top":111, "earth":260, "max_height":20},
    {"building":4, "ground":0, "floor":52, "top":166, "earth":295, "max_height":20}
  ];

  this.serviceTypes = {
    hydration: { venues: ['cafe'], severity: 0, state: 'stable', recoveryTimerMs: 0, rebuildCost: 0, laborRequired: 0 },
    food: { venues: ['bakery'], severity: 0, state: 'stable', recoveryTimerMs: 0, rebuildCost: 0, laborRequired: 0 },
    shelter: { venues: ['library'], severity: 0, state: 'stable', recoveryTimerMs: 0, rebuildCost: 0, laborRequired: 0 },
    finance: { venues: ['bank'], severity: 0, state: 'stable', recoveryTimerMs: 0, rebuildCost: 0, laborRequired: 0 },
    culture: { venues: ['bookstore', 'library'], severity: 0, state: 'stable', recoveryTimerMs: 0, rebuildCost: 0, laborRequired: 0 }
  };
  this.venueServiceTypeMap = {
    cafe: 'hydration',
    bakery: 'food',
    library: 'shelter',
    bank: 'finance',
    bookstore: 'culture'
  };

  this.damageStates = {
    destroyed: { capacityMultiplier: 0, inventoryMultiplier: 0, durationMs: 90000, costMultiplier: 1.4, laborMultiplier: 1.8 },
    degraded: { capacityMultiplier: 0.45, inventoryMultiplier: 0.5, durationMs: 55000, costMultiplier: 1.0, laborMultiplier: 1.2 },
    recovering: { capacityMultiplier: 0.75, inventoryMultiplier: 0.8, durationMs: 35000, costMultiplier: 0.6, laborMultiplier: 0.6 },
    stable: { capacityMultiplier: 1, inventoryMultiplier: 1, durationMs: 0, costMultiplier: 0, laborMultiplier: 0 }
  };

  this.damageModel = {
    instability: 0,
    instabilityDecayPerSecond: 0.035,
    lastUpdateAt: this.game.time.now,
    venueStatus: {},
    debugLines: []
  };

  this.addOrderedBuildings();
  this.addBank();
  this.addLibrary();
  this.addBakery();
  this.addCafe();
  this.addBookstore();
  this.addBuildingsToGame();

  this.initializeDamageModel();
};

CITY.prototype = Object.create(Phaser.Sprite.prototype);
CITY.prototype.constructor = CITY;

CITY.prototype.initializeDamageModel = function () {
  var venues = ['bank', 'bakery', 'cafe', 'library', 'bookstore'];
  for (var i = 0; i < venues.length; i++) {
    this.damageModel.venueStatus[venues[i]] = {
      venue: venues[i],
      state: 'stable',
      severity: 0,
      recoveryTimerMs: 0,
      rebuildCost: 0,
      laborRequired: 0,
      unavailable: false,
      capacityModifier: 1,
      inventoryModifier: 1,
      source: null
    };
  }
};

CITY.prototype.shuffleGroupChildren = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

CITY.prototype.addBuildingsToGame = function () {
  var counter = 0;
  var startX = 200;
  var buildingWidth;

  var building_data = this.building_data;
  this.buildings.children = this.shuffleGroupChildren(this.buildings.children);

  for (var bcount = 0; bcount < this.buildings.children.length; bcount++) {
    var sprite = this.buildings.children[bcount];
    var type = sprite instanceof Phaser.Group;

    if (type === false) {
      sprite.exists = true;
      sprite.x = startX;
      this.game.doors[sprite.key] = this.game.add.sprite(sprite.centerX, sprite.y + sprite.height - 40, 'door');
      this.game.doors[sprite.key].anchor.setTo(0.5, 0.5);

      buildingWidth = sprite.width;
      counter += 1;
    } else {

      var nextY = sprite.game.world.height - 270;
      var heightCount = 0;

      for (var gcount = 0; gcount < sprite.children.length; gcount++) {
        var deepSprite = sprite.children[gcount];

        var data = deepSprite.key.split('_');
        var level = data[0];
        var level_data;
        var building_num = data[1];
        deepSprite.exists = true;
        deepSprite.x = startX;

        for (var i = 0; i < building_data.length; i++) {
          var building_level = building_data[i];

          if (building_level.building === parseInt(building_num)) {
            level_data = building_level;
            break;

          }
        }

        switch (level) {
          case 'ground':
            nextY = sprite.game.world.height - (level_data.earth + level_data.ground);
            break;
          case 'floor':
            nextY = (sprite.game.world.height - (level_data.earth + level_data.ground + (level_data.floor * heightCount)));
            break;
          case 'top':
            nextY = (sprite.game.world.height - (level_data.earth + level_data.ground + (level_data.floor * (heightCount - 1))) - (level_data.top));
            break;
        }

        deepSprite.y = nextY;

        buildingWidth = deepSprite.width;
        counter += 1;
        heightCount += 1;
      }
    }

    startX = startX + buildingWidth + sprite.game.rnd.integerInRange(0, 15);
  }
};

CITY.prototype.addLibrary = function () {
  this.buildings.create(0, this.game.world.height - 440, 'library', 0, false);
};
CITY.prototype.addBakery = function () {
  this.buildings.create(0, this.game.world.height - 495, 'bakery', 0, false);

};
CITY.prototype.addCafe = function () {
  this.buildings.create(0, this.game.world.height - 495, 'cafe', 0, false);

};
CITY.prototype.addBookstore = function () {
  this.buildings.create(0, this.game.world.height - 495, 'bookstore', 0, false);

};

CITY.prototype.addBank = function () {
  this.buildings.create(0, this.game.world.height - 488, 'bank', 0, false);
};

CITY.prototype.addRandomBuildings = function () {
  for (var i = 0; i < this.game.rnd.integerInRange(10, 100); i++) {
    var building = this.building_data[this.game.rnd.integerInRange(0, this.building_data.length - 1)];
    this.createBuilding(
      ['ground_' + building.building, building.ground],
      ['floor_' + building.building, building.floor],
      ['top_' + building.building, building.top],
      building.earth, building.max_height);
  }
};

CITY.prototype.addOrderedBuildings = function () {
  for (var i = 0; i < this.building_data.length; i++) {
    var building = this.building_data[i];

    var building_added = this.createBuilding(
      ['ground_' + building.building, building.ground],
      ['floor_' + building.building, building.floor],
      ['top_' + building.building, building.top], building.max_height);
    this.buildings.add(building_added);
  }
};

CITY.prototype.createBuilding = function (ground, floor, top, max_height) {
  var height = this.game.rnd.integerInRange(10, max_height);
  var floored_building = this.game.add.group();

  floored_building.create(0, 0, ground[0], 0, false);

  for (var i = 0; i < height; i++) {
    floored_building.create(0, 0, floor[0], 0, false);
  }

  floored_building.create(0, 0, top[0], 0, false);

  return floored_building;
};

CITY.prototype.getRecoveryProfile = function (state, severity) {
  var template = this.damageStates[state] || this.damageStates.degraded;
  var normalizedSeverity = Math.max(0.1, Math.min(1, severity || 0.5));
  return {
    state: state,
    capacityModifier: template.capacityMultiplier,
    inventoryModifier: template.inventoryMultiplier,
    recoveryTimerMs: Math.ceil(template.durationMs * (0.7 + normalizedSeverity)),
    rebuildCost: Math.ceil((140 + normalizedSeverity * 420) * template.costMultiplier),
    laborRequired: Math.ceil((35 + normalizedSeverity * 130) * template.laborMultiplier)
  };
};

CITY.prototype.markVenueDamage = function (venue, state, options) {
  var venueState = this.damageModel.venueStatus[venue];
  if (!venueState) {
    return null;
  }

  var damageState = this.damageStates[state] ? state : 'degraded';
  var severity = options && options.severity !== undefined ? options.severity : 0.5;
  var profile = this.getRecoveryProfile(damageState, severity);

  venueState.state = damageState;
  venueState.severity = severity;
  venueState.recoveryTimerMs = profile.recoveryTimerMs;
  venueState.rebuildCost = profile.rebuildCost;
  venueState.laborRequired = profile.laborRequired;
  venueState.unavailable = damageState === 'destroyed';
  venueState.capacityModifier = profile.capacityModifier;
  venueState.inventoryModifier = profile.inventoryModifier;
  venueState.source = options && options.source ? options.source : 'incident';

  this.damageModel.instability = Math.min(1.5, this.damageModel.instability + (0.2 + severity * 0.55));

  return venueState;
};

CITY.prototype.markServiceDamage = function (serviceType, state, options) {
  var service = this.serviceTypes[serviceType];
  if (!service) {
    return;
  }
  service.state = state;
  service.severity = Math.max(service.severity || 0, options && options.severity !== undefined ? options.severity : 0.5);

  for (var i = 0; i < service.venues.length; i++) {
    this.markVenueDamage(service.venues[i], state, options);
  }
};

CITY.prototype.markVenueUnavailable = function (venue, source) {
  return this.markVenueDamage(venue, 'destroyed', { severity: 0.85, source: source || 'battle' });
};

CITY.prototype.markVenueReducedCapacity = function (venue, severity, source) {
  return this.markVenueDamage(venue, 'degraded', { severity: severity || 0.45, source: source || 'catastrophe' });
};

CITY.prototype.triggerCatastrophe = function (options) {
  var intensity = options && options.intensity !== undefined ? options.intensity : this.game.rnd.frac();
  var allVenues = Object.keys(this.damageModel.venueStatus);
  var hitCount = Math.max(1, Math.min(allVenues.length, Math.ceil(1 + intensity * 3)));
  var impacted = [];

  for (var i = 0; i < hitCount; i++) {
    var venue = allVenues[this.game.rnd.integerInRange(0, allVenues.length - 1)];
    if (impacted.indexOf(venue) !== -1) {
      continue;
    }
    impacted.push(venue);
    if (this.game.rnd.frac() < 0.35 + intensity * 0.4) {
      this.markVenueUnavailable(venue, 'catastrophe');
    } else {
      this.markVenueReducedCapacity(venue, 0.35 + intensity * 0.55, 'catastrophe');
    }
  }

  this.damageModel.instability = Math.min(1.8, this.damageModel.instability + 0.25 + intensity * 0.8);
};

CITY.prototype.getVenueStatus = function (venue) {
  return this.damageModel.venueStatus[venue] || null;
};

CITY.prototype.isVenueOperational = function (venue) {
  var status = this.getVenueStatus(venue);
  return !status || status.state !== 'destroyed';
};

CITY.prototype.getVenueAlternatives = function (venue, needName) {
  var economy = this.game && this.game.economy;
  var serviceType = this.venueServiceTypeMap[venue] || null;

  if (!serviceType && economy && economy.needVenueMap && needName) {
    serviceType = this.venueServiceTypeMap[economy.needVenueMap[needName]];
  }

  if (!serviceType || !this.serviceTypes[serviceType]) {
    return [];
  }

  var possibilities = this.serviceTypes[serviceType].venues;
  var alternatives = [];

  for (var i = 0; i < possibilities.length; i++) {
    var candidate = possibilities[i];
    if (candidate === venue) {
      continue;
    }
    var damage = this.getVenueStatus(candidate);
    if (damage && damage.state === 'destroyed') {
      continue;
    }
    if (economy && economy.isVenueClosedForDisruption && economy.isVenueClosedForDisruption(candidate)) {
      continue;
    }
    alternatives.push(candidate);
  }

  return alternatives;
};

CITY.prototype.advanceVenueRecovery = function (venueState, deltaMs) {
  if (venueState.state === 'stable') {
    return;
  }

  venueState.recoveryTimerMs = Math.max(0, venueState.recoveryTimerMs - deltaMs);
  if (venueState.recoveryTimerMs > 0) {
    return;
  }

  if (venueState.state === 'destroyed') {
    var recovering = this.getRecoveryProfile('recovering', venueState.severity || 0.5);
    venueState.state = 'recovering';
    venueState.unavailable = false;
    venueState.capacityModifier = recovering.capacityModifier;
    venueState.inventoryModifier = recovering.inventoryModifier;
    venueState.recoveryTimerMs = recovering.recoveryTimerMs;
    venueState.rebuildCost = Math.ceil(venueState.rebuildCost * 0.55);
    venueState.laborRequired = Math.ceil(venueState.laborRequired * 0.5);
    return;
  }

  if (venueState.state === 'degraded') {
    var recoveringProfile = this.getRecoveryProfile('recovering', venueState.severity || 0.45);
    venueState.state = 'recovering';
    venueState.capacityModifier = recoveringProfile.capacityModifier;
    venueState.inventoryModifier = recoveringProfile.inventoryModifier;
    venueState.recoveryTimerMs = recoveringProfile.recoveryTimerMs;
    venueState.rebuildCost = Math.ceil(venueState.rebuildCost * 0.45);
    venueState.laborRequired = Math.ceil(venueState.laborRequired * 0.55);
    return;
  }

  venueState.state = 'stable';
  venueState.severity = 0;
  venueState.rebuildCost = 0;
  venueState.laborRequired = 0;
  venueState.unavailable = false;
  venueState.capacityModifier = 1;
  venueState.inventoryModifier = 1;
  venueState.recoveryTimerMs = 0;
};

CITY.prototype.applyRecoveryEconomics = function (venueState, deltaMs) {
  var economy = this.game && this.game.economy;
  if (!economy || venueState.state === 'stable') {
    return;
  }
  var venue = economy.venues[venueState.venue];
  if (!venue) {
    return;
  }

  var repairBudgetPerSecond = Math.max(2, Math.floor(Math.max(0, venue.balance + 80) * 0.04));
  var laborBudgetPerSecond = Math.max(1, Math.floor(venue.staffCount * venue.wage * 0.08));

  var dtSeconds = Math.max(0.016, deltaMs / 1000);
  var repairSpend = Math.min(venueState.rebuildCost, Math.ceil(repairBudgetPerSecond * dtSeconds));
  var laborSpend = Math.min(venueState.laborRequired, Math.ceil(laborBudgetPerSecond * dtSeconds));

  venueState.rebuildCost = Math.max(0, venueState.rebuildCost - repairSpend);
  venueState.laborRequired = Math.max(0, venueState.laborRequired - laborSpend);

  if (repairSpend > 0) {
    venue.balance = Math.max(-450, venue.balance - repairSpend);
  }
  if (laborSpend > 0) {
    venue.balance = Math.max(-450, venue.balance - Math.ceil(laborSpend * 0.25));
  }

  if (venueState.rebuildCost === 0 && venueState.laborRequired === 0) {
    venueState.recoveryTimerMs = Math.min(venueState.recoveryTimerMs, Math.ceil(2200 + (1 - Math.max(0, venue.balance) / 900) * 3000));
  }
};

CITY.prototype.pushDisruptionToEconomy = function () {
  var economy = this.game && this.game.economy;
  if (!economy || !economy.applyDisruptionSnapshot) {
    return;
  }
  economy.applyDisruptionSnapshot(this.damageModel.venueStatus, this.damageModel.instability);
};

CITY.prototype.updateDebugLines = function () {
  var keys = Object.keys(this.damageModel.venueStatus);
  var lines = ['CITY INSTABILITY ' + this.damageModel.instability.toFixed(2)];

  for (var i = 0; i < keys.length; i++) {
    var status = this.damageModel.venueStatus[keys[i]];
    var timerSeconds = Math.ceil((status.recoveryTimerMs || 0) / 1000);
    lines.push(
      status.venue.toUpperCase() + ': ' + status.state +
      ' cap x' + status.capacityModifier.toFixed(2) +
      ' t-' + timerSeconds + 's' +
      (status.rebuildCost > 0 ? ' $' + status.rebuildCost : '') +
      (status.laborRequired > 0 ? ' L' + status.laborRequired : '')
    );
  }

  this.damageModel.debugLines = lines;
};

CITY.prototype.getDebugDamageLines = function () {
  return this.damageModel.debugLines || [];
};

CITY.prototype.animateDamage = function () {

};

CITY.prototype.updateDamageModel = function (deltaMs) {
  var dt = deltaMs || Math.max(16, this.game.time.now - this.damageModel.lastUpdateAt);
  this.damageModel.lastUpdateAt = this.game.time.now;

  if (this.game.rnd.frac() < (0.00002 + Math.max(0, this.damageModel.instability) * 0.0003)) {
    this.triggerCatastrophe({ intensity: Math.min(1, 0.25 + this.damageModel.instability) });
  }

  var keys = Object.keys(this.damageModel.venueStatus);
  for (var i = 0; i < keys.length; i++) {
    var venueState = this.damageModel.venueStatus[keys[i]];
    this.applyRecoveryEconomics(venueState, dt);
    this.advanceVenueRecovery(venueState, dt);
  }

  this.damageModel.instability = Math.max(0, this.damageModel.instability - this.damageModel.instabilityDecayPerSecond * (dt / 1000));

  this.pushDisruptionToEconomy();
  this.updateDebugLines();
};

CITY.prototype.update = function () {
  var deltaMs = this.game.time.elapsedMS || 16;

  this.game.back.x -= this.game.player.body.velocity.x * (0.001);
  this.game.fade.x -= this.game.player.body.velocity.x * (0.0005);

  this.game.back.y -= this.game.player.body.velocity.y * (0.001);
  this.game.fade.y -= this.game.player.body.velocity.y * (0.0005);

  this.updateDamageModel(deltaMs);
};

module.exports = CITY;

},{}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
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

    var message;
    if (this.currentState === "uber") {
        message = "[click] Change into Secret Identity!";
    } else {
        message = "[click] Change into Uberman!";
    }

    if (this.body.touching.down) {
        this.spriteMessage(this, message);
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
    if (this.currentState === "uber") {
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
        if (sprite.currentState === "uber") {
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

    if (!this.checkOverlap(sprite, this.game.doors)) {


        this.switch_char(sprite);
    } else if (this.currentState !== "uber" && this.checkOverlap(sprite, this.game.doors)) {
      if(this.game.door){
        this.onDoorClick(this.game.door);
      }

    } else {
        console.log("SWITCHING");
        this.switch_char(sprite);
    }


};
Hero.prototype.checkOverlap = function (spriteA, spriteList) {
    var boundsA = spriteA.getBounds();

    for (var i = 0; i < Object.keys(spriteList).length; i++) {
        var boundsB = spriteList[Object.keys(spriteList)[i]].getBounds();

        if (Phaser.Rectangle.intersects(boundsA, boundsB)) {
            this.game.door = spriteList[Object.keys(spriteList)[i]];
            return true;
        }
    }

    this.game.door = null;
    return false;
};
Hero.prototype.onSpriteRelease = function (sprite, pointer) {
    this.isClicked = false;
};
Hero.prototype.getCardinal = function (angle, diagonals) {

    if (diagonals) {
        angle = Math.round((angle + Math.PI) / (Math.PI * 2) * 8) % 8;
        return (this.directions[angle]);
    } else {
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
        //this.game.back.x -= this.body.velocity.x * (0.001);

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
},{}],12:[function(require,module,exports){

HUD = function (game,  x, y) {
  // the bar itself
  this.player = game.player;
  this.bar = game.add.bitmapData(128, 20);
  Phaser.Sprite.call(this, game, 0, 0, this.bar);
  this.fixedToCamera = true;
  this.cameraOffset.setTo(162, 100);
  this.damage = 0;

  var clock = this.game.add.bitmapText(this.game.width/2-55, 50, 'digits', "", 62);

  //clock.anchor.setTo(0.5, 0.5);
  clock.fixedToCamera = true;
  clock.align = "center";
  //console.log(clock);
  var timeValue = {};
  timeValue.time = 0;
  this.timeTween = this.game.add.tween(timeValue).to({time:  this.game.dayLength}, this.game.dayLength);

  this.timeTween.onUpdateCallback(function() {


    clock.text = (parseInt(timeValue.time / 1000 / 60 )%12 + ":" + parseInt(timeValue.time / 1000 % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}));
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

  this.cityDebugText = this.game.add.bitmapText(0, 0, 'smallfont', '', 14);
  this.cityDebugText.fixedToCamera = true;
  this.cityDebugText.cameraOffset.setTo(18, 140);
  this.cityDebugText.maxWidth = 420;
  this.cityDebugText.align = 'left';

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

  if (this.game.city && this.game.city.getDebugDamageLines) {
    var damageLines = this.game.city.getDebugDamageLines();
    this.cityDebugText.text = damageLines.join('\n');
  }

  this.animateDamage();
};

module.exports = HUD;
},{}],13:[function(require,module,exports){
var Brain = require('./Brain');

Pedestrian = function (game, y, sprite) {
  Phaser.Sprite.call(this, game, game.rnd.integerInRange(-200, game.world.width+200), y, sprite, 0);

  this.anchor.setTo(0.5, 0.5);
  //this.goal = game.world.centerX;
  //this.goal = this.setGoal();

  this.frame = 0;
  this.frames = [];
  this.pedestrian_array = ["oldman-wait","businessman-wait", "delivery-wait","boy-wait", "slick-wait", "hapgood-wait", "foreign-wait"];
  this.visible = true;

  this.ai = new Brain(game);
  this.currentIntent = this.ai.chooseIntent();
  this.goal = this.currentIntent.goal;

  this.messageContainer = null;

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
  this.isDistracted = false;
  this.distractionMessages = ["Ooh!", "Ahh!", "It's UBERMAN!"];
  this.distractionRadius = 260;
  this.distractionLine = null;

  this.check_animation();
  this.movement();




};

Pedestrian.prototype = Object.create(Phaser.Sprite.prototype);

Pedestrian.prototype.constructor = Pedestrian;








Pedestrian.prototype.spriteMessage = function () {
  if (!this.visible) {
    if (this.messageContainer) {
      this.messageContainer.destroy();
      this.messageContainer = null;
      this.messageText = null;
      this.messageBubble = null;
    }
    return;
  }

  var message = "";
  if (this.isDistracted) {
    if (!this.distractionLine) {
      this.distractionLine = this.randomChoice(this.distractionMessages);
    }
    message = this.distractionLine;
  } else if (this.isMoving) {
    message = this.sprite_message || (this.currentIntent && this.currentIntent.message ? this.currentIntent.message : this.ai.thoughts.needs[0].maslow[0].emotion);
  } else {
    message = this.sprite_message || "Thinking...";
  }

  var walletText = " ($" + this.ai.profile.wallet + ")";
  var fatigueText = " F:" + Math.round(this.ai.profile.fatigue);
  var intentText = this.currentIntent && this.currentIntent.type ? " [" + this.currentIntent.type + "]" : "";
  var fullText = message + intentText + walletText + fatigueText;

  var bubbleMaxWidth = 240;
  var padding = 12;

  if (!this.messageContainer) {
    this.messageContainer = this.game.add.group();
    this.messageBubble = this.game.add.graphics(0, 0);
    this.messageText = this.game.add.bitmapText(0, 0, 'smallfont', fullText, 18);
    this.messageText.maxWidth = bubbleMaxWidth;
    this.messageText.align = 'center';

    this.messageContainer.add(this.messageBubble);
    this.messageContainer.add(this.messageText);
  }

  if (this.lastMessage !== fullText) {
    this.messageText.text = fullText;

    var bubbleWidth = this.messageText.width + padding * 2;
    var bubbleHeight = this.messageText.height + padding * 2;

    this.messageBubble.clear();
    this.messageBubble.beginFill(0xffffff, 0.92);
    this.messageBubble.lineStyle(2, 0x000000, 0.8);
    this.messageBubble.drawRoundedRect(-bubbleWidth / 2, -bubbleHeight - padding, bubbleWidth, bubbleHeight, 10);
    this.messageBubble.endFill();

    // Small tail for a comic-style bubble
    this.messageBubble.beginFill(0xffffff, 0.92);
    this.messageBubble.lineStyle(2, 0x000000, 0.8);
    this.messageBubble.moveTo(-10, -padding);
    this.messageBubble.lineTo(0, 0);
    this.messageBubble.lineTo(10, -padding);
    this.messageBubble.endFill();

    this.messageText.x = -this.messageText.width / 2;
    this.messageText.y = -bubbleHeight - padding + padding;

    this.lastMessage = fullText;
  }

  this.messageContainer.x = this.centerX;
  this.messageContainer.y = this.y - this.height / 2;
};
Pedestrian.prototype.enterDistraction = function () {
  this.isDistracted = true;
  this.distractionLine = null;
  this.lastMessage = null;
  if (this.move_tween && this.move_tween.isRunning) {
    this.move_tween.stop();
  }
  if (this.isWalking()) {
    this.anim = this.anim.replace("-walk", "-wait");
    this.isMoving = false;
    this.movement();
  }
};

Pedestrian.prototype.exitDistraction = function () {
  this.isDistracted = false;
  this.distractionLine = null;
  this.lastMessage = null;
  if (this.isWaiting()) {
    this.anim = this.anim.replace("-wait", "-walk");
    this.check_animation();
  }
};

Pedestrian.prototype.updateDistractionState = function () {
  var player = this.game && this.game.player;
  if (!player || !player.body) {
    return;
  }

  var distanceToPlayer = Phaser.Math.distance(this.x, this.y, player.x, player.y);
  var playerIsFlyingUber = player.currentState === "uber" && !player.body.touching.down;
  var shouldDistract = playerIsFlyingUber && distanceToPlayer <= this.distractionRadius;

  if (shouldDistract && !this.isDistracted) {
    this.enterDistraction();
  } else if (!shouldDistract && this.isDistracted) {
    this.exitDistraction();
  }
};
Pedestrian.prototype.removePedestrian = function (next, sprite) {
  var arrival = sprite.ai.handleArrival(sprite.currentIntent);
  if (arrival && arrival.bubbleMessage) {
    sprite.sprite_message = arrival.bubbleMessage;
  }

  if (sprite.move_tween && sprite.move_tween.isRunning) {
    sprite.move_tween.stop();
  }
  sprite.animations.stop();
  sprite.isMoving = false;

  if (sprite.messageContainer) {
    sprite.messageContainer.destroy();
    sprite.messageContainer = null;
    sprite.messageText = null;
    sprite.messageBubble = null;
  }

  sprite.kill();

  var waitMs = arrival && arrival.waitMs ? arrival.waitMs : Phaser.Timer.SECOND * 4;
  sprite.game.time.events.add(waitMs, next, sprite);

};

Pedestrian.prototype.putBack = function () {
  var spawnPadding = 200;
  this.revive();

  this.currentIntent = this.ai.consumeDeferredIntent() || this.ai.chooseIntent();
  this.goal = this.currentIntent.goal;
  this.lastMessage = null;
  this.isDistracted = false;
  this.distractionLine = null;

  this.x = (this.goal < this.game.world.centerX) ?
    this.game.world.width + this.game.rnd.integerInRange(0, spawnPadding) :
    this.game.world.x - this.game.rnd.integerInRange(0, spawnPadding);

  this.y = this.game.world.height - 260;

  if (!this.isWalking()) {
    this.anim = this.anim.replace("-wait", "-walk");
  }

  this.direction = this.setDirection();
  this.check_animation();

};

Pedestrian.prototype.onSpriteHover = function (sprite, pointer) {




};






Pedestrian.prototype.setDirection = function () {
// console.log("set direction");
  if(this.goal < this.x){
    this.scale.x = -1;
    return "LEFT";
  }else{
    this.scale.x = 1;
    return "RIGHT";
  }


};








Pedestrian.prototype.randomChoice=function(choices){
  // console.log("random choice");
  var index =  Math.floor(Math.random() * choices.length);
  return choices[index];
};








Pedestrian.prototype.getNormalizedSpeed = function(return_speed) {
  return (Math.round((Phaser.Math.distance(this.x, this.y, this.goal, this.y) / return_speed) * 1000000));
};
Pedestrian.prototype.getSpeed = function(speed, vary) {
  // console.log("get speed");
  return this.getNormalizedSpeed(speed) + this.game.rnd.integerInRange(100, vary);

};







Pedestrian.prototype.brain = function() {

  if(this.isWalking() === true) {
    this.speed = this.getNormalizedSpeed(50000);
  }
  if(this.isWaiting() === true) {
    this.speed = 0;
  }

  // console.log("set animation: " + this.anim);

};





Pedestrian.prototype.isWaiting = function() {
  return this.anim.indexOf("-wait") !== -1;
};





Pedestrian.prototype.isWalking = function() {
  return this.anim.indexOf("-walk") !== -1;
};







Pedestrian.prototype.check_animation = function() {
  // console.log("check animation", this.anim.indexOf("-walk"));
  this.move_tween = this.game.add.tween(this);
  var delay = this.game.rnd.integerInRange(1000, 6000);
  this.brain();



  if(this.isWalking() === true){

    this.move_tween.to({ x: this.goal}, this.speed).delay(delay);
    this.move_tween.start();
    this.move_tween.onStart.add(function(){
        this.isMoving = true;
        this.movement();},
      this);

    this.move_tween.onComplete.add(function(){
        this.anim = this.anim.replace("-walk", "-wait");
        this.isMoving = false;
        this.movement();

      },
      this);
  }else{
    this.move_tween.stop();
    this.isMoving = false;
  }


};







Pedestrian.prototype.doWait = function () {

    // console.log("currently not waiting, starting wait animation");
    this.anim = this.anim.replace("-walk", "-wait");

    this.check_animation();
    this.removePedestrian(this.putBack, this);

};







Pedestrian.prototype.movement = function () {

// console.log("movement");
  this.direction = this.setDirection();
  this.animations.play(this.anim);
  this.loaded = true;
};







Pedestrian.prototype.goalAchieved = function () {
  return this.x === this.goal;
};







Pedestrian.prototype.update = function () {

  this.updateDistractionState();
  this.spriteMessage();

  if (this.isDistracted) {
    return;
  }

  this.ai.life();
  if(this.goalAchieved()){
    // console.log("arrived at goal");
    this.doWait();
  }else{
    if(this.isWaiting() === true){
      // console.log("not walking");
      this.currentIntent = this.ai.chooseIntent();
      this.goal = this.currentIntent.goal;
      this.sprite_message = this.currentIntent && this.currentIntent.message ? this.currentIntent.message : "";
      this.direction = this.setDirection();
      this.anim = this.anim.replace("-wait", "-walk");

      this.check_animation();
    }

  }




};



module.exports = Pedestrian;

},{"./Brain":7}],14:[function(require,module,exports){
var Economy = function (game) {
  this.game = game;
  this.rebalanceIntervalMs = 12000;
  this.timeSinceRebalance = 0;
  this.lastRebalanceAt = 0;
  this.cityInstability = 0;
  this.disruption = {};

  this.venueOrder = ['bank', 'bakery', 'cafe', 'library', 'bookstore'];
  this.needVenueMap = {
    WATER: 'cafe',
    FOOD: 'bakery',
    SECURITY: 'library',
    MONEY: 'bank',
    WARMTH: 'library',
    FRIENDSHIP: 'bank',
    INTIMACY: 'library',
    FAMILY: 'bank',
    CONFIDENCE: 'library',
    ART: 'bookstore',
    EDUCATION: 'library'
  };

  this.venues = {
    bank: this.createVenue('bank', {
      serviceCapacity: 4,
      tellerSlots: 4,
      basePrice: 1,
      wage: 16,
      staffCount: 3,
      inventoryMax: 0,
      restockUnitCost: 0,
      openingBalance: 450
    }),
    bakery: this.createVenue('bakery', {
      serviceCapacity: 7,
      seats: 6,
      basePrice: 6,
      wage: 11,
      staffCount: 2,
      inventoryMax: 36,
      inventory: 18,
      restockUnitCost: 2,
      openingBalance: 220
    }),
    cafe: this.createVenue('cafe', {
      serviceCapacity: 8,
      seats: 8,
      basePrice: 4,
      wage: 10,
      staffCount: 2,
      inventoryMax: 44,
      inventory: 22,
      restockUnitCost: 2,
      openingBalance: 220
    }),
    library: this.createVenue('library', {
      serviceCapacity: 9,
      seats: 12,
      basePrice: 3,
      wage: 9,
      staffCount: 2,
      inventoryMax: 22,
      inventory: 16,
      restockUnitCost: 1,
      openingBalance: 260
    }),
    bookstore: this.createVenue('bookstore', {
      serviceCapacity: 5,
      seats: 4,
      basePrice: 8,
      wage: 10,
      staffCount: 2,
      inventoryMax: 28,
      inventory: 12,
      restockUnitCost: 3,
      openingBalance: 240
    })
  };
};

Economy.prototype.createVenue = function (key, options) {
  var venue = {
    key: key,
    open: true,
    serviceCapacity: options.serviceCapacity || 1,
    tellerSlots: options.tellerSlots || 0,
    seats: options.seats || 0,
    inventoryMax: options.inventoryMax || 0,
    inventory: options.inventory || 0,
    basePrice: options.basePrice || 1,
    dynamicPrice: options.basePrice || 1,
    restockUnitCost: options.restockUnitCost || 0,
    wage: options.wage || 0,
    staffCount: options.staffCount || 1,
    balance: options.openingBalance || 0,
    demandPressure: 0,
    cycleRequests: 0,
    cycleServed: 0,
    cycleFailures: 0,
    accounting: {
      revenue: 0,
      expenses: 0,
      payroll: 0,
      restock: 0,
      transactions: 0,
      failedRequests: 0
    }
  };
  venue.dynamicPrice = this.computeDynamicPrice(venue);
  return venue;
};


Economy.prototype.applyDisruptionSnapshot = function (venueStatus, instability) {
  this.disruption = venueStatus || {};
  this.cityInstability = Math.max(0, instability || 0);
};

Economy.prototype.getDisruptionForVenue = function (venueKey) {
  return this.disruption && this.disruption[venueKey] ? this.disruption[venueKey] : null;
};

Economy.prototype.isVenueClosedForDisruption = function (venueKey) {
  var disruption = this.getDisruptionForVenue(venueKey);
  return !!(disruption && disruption.state === 'destroyed');
};

Economy.prototype.getOperationalCapacity = function (venue) {
  var disruption = this.getDisruptionForVenue(venue.key);
  var multiplier = disruption && disruption.capacityModifier !== undefined ? disruption.capacityModifier : 1;
  return Math.max(0, Math.floor(venue.serviceCapacity * multiplier));
};

Economy.prototype.getOperationalInventory = function (venue) {
  var disruption = this.getDisruptionForVenue(venue.key);
  var multiplier = disruption && disruption.inventoryModifier !== undefined ? disruption.inventoryModifier : 1;
  return Math.max(0, Math.floor(venue.inventory * multiplier));
};

Economy.prototype.resolveVenueForIntent = function (intent) {
  if (!intent) {
    return null;
  }
  if (intent.door && this.venues[intent.door]) {
    return intent.door;
  }
  if (intent.need && this.needVenueMap[intent.need]) {
    return this.needVenueMap[intent.need];
  }
  return null;
};

Economy.prototype.computeDynamicPrice = function (venue) {
  var shortageRatio = 0;
  if (venue.inventoryMax > 0) {
    shortageRatio = 1 - (venue.inventory / venue.inventoryMax);
    shortageRatio = Math.max(0, Math.min(1, shortageRatio));
  }
  var pressure = Math.max(0, Math.min(2, venue.demandPressure));
  var disruptionTax = this.cityInstability * 0.35;
  var multiplier = 1 + (shortageRatio * 0.8) + (pressure * 0.45) + disruptionTax;
  var minPrice = venue.basePrice * 0.6;
  var maxPrice = venue.basePrice * 2.5;
  return Math.max(minPrice, Math.min(maxPrice, venue.basePrice * multiplier));
};

Economy.prototype.hasCapacity = function (venue) {
  return venue.cycleRequests <= this.getOperationalCapacity(venue);
};

Economy.prototype.hasInventory = function (venue, intent) {
  if (!intent || intent.type !== 'FULFILL_NEED') {
    return true;
  }
  if (venue.inventoryMax <= 0) {
    return true;
  }
  return this.getOperationalInventory(venue) > 0;
};

Economy.prototype.requestService = function (intent, actorProfile) {
  var venueKey = this.resolveVenueForIntent(intent);
  var quote = {
    ok: false,
    venue: venueKey,
    price: 0,
    reason: 'no_venue',
    capacity: 0,
    inventory: 0,
    open: false
  };

  if (!venueKey || !this.venues[venueKey]) {
    return quote;
  }

  var venue = this.venues[venueKey];
  venue.cycleRequests += 1;
  venue.dynamicPrice = this.computeDynamicPrice(venue);

  quote.capacity = Math.max(0, this.getOperationalCapacity(venue) - venue.cycleRequests);
  quote.inventory = this.getOperationalInventory(venue);
  var disruption = this.getDisruptionForVenue(venueKey);
  quote.open = venue.open && !(disruption && disruption.state === 'destroyed');
  quote.price = Math.ceil(venue.dynamicPrice);

  if (!quote.open) {
    venue.cycleFailures += 1;
    venue.accounting.failedRequests += 1;
    quote.reason = 'closed';
    return quote;
  }

  if (!this.hasCapacity(venue)) {
    venue.cycleFailures += 1;
    venue.accounting.failedRequests += 1;
    quote.reason = 'capacity';
    return quote;
  }

  if (!this.hasInventory(venue, intent)) {
    venue.cycleFailures += 1;
    venue.accounting.failedRequests += 1;
    quote.reason = 'stock';
    return quote;
  }

  if (intent && intent.type === 'WORK') {
    quote.price = venue.wage;
  }

  quote.ok = true;
  quote.reason = 'ok';
  return quote;
};

Economy.prototype.applyRevenue = function (venue, amount) {
  venue.balance += amount;
  venue.accounting.revenue += amount;
};

Economy.prototype.applyExpense = function (venue, amount, expenseType) {
  venue.balance -= amount;
  venue.accounting.expenses += amount;
  if (expenseType && venue.accounting[expenseType] !== undefined) {
    venue.accounting[expenseType] += amount;
  }
};

Economy.prototype.registerUnmetNeed = function (needName, pressure) {
  var venueKey = this.needVenueMap[needName];
  if (!venueKey || !this.venues[venueKey]) {
    return;
  }
  var venue = this.venues[venueKey];
  venue.demandPressure = Math.min(2.5, venue.demandPressure + (pressure || 0.25));
};

Economy.prototype.settleTransaction = function (intent, actorProfile) {
  var outcome = {
    ok: false,
    walletDelta: 0,
    venue: null,
    reason: 'no_transaction',
    price: 0
  };

  if (!intent) {
    return outcome;
  }

  if (intent.type === 'REST') {
    outcome.ok = true;
    outcome.reason = 'rested';
    return outcome;
  }

  var venueKey = this.resolveVenueForIntent(intent);
  if (!venueKey || !this.venues[venueKey]) {
    outcome.reason = 'no_venue';
    return outcome;
  }

  var venue = this.venues[venueKey];
  var quote = intent.quote || this.requestService(intent, actorProfile);
  outcome.venue = venueKey;
  outcome.price = quote.price || 0;

  if (!quote.ok) {
    outcome.reason = quote.reason;
    return outcome;
  }

  if (intent.type === 'WORK') {
    var wage = Math.max(1, quote.price || venue.wage);
    outcome.ok = true;
    outcome.walletDelta = wage;
    outcome.reason = 'paid';

    this.applyExpense(venue, wage, 'payroll');
    venue.cycleServed += 1;
    venue.accounting.transactions += 1;
    return outcome;
  }

  var price = Math.max(0, quote.price || Math.ceil(venue.dynamicPrice));
  if (!actorProfile || actorProfile.wallet < price) {
    venue.cycleFailures += 1;
    venue.accounting.failedRequests += 1;
    outcome.reason = 'insufficient_funds';
    outcome.price = price;
    return outcome;
  }

  if (!this.hasInventory(venue, intent)) {
    venue.cycleFailures += 1;
    venue.accounting.failedRequests += 1;
    outcome.reason = 'stock';
    return outcome;
  }

  outcome.ok = true;
  outcome.walletDelta = -price;
  outcome.reason = 'served';
  outcome.price = price;

  if (venue.inventoryMax > 0) {
    venue.inventory = Math.max(0, venue.inventory - 1);
  }

  this.applyRevenue(venue, price);
  venue.cycleServed += 1;
  venue.accounting.transactions += 1;

  return outcome;
};

Economy.prototype.rebalanceVenue = function (venue) {
  var shortageRatio = 0;
  if (venue.inventoryMax > 0) {
    shortageRatio = 1 - (venue.inventory / venue.inventoryMax);
  }

  var demandSignal = 0;
  if (venue.cycleRequests > 0) {
    demandSignal = (venue.cycleRequests - venue.cycleServed) / venue.cycleRequests;
  }

  venue.demandPressure = (venue.demandPressure * 0.6) + (Math.max(0, demandSignal) * 0.8);

  if (venue.inventoryMax > 0) {
    var target = Math.ceil(venue.inventoryMax * 0.65);
    if (shortageRatio > 0.45) {
      target = Math.ceil(venue.inventoryMax * 0.85);
    }
    var deficit = Math.max(0, target - venue.inventory);
    if (deficit > 0) {
      var restockAmount = Math.max(1, Math.min(deficit, Math.ceil(venue.serviceCapacity + venue.demandPressure * 4)));
      var restockCost = restockAmount * venue.restockUnitCost;
      venue.inventory = Math.min(venue.inventoryMax, venue.inventory + restockAmount);
      this.applyExpense(venue, restockCost, 'restock');
    }
  }

  var baselinePayroll = Math.ceil(venue.wage * venue.staffCount * 0.35);
  if (baselinePayroll > 0) {
    this.applyExpense(venue, baselinePayroll, 'payroll');
  }

  var disruption = this.getDisruptionForVenue(venue.key);
  var disruptionClosed = disruption && disruption.state === 'destroyed';

  if (venue.balance < -120 && venue.inventoryMax > 0) {
    venue.open = false;
  } else if (venue.balance > -30 && !disruptionClosed) {
    venue.open = true;
  }

  var shortageStress = Math.max(0, shortageRatio - 0.2) * 1.8;
  var disruptionStress = this.cityInstability * 0.5 + (disruption && disruption.state !== 'stable' ? 0.25 : 0);
  var wageTarget = venue.wage * (1 + shortageStress + disruptionStress);
  venue.wage = Math.max(5, Math.min(45, Math.floor((venue.wage * 0.75) + (wageTarget * 0.25))));

  venue.dynamicPrice = this.computeDynamicPrice(venue);
  venue.cycleRequests = 0;
  venue.cycleServed = 0;
  venue.cycleFailures = 0;
};

Economy.prototype.rebalance = function () {
  for (var i = 0; i < this.venueOrder.length; i++) {
    var key = this.venueOrder[i];
    this.rebalanceVenue(this.venues[key]);
  }
  this.lastRebalanceAt = this.game.time.now;
};

Economy.prototype.update = function (deltaMs) {
  this.timeSinceRebalance += deltaMs || 16;
  if (this.timeSinceRebalance >= this.rebalanceIntervalMs) {
    this.timeSinceRebalance = 0;
    this.rebalance();
  }
};

Economy.prototype.getVenueSnapshot = function (key) {
  var venue = this.venues[key];
  if (!venue) {
    return null;
  }
  return {
    open: venue.open,
    inventory: venue.inventory,
    inventoryMax: venue.inventoryMax,
    capacity: venue.serviceCapacity,
    demandPressure: venue.demandPressure,
    price: Math.ceil(venue.dynamicPrice),
    accounting: venue.accounting,
    balance: venue.balance,
    seats: venue.seats,
    tellerSlots: venue.tellerSlots,
    operationalCapacity: this.getOperationalCapacity(venue),
    operationalInventory: this.getOperationalInventory(venue),
    instability: this.cityInstability,
    disruption: this.getDisruptionForVenue(key)
  };
};

module.exports = Economy;

},{}]},{},[5]);

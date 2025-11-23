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
    this.city.update();

  },
  render: function () {

  }

};

module.exports = Uberman.Game;
},{"./prefabs/Car":7,"./prefabs/City":8,"./prefabs/DayCycle":9,"./prefabs/Hero":10,"./prefabs/Hud":11,"./prefabs/Pedestrian":12}],3:[function(require,module,exports){
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

    // BUILDING 1
    this.game.load.image('floor_1', 'images/buildings/building1_floor.gif', 428, 25);
    this.game.load.image('ground_1', 'images/buildings/building1_ground.gif', 428, 98);
    this.game.load.image('top_1', 'images/buildings/building1_top.gif', 428, 34);
    // BUILDING 2
    this.game.load.image('floor_2', 'images/buildings/building2_floor.gif', 273, 52);
    this.game.load.image('ground_2', 'images/buildings/building2_ground.gif', 273, 41);
    this.game.load.image('top_2', 'images/buildings/building2_top.gif', 273, 78);
    // BUILDING 3
    this.game.load.image('floor_3', 'images/buildings/building3_floor.gif', 301, 136);
    this.game.load.image('ground_3', 'images/buildings/building3_ground.gif', 301, 50);
    this.game.load.image('top_3', 'images/buildings/building3_top.gif', 301, 111);
// BUILDING 4
    this.game.load.image('floor_4', 'images/buildings/building4_floor.gif', 501, 52);
    this.game.load.image('ground_4', 'images/buildings/building4_ground.gif', 501, 85);
    this.game.load.image('top_4', 'images/buildings/building4_top.gif', 501, 166);

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

BRAIN = function (game) {
  this.game = game;
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
    personality: personality
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
    var cost = this.getNeedCost(data.need);
    return cost ? thought + ' ($' + cost + ')' : thought;
  }
  return data && data.emotion ? data.emotion : 'On the move';
};

BRAIN.prototype.getWeight= function (x,y,i) {
  return ( (y*(i+1)-y*(i))/(x*(i+1)-x*(i)) - (y*(i)-y*(i-1))/(x*(i)-x*(i-1))/(x*(i+1)-x*(i-1)));
};

BRAIN.prototype.life = function () {
  for ( var i = 0; i < this.thoughts.needs.length; i++) {
    var needs = this.thoughts.needs[i];
    for(var j = 0; j< needs.maslow.length;j++){
      needs.maslow[j].value += 0.01;
      needs.maslow[j].weight = this.getWeight(needs.maslow[j].baseWeight,needs.maslow[j].value,i);
    }
  }
  this.profile.fatigue = Math.min(100, this.profile.fatigue + 0.05);
  if (this.profile.wallet < 10) {
    var moneyNeed = this.findNeedByName('MONEY');
    if (moneyNeed) {
      moneyNeed.value += 0.5;
      moneyNeed.weight += 0.2;
    }
  }
  if (this.getCurrentHour() > 21 || this.getCurrentHour() < 6) {
    var warmthNeed = this.findNeedByName('WARMTH');
    if (warmthNeed) {
      warmthNeed.weight += 0.05;
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
    return workIntent;
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
    return brokeIntent;
  }
  var doorKey = topNeed.acts[0].toLowerCase();
  var intent = this.buildIntent('FULFILL_NEED', doorKey, this.game.world.centerX, topNeed.emotion, topNeed.need);
  intent.message = this.describeIntent('FULFILL_NEED', { need: topNeed.need, emotion: topNeed.emotion });
  return intent;
};

BRAIN.prototype.resolveIntent = function (intent) {
  if (!intent) {
    return;
  }
  if (intent.type === 'WORK') {
    this.profile.wallet += this.profile.income;
    var moneyNeed = this.findNeedByName('MONEY');
    if (moneyNeed) {
      moneyNeed.value = 0;
    }
    this.profile.fatigue = Math.min(100, this.profile.fatigue + 5);
  }

  if (intent.type === 'FULFILL_NEED' && intent.need) {
    var need = this.findNeedByName(intent.need);
    if (need) {
      need.value = 0;
      var cost = this.getNeedCost(intent.need);
      this.profile.wallet = Math.max(0, this.profile.wallet - cost);
      this.profile.fatigue = Math.max(0, this.profile.fatigue - 2);
    }
  }

  if (intent.type === 'REST') {
    var securityNeed = this.findNeedByName('SECURITY');
    if (securityNeed) {
      securityNeed.value = Math.max(0, securityNeed.value - 10);
    }
    this.profile.fatigue = Math.max(0, this.profile.fatigue - 25);
  }
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

},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){

CITY = function (game,  x, y) {
  Phaser.Sprite.call(this, game, x, y, '', 0);
  this.game = game;
  this.buildings = this.game.add.group();
  this.game.doors = {};
  //if (this.game.development === true){
   this.game.fade = {};
  //  this.game.back = {};
   //this.game.fore = {};
  //}else{
   // this.game.fade = this.game.add.sprite(this.game.world.centerX - (4267 / 2), this.game.world.height - 2000, 'city_fade');


  //}




  this.building_data = [
    {"building":1, "ground":37, "floor":25, "top":34, "earth":270, "max_height":40},
    {"building":2, "ground":0, "floor":52, "top":78, "earth":250, "max_height":45},
    {"building":3, "ground":0, "floor":136, "top":111, "earth":260, "max_height":20},
    {"building":4, "ground":0, "floor":52, "top":166, "earth":295, "max_height":20}
  ];
  //this.addRandomBuildings();
  this.addOrderedBuildings();
  this.addBank();
  this.addLibrary();
  this.addBakery();
  this.addCafe();
  this.addBookstore();

  //console.log(this.buildings);
  this.addBuildingsToGame();


};

CITY.prototype = Object.create(Phaser.Sprite.prototype);
CITY.prototype.constructor = CITY;

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

  for(var bcount = 0;bcount<this.buildings.children.length;bcount++){
    var sprite = this.buildings.children[bcount];
    var type = sprite instanceof Phaser.Group;

    if(type === false){
      sprite.exists = true;
      sprite.x = startX;
      this.game.doors[sprite.key] = this.game.add.sprite(sprite.centerX, sprite.y+sprite.height-40, 'door');
      this.game.doors[sprite.key].anchor.setTo(0.5,0.5);

      //var building = sprite.game.add.existing(sprite);
      buildingWidth = sprite.width;
      counter += 1;
    }else{

      var nextY = sprite.game.world.height-270;
      var heightCount = 0;

      for(var gcount = 0;gcount<sprite.children.length;gcount++){
        var deepSprite = sprite.children[gcount];

        var data = deepSprite.key.split("_");
        var level = data[0];
        var level_data;
        var building_num = data[1];
        deepSprite.exists = true;
        deepSprite.x = startX;


          for(var i=0;i<building_data.length;i++){
            var building_level = building_data[i];

            if(building_level.building === parseInt(building_num)){
              level_data = building_level;
              break;

            }
          }

        switch(level){
          case "ground":
            nextY = sprite.game.world.height - (level_data.earth + level_data.ground);
            break;
          case "floor":
            nextY = (sprite.game.world.height - (level_data.earth + level_data.ground + (level_data.floor * heightCount)));
            break;
          case "top":
            nextY = (sprite.game.world.height - (level_data.earth + level_data.ground + (level_data.floor * (heightCount-1)))-(level_data.top));
            break;
        }

        deepSprite.y = nextY;

        buildingWidth = deepSprite.width;
        counter+=1;
        heightCount+=1;
      }


    }

    startX = startX + buildingWidth+sprite.game.rnd.integerInRange(0, 15);
  }
};


CITY.prototype.addLibrary = function() {
  this.buildings.create(0, this.game.world.height - 440, "library", 0,false);
};
CITY.prototype.addBakery = function(){
  this.buildings.create(0, this.game.world.height - 495, "bakery", 0,false);

};
CITY.prototype.addCafe = function(){
  this.buildings.create(0, this.game.world.height - 495, "cafe", 0,false);

};
CITY.prototype.addBookstore = function(){
  this.buildings.create(0, this.game.world.height - 495, "bookstore", 0,false);

};

CITY.prototype.addBank = function() {
  this.buildings.create(0, this.game.world.height - 488, "bank", 0,false);
};

CITY.prototype.addRandomBuildings = function() {
  for (var i = 0; i < this.game.rnd.integerInRange(10, 100); i++) {
    var building = this.building_data[this.game.rnd.integerInRange(0, this.building_data.length - 1)];
    var created_building = this.createBuilding(
      ["ground_" + building.building, building.ground],
      ["floor_" + building.building, building.floor],
      ["top_" + building.building, building.top],
      building.earth, building.max_height);
  }
};

CITY.prototype.addOrderedBuildings = function() {
  var modifier = 15;
  for (var i = 0; i < this.building_data.length; i++) {

    var building = this.building_data[i];

    var building_added = this.createBuilding(
      ["ground_" + building.building, building.ground],
      ["floor_" + building.building, building.floor],
      ["top_" + building.building, building.top], building.max_height);
    //console.log(building_added);
    this.buildings.add(building_added);
  }
};







CITY.prototype.createBuilding = function(ground, floor, top, max_height) {

  var height = this.game.rnd.integerInRange(10, max_height);

  var floored_building = this.game.add.group();

  floored_building.create(0, 0, ground[0], 0,false);

  for (var i = 0; i <height; i++) {

    floored_building.create(0, 0, floor[0], 0,false);
  }

  floored_building.create(0, 0, top[0], 0,false);

  return floored_building;
};


CITY.prototype.animateDamage = function() {

};
CITY.prototype.update = function() {

  this.game.back.x -= this.game.player.body.velocity.x * (0.001);
  this.game.fade.x -= this.game.player.body.velocity.x * (0.0005);

  this.game.back.y -= this.game.player.body.velocity.y * (0.001);
  this.game.fade.y -= this.game.player.body.velocity.y * (0.0005);

};

module.exports = CITY;
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){

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
},{}],12:[function(require,module,exports){
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

  this.check_animation();
  this.movement();




};

Pedestrian.prototype = Object.create(Phaser.Sprite.prototype);

Pedestrian.prototype.constructor = Pedestrian;








Pedestrian.prototype.spriteMessage = function () {
  if (this.messageContainer) {
    this.messageContainer.destroy();
  }

  if (!this.visible) {
    return;
  }

  var message = "";
  if (this.isMoving) {
    message = this.currentIntent && this.currentIntent.message ? this.currentIntent.message : this.ai.thoughts.needs[0].maslow[0].emotion;
  } else {
    message = "Thinking...";
  }

  var walletText = " ($" + this.ai.profile.wallet + ")";
  var fatigueText = " F:" + Math.round(this.ai.profile.fatigue);
  var intentText = this.currentIntent && this.currentIntent.type ? " [" + this.currentIntent.type + "]" : "";
  var fullText = message + intentText + walletText + fatigueText;

  var container = this.game.add.group();
  var bubbleMaxWidth = 240;
  var padding = 12;

  var text = this.game.add.bitmapText(0, 0, 'smallfont', fullText, 18);
  text.maxWidth = bubbleMaxWidth;
  text.align = 'center';

  var bubbleWidth = text.width + padding * 2;
  var bubbleHeight = text.height + padding * 2;

  var bubble = this.game.add.graphics(0, 0);
  bubble.beginFill(0xffffff, 0.92);
  bubble.lineStyle(2, 0x000000, 0.8);
  bubble.drawRoundedRect(-bubbleWidth / 2, -bubbleHeight - padding, bubbleWidth, bubbleHeight, 10);
  bubble.endFill();

  // Small tail for a comic-style bubble
  bubble.beginFill(0xffffff, 0.92);
  bubble.lineStyle(2, 0x000000, 0.8);
  bubble.moveTo(-10, -padding);
  bubble.lineTo(0, 0);
  bubble.lineTo(10, -padding);
  bubble.endFill();

  text.x = -text.width / 2;
  text.y = -bubbleHeight - padding + padding;

  container.add(bubble);
  container.add(text);

  container.x = this.centerX;
  container.y = this.y - this.height / 2;

  this.messageContainer = container;
};
Pedestrian.prototype.removePedestrian = function (next, sprite) {
  sprite.visible = false;
  sprite.ai.resolveIntent(sprite.currentIntent);
  var timer = sprite.game.time.events.add(Phaser.Timer.SECOND*4, next, sprite);

};

Pedestrian.prototype.putBack = function () {
  this.visible = true;
  this.currentIntent = this.ai.chooseIntent();
  this.goal = this.currentIntent.goal;

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

  this.spriteMessage();
  this.ai.life();
  if(this.goalAchieved()){
    // console.log("arrived at goal");
    this.doWait();
  }else{
    if(this.isWaiting() === true){
      // console.log("not walking");
      this.currentIntent = this.ai.chooseIntent();
      this.goal = this.currentIntent.goal;
      this.direction = this.setDirection();
      this.anim = this.anim.replace("-wait", "-walk");

      this.check_animation();
    }

  }




};



module.exports = Pedestrian;

},{"./Brain":6}]},{},[5]);

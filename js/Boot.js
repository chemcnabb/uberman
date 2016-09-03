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


//http://kvazars.com/littera/
    this.game.load.bitmapFont('font', 'font/font.png', 'font/font.xml');
    this.game.load.bitmapFont('smallfont', 'font/small_font.png', 'font/small_font.xml');

    //this.game.load.image('platform', 'sprites/platform.png');
    this.game.load.image('ground', 'images/ground.gif', 4267, 10);
    this.game.load.image('city_foreground', 'images/city_foreground.gif', 4267, 2133);
    this.game.load.image('city_background', 'images/city_background.gif', 4267, 2133);
    this.game.load.image('cape_streak', 'images/cape_streak.png');
    this.game.load.image('sun', 'images/sun.png');
    this.game.load.image('moon', 'images/moon.png');
    this.game.load.spritesheet('hero', 'images/uber_sprite.gif', 55, 110, 16);
    this.game.load.image('car', 'images/car.gif', 300, 95);
    this.game.load.image('car2', 'images/car2.gif', 270, 81);


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


    this.car = this.game.add.sprite(this.game.world.x-300, this.game.world.height-180, 'car');
    this.car2 = this.game.add.sprite(this.game.world.width+270, this.game.world.height-120, 'car2');
    this.game.physics.enable(this.car, Phaser.Physics.ARCADE);
    this.game.physics.enable(this.car2, Phaser.Physics.ARCADE);
    var car_tween = this.game.add.tween(this.car);
    var car_tween2 = this.game.add.tween(this.car2);

    car_tween.to({ x: this.game.world.width+this.car.width}, 6000).loop(true);
    car_tween2.to({ x: this.game.world.x-this.car.width}, 6000).loop(true);
    car_tween.delay(this.game.rnd.integerInRange(100,10000));
    car_tween2.delay(this.game.rnd.integerInRange(100,10000));
    car_tween.start();
    car_tween2.start();

    cursors = this.game.input.keyboard.createCursorKeys();


  },


  update: function () {


    this.game.physics.arcade.collide(this.player, platforms);

  },
  render: function () {

  }

};

module.exports = Uberman.Boot;
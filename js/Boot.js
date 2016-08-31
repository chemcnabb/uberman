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



    back = this.game.add.sprite(this.game.world.centerX-(4267/2), this.game.world.height-2133, 'city_background');
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
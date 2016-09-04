var Uberman = {};

Hero = require('./prefabs/Hero');
DayCycle = require('./prefabs/DayCycle');
Car = require('./prefabs/Car');


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
    this.game.load.image('door', 'images/door.gif', 70, 80);
    this.game.load.image('orbit', 'images/orbit.png', 4267, 894);
    this.game.load.image('ground', 'images/ground.gif', 4267, 10);
    this.game.load.image('city_foreground', 'images/city_foreground.gif', 4267, 2133);
    this.game.load.image('city_background', 'images/city_background.gif', 4267, 2133);
    this.game.load.image('city_fade', 'images/city_fade_background.gif', 4267, 2133);
    this.game.load.image('cape_streak', 'images/cape_streak.png');
    this.game.load.image('sun', 'images/sun.png');
    this.game.load.image('moon', 'images/moon.png');
    this.game.load.spritesheet('hero', 'images/uber_sprite.gif', 55, 110, 17);
    this.game.load.image('car', 'images/car.gif', 300, 95);
    this.game.load.image('car2', 'images/car2.gif', 270, 81);
    this.game.load.audio('driveby', 'images/car.mp3');


  },


  create: function () {


    //this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.stage.backgroundColor = '#000';





    this.game.world.setBounds(0, 0, 4267, 8192);
    dayCycle = new DayCycle(this.game, 60000*5);


    var bgBitMap = this.game.add.bitmapData(this.game.world.width, this.game.world.height);


    //bgBitMap.ctx.rect(0, 0, this.game.world.width, this.game.world.height);
    //bgBitMap.ctx.fillStyle = '#85b5e1';
    //bgBitMap.ctx.fill();
    //
    //var backgroundSprite = this.game.add.sprite(0,0, bgBitMap);


    var myBitmap = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
    var grd=myBitmap.context.createLinearGradient(0,0,0,this.game.world.height);
    grd.addColorStop(0,"black");
    grd.addColorStop(1,"#85b5e1");
    myBitmap.context.fillStyle=grd;
    myBitmap.context.fillRect(0,0,this.game.world.width, this.game.world.height);
    grd=myBitmap.context.createLinearGradient(0,580,0,this.game.world.height);
    grd.addColorStop(0,"black");
    grd.addColorStop(1,"#85b5e1");
    myBitmap.context.fillStyle=grd;
    myBitmap.context.fillRect(0,this.game.world.height, this.game.world.width,20);
    var backgroundSprite = this.game.add.sprite(0, 0, myBitmap);






    platforms = this.game.add.group();
    platforms.enableBody = true;

    var ground = platforms.create(0, this.game.world.height - 209, 'ground');
    ground.scale.setTo(2, 2);
    this.game.physics.enable(ground);

    ground.body.immovable = true;


    sunSprite = this.game.add.sprite(this.game.world.width - (this.game.world.width / 2), this.game.world.height/2, 'sun');
    moonSprite = this.game.add.sprite(this.game.world.width - (this.game.world.width / 2), this.game.world.height, 'moon');



    orbit = this.game.add.sprite(this.game.world.centerX-(4267/2), 1835, 'orbit');
    fade = this.game.add.sprite(this.game.world.centerX-(4267/2), this.game.world.height-3000, 'city_fade');
    back = this.game.add.sprite(this.game.world.centerX-(4267/2), this.game.world.height-2100, 'city_background');
    fore = this.game.add.sprite(this.game.world.centerX-(4267/2), this.game.world.height-2133, 'city_foreground');

    var backgroundSprites = [
      {sprite: backgroundSprite, from: 0x1f2a27, to: 0xB2DDC8},
      {sprite: fade, from: 0x1f2a27, to: 0xB2DDC8},
      {sprite: back, from: 0x1f2a27, to: 0xB2DDC8},
      {sprite: fore, from: 0x2f403b, to: 0x96CCBB}
    ];

    dayCycle.initShading(backgroundSprites);
    dayCycle.initSun(sunSprite);
    dayCycle.initMoon(moonSprite);



    this.player = new Hero(this.game, this.game.world.centerX, this.game.world.height-260, this.game.world.height/2);

    door = this.game.add.sprite(3751, 7902, 'door');
    this.game.add.existing(this.player);


    this.car = new Car(this.game, this.game.world.x-300, this.game.world.height-180, 'car', "RIGHT");
    this.car4 = new Car(this.game, this.game.world.x-300, this.game.world.height-180, 'car2', "RIGHT");
    this.car2 = new Car(this.game, this.game.world.width+270, this.game.world.height-120, 'car2', "LEFT");
    this.car3 = new Car(this.game, this.game.world.width+270, this.game.world.height-120, 'car', "LEFT");

    this.game.add.existing(this.car);
    this.game.add.existing(this.car4);
    this.game.add.existing(this.car2);
    this.game.add.existing(this.car3);




    cursors = this.game.input.keyboard.createCursorKeys();


  },

  update: function () {


    this.game.physics.arcade.collide(this.player, platforms);

  },
  render: function () {

  }

};

module.exports = Uberman.Boot;
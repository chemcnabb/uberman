var Uberman = Uberman || {};

Hero = require('./prefabs/Hero');
DayCycle = require('./prefabs/DayCycle');
Car = require('./prefabs/Car');
Hud = require('./prefabs/Hud');


Uberman.Game = function (game) {
  var player;
  var platforms;
  var cursors;
  var jumpButton;
};

Uberman.Game.prototype = {


  preload: function () {


//http://kvazars.com/littera/



  },


  create: function () {

    console.log("GAME");
    dayCycle = new DayCycle(this.game, 60000*5);


    var bgBitMap = this.game.add.bitmapData(this.game.world.width, this.game.world.height);

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



    this.game.player = new Hero(this.game, this.game.world.centerX, this.game.world.height-260, this.game.world.height/2);

    this.game.door = this.game.add.sprite(3785, 7942, 'door');

    this.game.physics.arcade.enable(this.game.door);
    this.game.door.anchor.setTo(0.5, 0.5);

    this.game.add.existing(this.game.player);


    this.car = new Car(this.game, this.game.world.x-300, this.game.world.height-180, 'car', "RIGHT");
    this.car4 = new Car(this.game, this.game.world.x-300, this.game.world.height-180, 'car2', "RIGHT");
    this.car2 = new Car(this.game, this.game.world.width+270, this.game.world.height-120, 'car2', "LEFT");
    this.car3 = new Car(this.game, this.game.world.width+270, this.game.world.height-120, 'car', "LEFT");

    this.game.add.existing(this.car);
    this.game.add.existing(this.car4);
    this.game.add.existing(this.car2);
    this.game.add.existing(this.car3);

    this.game.health = new Hud(this.game);
    this.game.add.existing(this.game.health);

    cursors = this.game.input.keyboard.createCursorKeys();


  },

  update: function () {


    this.game.physics.arcade.collide(this.game.player, platforms);

  },
  render: function () {

  }

};

module.exports = Uberman.Game;
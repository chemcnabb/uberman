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
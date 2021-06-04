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
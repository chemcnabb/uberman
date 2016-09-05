var Uberman = Uberman || {};


Uberman.Preloader = function (Uberman) {

};

Uberman.Preloader.prototype = {


  preload: function () {

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
    this.game.load.image('uber_disk', 'images/UBER_DISK.png', 138,138);
    this.game.load.image('alter_disk', 'images/ALTER_DISK.png', 138,138);

  },


  create: function () {
    console.log("PRELOADER");
    this.game.state.start("Game");


  },


  update: function () {


  },

  render: function () {

  }

};

module.exports = Uberman.Preloader;
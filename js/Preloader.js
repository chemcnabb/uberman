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

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
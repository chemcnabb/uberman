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
  this.car_tween.to({ x: goal}, 6000).loop(true);

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
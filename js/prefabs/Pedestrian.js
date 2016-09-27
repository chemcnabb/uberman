var Brain = require('./Brain');

Pedestrian = function (game, y, sprite) {
  Phaser.Sprite.call(this, game, game.rnd.integerInRange(-200, game.world.width+200), y, sprite, 0);

  this.anchor.setTo(0.5, 0.5);
  //this.goal = game.world.centerX;
  //this.goal = this.setGoal();

  this.frame = 0;
  this.frames = [];
  this.pedestrian_array = ["oldman-wait","businessman-wait", "delivery-wait","boy-wait", "slick-wait", "hapgood-wait", "foreign-wait"];
  this.visible = true;

  this.ai = new Brain(game);

  this.direction = this.setDirection();
  this.sprite_message = "";

  this.animations.add("oldman-wait", [14], 6, true);
  this.animations.add("oldman-walk", [0, 1, 2, 3, 4, 5], 6, true);
  this.animations.add("businessman-walk", [6, 7, 8, 9], 6, true);
  this.animations.add("businessman-wait", [10, 11, 12, 13], 6, true);
  this.animations.add("delivery-wait", [21], 6, true);
  this.animations.add("delivery-walk", [15,16,17,18,19,20], 6, true);
  this.animations.add("boy-walk", [22, 23, 24, 25, 26, 27], 6, true);
  this.animations.add("boy-wait", [28], 6, true);
  this.animations.add("slick-walk", [29, 30, 31, 32, 33, 34,35,36,37], 9, true);
  this.animations.add("slick-wait", [38], 6, true);
  this.animations.add("hapgood-walk", [39, 40, 41, 42, 43, 44,45,46,47, 48, 49, 50], 12, true);
  this.animations.add("hapgood-wait", [51,52,53,54], 6, true);

  this.animations.add("foreign-walk", [55,56,57,58,59,60], 6, true);
  this.animations.add("foreign-wait", [61], 6, true);



  this.anim = this.randomChoice(this.pedestrian_array);

  this.check_animation();
  this.movement();




};

Pedestrian.prototype = Object.create(Phaser.Sprite.prototype);

Pedestrian.prototype.constructor = Pedestrian;








Pedestrian.prototype.spriteMessage = function () {
  if(this.sprite_message){
    this.sprite_message.destroy();
  }
  if(this.visible){
    var message = "";
    console.log(this.isMoving);
    if(this.isMoving){
      message = this.ai.thoughts.needs[0].maslow[0].emotion;
    }else{
      message = "Thinking...";
    }

    this.sprite_message = this.game.add.bitmapText(this.centerX, this.y - this.height / 2, 'smallfont', message, 18);
    this.sprite_message.anchor.setTo(0.5,0.5);
  }


};
Pedestrian.prototype.removePedestrian = function (next, sprite) {
  sprite.visible = false;
  sprite.ai.thoughts.needs[0].maslow[0].value = 0;
  var timer = sprite.game.time.events.add(Phaser.Timer.SECOND*4, next, sprite);

};

Pedestrian.prototype.putBack = function () {
  this.visible = true;
  this.goal = this.ai.setGoal();

};

Pedestrian.prototype.onSpriteHover = function (sprite, pointer) {




};






Pedestrian.prototype.setDirection = function () {
console.log("set direction");
  if(this.goal < this.x){
    this.scale.x = -1;
    return "LEFT";
  }else{
    this.scale.x = 1;
    return "RIGHT";
  }


};








Pedestrian.prototype.randomChoice=function(choices){
  console.log("random choice");
  var index =  Math.floor(Math.random() * choices.length);
  return choices[index];
};








Pedestrian.prototype.getNormalizedSpeed = function(return_speed) {
  return (Math.round((Phaser.Math.distance(this.x, this.y, this.goal, this.y) / return_speed) * 1000000));
};
Pedestrian.prototype.getSpeed = function(speed, vary) {
  console.log("get speed");
  return this.getNormalizedSpeed(speed) + this.game.rnd.integerInRange(100, vary);

};







Pedestrian.prototype.brain = function() {

  if(this.isWalking() === true) {
    this.speed = this.getNormalizedSpeed(50000);
  }
  if(this.isWaiting() === true) {
    this.speed = 0;
  }

  console.log("set animation: " + this.anim);

};





Pedestrian.prototype.isWaiting = function() {
  return this.anim.indexOf("-wait") !== -1;
};





Pedestrian.prototype.isWalking = function() {
  return this.anim.indexOf("-walk") !== -1;
};







Pedestrian.prototype.check_animation = function() {
  console.log("check animation", this.anim.indexOf("-walk"));
  this.move_tween = this.game.add.tween(this);
  var delay = this.game.rnd.integerInRange(1000, 6000);
  this.brain();



  if(this.isWalking() === true){

    this.move_tween.to({ x: this.goal}, this.speed).delay(delay);
    this.move_tween.start();
    this.move_tween.onStart.add(function(){
        this.isMoving = true;
        this.movement();},
      this);

    this.move_tween.onComplete.add(function(){
        this.anim = this.anim.replace("-walk", "-wait");
        this.isMoving = false;
        this.movement();

      },
      this);
  }else{
    this.move_tween.stop();
    this.isMoving = false;
  }


};







Pedestrian.prototype.doWait = function () {

    console.log("currently not waiting, starting wait animation");
    this.anim = this.anim.replace("-walk", "-wait");

    this.check_animation();
    this.removePedestrian(this.putBack, this);

};







Pedestrian.prototype.movement = function () {

console.log("movement");
  this.direction = this.setDirection();
  this.animations.play(this.anim);
  this.loaded = true;
};







Pedestrian.prototype.goalAchieved = function () {
  return this.x === this.goal;
};







Pedestrian.prototype.update = function () {

  this.spriteMessage();
  this.ai.life();
  if(this.goalAchieved()){
    console.log("arrived at goal");
    this.doWait();
  }else{
    if(this.isWaiting() === true){
      console.log("not walking");
      this.goal = this.ai.setGoal();
      this.anim = this.anim.replace("-wait", "-walk");

      this.check_animation();
    }

  }




};



module.exports = Pedestrian;

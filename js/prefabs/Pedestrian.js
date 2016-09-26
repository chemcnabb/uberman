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
    if(this.animations.currentAnim.name.indexOf("-wait") === -1){
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
  this.direction = this.setDirection();
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


Pedestrian.prototype.getSpeed = function(speed, vary) {
  console.log("get speed");
  var return_speed = speed + this.game.rnd.integerInRange(100, vary);
  return (Math.round((Phaser.Math.distance(this.x, this.y, this.goal, this.y) / return_speed) * 1000000));
};
Pedestrian.prototype.brain = function() {
console.log("brain");

  switch (this.anim) {
    case "delivery-walk":
      this.speed = this.getSpeed(15000, 5000);
      this.isMoving = true;
      break;
    case "delivery-wait":
      this.speed = 0;
      this.isMoving = false;
      break;
    case "businessman-walk":
      this.speed = this.getSpeed(20000, 2000);
      this.isMoving = true;
      break;
    case "businessman-wait":
      this.speed = 0;
      this.isMoving = false;
      break;
    case "oldman-walk":
      this.speed = this.getSpeed(40000, 5000);
      this.isMoving = true;
      break;
    case "oldman-wait":
      this.speed = 0;
      this.isMoving = false;
      break;
    case "boy-walk":
      this.speed = this.getSpeed(15000, 5000);
      this.isMoving = true;
      break;
    case "boy-wait":
      this.speed = 0;
      this.isMoving = false;
      break;
    case "slick-walk":
      this.speed = this.getSpeed(50000, 5000);
      this.isMoving = true;
      break;
    case "slick-wait":
      this.speed = 0;
      this.isMoving = false;
      break;
    case "hapgood-walk":
      this.speed = this.getSpeed(70000, 5000);
      this.isMoving = true;
      break;
    case "hapgood-wait":
      this.speed = 0;
      this.isMoving = false;
      break;
    case "foreign-walk":
      this.speed = this.getSpeed(20000, 5000);
      this.isMoving = true;
      break;
    case "foreign-wait":
      this.speed = 0;
      this.isMoving = false;
      break;
  }

  console.log("set animation: " + this.anim + " and ismoving=" + this.isMoving);

};
Pedestrian.prototype.check_animation = function() {
  this.move_tween = this.game.add.tween(this);
  var delay = this.game.rnd.integerInRange(1000, 6000);
  this.brain();



  if(this.isMoving){
    this.move_tween.to({ x: this.goal}, this.speed).delay(delay);
    this.move_tween.start();
    this.move_tween.onStart.add(function(){
        this.isMoving = this.anim.indexOf("-walk") === true;
        this.movement();},
      this);

    this.move_tween.onComplete.add(function(){
        this.anim = this.anim.replace("-walk", "-wait");
        this.movement();

      },
      this);
  }






};


Pedestrian.prototype.doWait = function () {

    console.log("currently not waiting, starting wait animation");
    this.isMoving = false;
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
console.log(this.isMoving);
  this.spriteMessage();
  this.ai.life();
  if(this.goalAchieved()){
    console.log("arrived at goal");
    this.doWait();
  }else{
    if(this.animations.currentAnim.name.indexOf("-walk") === -1 && this.isMoving !== true){
      this.goal = this.ai.setGoal();
      this.anim = this.anim.replace("-wait", "-walk");
      this.isMoving = true;
      this.check_animation();
    }
  }

// move to goal
  // check if goal is achieved
  // if yes, set new goal
  // start moving
  //

  //if(this.visible) {
  //
  //  console.log("is walking:", this.animations.currentAnim.name.indexOf("-walk"));
  //  if(this.animations.currentAnim.name.indexOf("-walk") === -1 && this.isMoving !== true){
  //    console.log("setting goal and starting walk");
  //
  //    this.anim = this.anim.replace("-wait", "-walk");
  //
  //    this.goal = this.ai.setGoal();
  //    this.direction = this.setDirection();
  //    this.check_animation();
  //    //console.log(this.anim, "CHANGED GOAL");
  //
  //  }
  //}else{
  //  this.ai.thoughts.needs[0].maslow[0].value -= 0.01;
  //  if(this.ai.thoughts.needs[0].maslow[0].value <= 0){
  //    console.log("REST COMPLETED");
  //    this.ai.thoughts.needs[0].maslow[0].value = 0;
  //    this.visible = true;
  //    this.goal = this.ai.setGoal();
  //    this.anim = this.anim.replace("-wait", "-walk");
  //    //console.log(this.thoughts);
  //  }
  //}


};



module.exports = Pedestrian;

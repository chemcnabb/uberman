
Pedestrian = function (game, y, sprite) {
  Phaser.Sprite.call(this, game, game.rnd.integerInRange(-200, game.world.width+200), y, sprite, 0);

  this.anchor.setTo(0.5, 0.5);
  this.goal = game.world.centerX;
  //this.goal = this.setGoal();
  this.isMoving = false;
  this.frame = 0;
  this.frames = [];
  this.pedestrian_array = ["oldman-wait","businessman-wait", "delivery-wait","boy-wait", "slick-wait", "hapgood-wait", "foreign-wait"];
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







Pedestrian.prototype.spriteMessage = function (sprite, message) {





};

Pedestrian.prototype.onSpriteHover = function (sprite, pointer) {




};

Pedestrian.prototype.getRandomRange= function (low, high) {
return this.game.rnd.integerInRange(low, high);
};

  Pedestrian.prototype.setGoal = function () {
    var startXArray = this.randomChoice([[0, this.x+1000], [0, this.x-1000]]);
    var start = this.getRandomRange(startXArray[0], startXArray[1]);
return this.getRandomRange(start, this.game.world.width-20);

  };

Pedestrian.prototype.setDirection = function () {

  if(this.goal < this.x){
    return "LEFT";
  }else{
    return "RIGHT";
  }


};
Pedestrian.prototype.randomChoice=function(choices){
  var index =  Math.floor(Math.random() * choices.length);
  return choices[index];
};


Pedestrian.prototype.getSpeed = function(speed, vary) {
  var return_speed = speed + this.game.rnd.integerInRange(100, vary);
  return (Math.round((Phaser.Math.distance(this.x, this.y, this.goal, this.y) / return_speed) * 1000000));
};
Pedestrian.prototype.check_animation = function() {
  this.move_tween = this.game.add.tween(this);
  var delay = this.game.rnd.integerInRange(1000, 6000);

  switch (this.anim) {



    case "delivery-walk":
      this.speed = this.getSpeed(15000, 5000);
      this.move_tween.to({ x: this.goal}, this.speed).delay(delay);

      this.isMoving = true;
      //this.move_tween.start();
      break;
    case "delivery-wait":
      this.speed = 0;
      //this.move_tween.stop();
      this.isMoving = false;
      this.anim = "delivery-wait";
      break;
    case "businessman-walk":
      this.speed = this.getSpeed(20000, 2000);
      this.move_tween.to({ x: this.goal}, this.speed).delay(delay);

      this.isMoving = true;
      //this.move_tween.start();
      break;
    case "businessman-wait":
      this.speed = 0;
      //this.move_tween.stop();

      this.isMoving = false;
      break;
    case "oldman-walk":
      this.speed = this.getSpeed(40000, 5000);
      this.move_tween.to({ x: this.goal}, this.speed).delay(delay);

      this.isMoving = true;
      //this.move_tween.start();
      break;
    case "oldman-wait":
      this.speed = 0;
      //this.move_tween.stop();
      this.isMoving = false;

      break;
    case "boy-walk":
      this.speed = this.getSpeed(15000, 5000);
      this.move_tween.to({ x: this.goal}, this.speed).delay(delay);

      this.isMoving = true;
      //this.move_tween.start();
      break;
    case "boy-wait":
      this.speed = 0;
      //this.move_tween.stop();
      this.isMoving = false;

      break;
    case "slick-walk":
      this.speed = this.getSpeed(50000, 5000);
      this.move_tween.to({ x: this.goal}, this.speed).delay(delay);
      this.isMoving = true;
      break;
    case "slick-wait":
      this.speed = 0;
      //this.move_tween.stop();
      this.isMoving = false;

      break;
    case "hapgood-walk":
      this.speed = this.getSpeed(70000, 5000);
      this.move_tween.to({ x: this.goal}, this.speed).delay(delay);
      this.isMoving = true;
      break;
    case "hapgood-wait":
      this.speed = 0;
      //this.move_tween.stop();
      this.isMoving = false;

      break;
    case "foreign-walk":
      this.speed = this.getSpeed(20000, 5000);
      this.move_tween.to({ x: this.goal}, this.speed).delay(delay);
      this.isMoving = true;
      break;
    case "foreign-wait":
      this.speed = 0;
      //this.move_tween.stop();
      this.isMoving = false;

      break;
  }

  this.move_tween.start();
  this.move_tween.onStart.add(function(){
      this.isMoving = this.anim.indexOf("-walk") === true;
    this.movement();},
    this);

  this.move_tween.onComplete.add(function(){
      this.anim = this.anim.replace("-walk", "-wait");
      this.movement();},
    this);
  //this.jog = this.animations.add(anim, [6,7,8,9], 6, true);

};


Pedestrian.prototype.movement = function () {


  this.animations.play(this.anim);


  if(this.direction=="LEFT"){
    this.scale.x = -1;
  }else{
    this.scale.x = 1;
  }

  this.loaded = true;

};



Pedestrian.prototype.update = function () {
  //this.check_animation();
  if(this.x == this.goal){

    if(this.anim.indexOf("-wait") === -1){
      this.isMoving = false;
      this.anim = this.anim.replace("-walk", "-wait");
      this.check_animation();
    }

  }







  if(this.animations.currentAnim.name.indexOf("-walk") === -1 && this.isMoving !== true){


      this.anim = this.anim.replace("-wait", "-walk");

      this.goal = this.setGoal();
      this.direction = this.setDirection();
      this.check_animation();
    console.log(this.anim, "CHANGED GOAL", this.speed);

  }
  //if (this.anim != "businessman-wait"){
  //  this.anim = "businessman-wait";
  //  this.check_animation();
  //  this.movement();
  //}







  //console.log(this.originHeight, this.y);
};



module.exports = Pedestrian;
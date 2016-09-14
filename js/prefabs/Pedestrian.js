
Pedestrian = function (game, y, sprite) {
  Phaser.Sprite.call(this, game, game.rnd.integerInRange(-200, game.world.width+200), y, sprite, 0);

  this.anchor.setTo(0.5, 0.5);
  this.goal = game.world.centerX;
  //this.goal = this.setGoal();
  this.isMoving = false;
  this.frame = 0;
  this.frames = [];
  this.pedestrian_array = ["oldman-wait","businessman-wait", "delivery-wait","boy-wait", "slick-wait", "hapgood-wait", "foreign-wait"];
  this.food = this.getRandomRange(0, 100);
  this.warmth = this.getRandomRange(0, 100);
  this.money = this.getRandomRange(0, 100);
  this.water = this.getRandomRange(0, 100);
  this.security = this.getRandomRange(0, 100);
  this.friendship = this.getRandomRange(0, 100);
  this.intimacy = this.getRandomRange(0, 100);
  this.family = this.getRandomRange(0, 100);
  this.confidence = this.getRandomRange(0, 100);
  this.art = this.getRandomRange(0, 100);
  this.education = this.getRandomRange(0, 100);
  this.thoughts = {
    "needs":[
      {
        "maslow":[
          {"need":"WATER","weight":2.4},
          {"need":"FOOD","weight":2.1}
      ], "totalWeight":4.5},
      {
        "maslow":[
          {"need":"SECURITY","weight":1.09},
          {"need":"MONEY","weight":1.08},
          {"need":"WARMTH","weight":1.07}
      ],"totalWeight":4.4 },
      {
        "maslow":[
          {"need":"FRIENDSHIP","weight":1.06},
          {"need":"INTIMACY","weight":1.05},
          {"need":"FAMILY","weight":1.04}
      ],"totalWeight":2.5},
      {
        "maslow":[
          {"need":"CONFIDENCE","weight":1.03}
      ],"totalWeight":1.03},
      {
        "maslow":[
          {"need":"ART","weight":1.02},
          {"need":"EDUCATION","weight":1.01}
      ],"totalWeight":1.03}
    ],

    "waterBaseWeight":2.4,
    "foodBaseWeight":2.1,
    "securityBaseWeight":1.09,
    "moneyBaseWeight":1.08,
    "warmthBaseWeight":1.07,
    "friendshipBaseWeight":1.06,
    "intimacyBaseWeight":1.05,
    "familyBaseWeight":1.04,
    "confidenceBaseWeight":1.03,
    "artBaseWeight":1.02,
    "educationBaseWeight":1.01
  };

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
Pedestrian.prototype.life = function () {
  //console.log(this.hunger);


  this.food += 0.01;
  this.money -= 0.01;
  this.water -= 0.01;
  this.security -= 0.01;
  this.money -= 0.01;
  this.warmth -= 0.01;
  this.friendship -= 0.01;
  this.intimacy -= 0.01;
  this.family -= 0.01;
  this.confidence -= 0.01;
  this.art -= 0.01;
  this.education -= 0.01;

  for ( var i = 0; i < this.thoughts.needs.length; i++)
  {
    var needs = this.thoughts.needs[i];

    for(var j = 0; j< needs.maslow.length;j++){

      //TODO: adjust calculation of 0.0032 to reflaect maslow hierarchy
      var modifier = i+1;
      if(needs.maslow[j].need == "FOOD"){
        this.thoughts.needs[i].maslow[j].weight = ((this.food * 0.0032)+this.thoughts.foodBaseWeight)*modifier;
      }
      if(needs.maslow[j].need == "WATER"){
        this.thoughts.needs[i].maslow[j].weight = ((0.0032/this.water)+this.thoughts.waterBaseWeight)*modifier;
      }
      if(needs.maslow[j].need == "SECURITY"){
        this.thoughts.needs[i].maslow[j].weight = ((0.0032/this.security)+this.thoughts.securityBaseWeight)*modifier;
      }
      if(needs.maslow[j].need == "MONEY"){
        this.thoughts.needs[i].maslow[j].weight = ((0.0032/this.money )+this.thoughts.moneyBaseWeight)*modifier;
      }
      if(needs.maslow[j].need == "WARMTH"){
        this.thoughts.needs[i].maslow[j].weight = ((0.0032/this.warmth)+this.thoughts.warmthBaseWeight)*modifier;

      }
      if(needs.maslow[j].need == "FRIENDSHIP"){
        this.thoughts.needs[i].maslow[j].weight = ((0.0032/this.friendship)+this.thoughts.friendshipBaseWeight)*modifier;

      }
      if(needs.maslow[j].need == "INTIMACY"){
        this.thoughts.needs[i].maslow[j].weight = ((0.0032/this.intimacy)+this.thoughts.intimacyBaseWeight)*modifier;

      }
      if(needs.maslow[j].need == "FAMILY"){
        this.thoughts.needs[i].maslow[j].weight = ((0.0032/this.family)+this.thoughts.familyBaseWeight)*modifier;

      }
      if(needs.maslow[j].need == "CONFIDENCE"){
        this.thoughts.needs[i].maslow[j].weight = ((0.0032/this.confidence)+this.thoughts.confidenceBaseWeight)*modifier;

      }
      if(needs.maslow[j].need == "ART"){
        this.thoughts.needs[i].maslow[j].weight = ((0.0032/this.art)+this.thoughts.artBaseWeight)*modifier;

      }
      if(needs.maslow[j].need == "EDUCATION"){
        this.thoughts.needs[i].maslow[j].weight = ((0.0032/this.education)+this.thoughts.educationBaseWeight)*modifier;

      }
      
      
      console.log(needs.maslow[j].need, this.thoughts.needs[i].maslow[j].weight);
    }


  }
  
  

};
  Pedestrian.prototype.setGoal = function () {

    var need=[], weight=[];
    
    console.log(this.thoughts);
    
    for ( var i = 0; i < this.thoughts.needs.length; i++)
    {

      var total = 0;
      for(var k=0;k<this.thoughts.needs[i].maslow.length;k++){
        total += this.thoughts.needs[i].maslow[k].weight;
      }
      this.thoughts.needs[i].totalWeight = total;



      this.thoughts.needs[i].maslow.sort( function(a,b){return b.weight - a.weight; } );
      this.thoughts.needs.sort( function(a,b){return b.totalWeight - a.totalWeight; } );


    }



    switch (this.thoughts.needs[0].maslow[0].need) {


      case "WATER":
        console.log("I'm THIRSTY!!", this.thoughts.needs[0].maslow[0].weight);
        this.water = 100;
        break;
      case "SECURITY":
        console.log("I'm SCARED!!", this.thoughts.needs[0].maslow[0].weight);
        this.security = 100;
        break;
      case "FRIENDSHIP":
        console.log("I NEED FRIENDS!!", this.thoughts.needs[0].maslow[0].weight);
        this.friendship = 100;
        break;
      case "INTIMACY":
        console.log("I'm LONELY!!", this.thoughts.needs[0].maslow[0].weight);
        this.intimacy = 100;
        break;
      case "FAMILY":
        console.log("I HAVE NO SUPPORT!!", this.thoughts.needs[0].maslow[0].weight);
        this.family = 100;
        break;
      case "CONFIDENCE":
        console.log("I'm INSECURE!!", this.thoughts.needs[0].maslow[0].weight);
        this.confidence = 100;
        break;
      case "ART":
        console.log("I'm NOT CREATIVE!!", this.thoughts.needs[0].maslow[0].weight);
        this.art = 100;
        break;
      case "EDUCATION":
        console.log("I'm DUMB!!", this.thoughts.needs[0].maslow[0].weight);
        this.education = 100;
        break;

      case "FOOD":
        console.log("I'm HUNGRY!!", this.thoughts.needs[0].maslow[0].weight);
        this.food = 0;
        break;

      case "WARMTH":
        console.log("I'm COLD!!", this.thoughts.needs[0].maslow[0].weight);

        this.warmth = 100;

        break;

      case "MONEY":
        console.log("I'm BROKE!!", this.thoughts.needs[0].maslow[0].weight);

        this.money = 100;

        break;
    }






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
Pedestrian.prototype.Brain = function() {


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

};
Pedestrian.prototype.check_animation = function() {
  this.move_tween = this.game.add.tween(this);
  var delay = this.game.rnd.integerInRange(1000, 6000);
  this.Brain();
  if(this.isMoving){
    this.move_tween.to({ x: this.goal}, this.speed).delay(delay);
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
  this.life();
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

};



module.exports = Pedestrian;

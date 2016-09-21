
Pedestrian = function (game, y, sprite) {
  Phaser.Sprite.call(this, game, game.rnd.integerInRange(-200, game.world.width+200), y, sprite, 0);

  this.anchor.setTo(0.5, 0.5);
  this.goal = game.world.centerX;
  //this.goal = this.setGoal();
  this.isMoving = false;
  this.frame = 0;
  this.frames = [];
  this.pedestrian_array = ["oldman-wait","businessman-wait", "delivery-wait","boy-wait", "slick-wait", "hapgood-wait", "foreign-wait"];
  this.visible = true;
  this.thoughts = {
    "needs": [
      {
        "maslow": [
          {
            "need": "WATER",
            "weight": 2.4,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 2.4,
            "emotion": "I'm THIRSTY",
            "goal":677,
            "acts":[
              this.removePedestrian,
              this.putBack
            ]
          },
          {
            "need": "FOOD",
            "weight": 2.1,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 2.1,
            "emotion": "I'm HUNGRY",
            "goal":776,
            "acts":[
              this.removePedestrian,
              this.putBack
            ]
          }
        ], "totalWeight": 4.5
      },
      {
        "maslow": [
          {
            "need": "SECURITY",
            "weight": 1.09,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 1.09,
            "emotion": "I'm SCARED",
            "goal":1700,
            "acts":[
              this.removePedestrian,
              this.putBack
            ]
          },
          {
            "need": "MONEY",
            "weight": 1.08,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 1.08,
            "emotion": "I'm BROKE",
            "goal":2300,
            "acts":[
              this.removePedestrian,
              this.putBack
            ]
          },
          {
            "need": "WARMTH",
            "weight": 1.07,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 1.07,
            "emotion": "I'm COLD",
            "goal":250,
            "acts":[
              this.removePedestrian,
              this.putBack
            ]
          }
        ],
        "totalWeight": 4.4
      },
      {
        "maslow": [
          {
            "need": "FRIENDSHIP",
            "weight": 1.06,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 1.06,
            "emotion": "No one LIKES ME",
            "goal":90,
            "acts":[
              this.removePedestrian,
              this.putBack
            ]
          },
          {
            "need": "INTIMACY",
            "weight": 1.05,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 1.05,
            "emotion": "I'm LONELY",
            "goal":1200,
            "acts":[
              this.removePedestrian,
              this.putBack
            ]
          },
          {
            "need": "FAMILY",
            "weight": 1.04,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 1.04,
            "emotion": "I have no SUPPORT",
            "goal":900,
            "acts":[
              this.removePedestrian,
              this.putBack
            ]
          }
        ], "totalWeight": 2.5
      },
      {
        "maslow": [
          {
            "need": "CONFIDENCE",
            "weight": 1.03,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 1.03,
            "emotion": "I'm WEAK",
            "goal":200,
            "acts":[
              this.removePedestrian,
              this.putBack
            ]
          }
        ], "totalWeight": 1.03
      },
      {
        "maslow": [
          {
            "need": "ART",
            "weight": 1.02,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 1.02,
            "emotion": "I'm un-CREATIVE",
            "goal":1500,
            "acts":[
              this.removePedestrian,
              this.putBack
            ]
          },
          {
            "need": "EDUCATION",
            "weight": 1.01,
            "value": this.getRandomRange(0, 100),
            "baseWeight": 1.01,
            "emotion": "I'm not SMART",
            "goal":2000,
            "acts":[
              this.removePedestrian,
              this.putBack
            ]
          }
        ], "totalWeight": 1.03
      }
    ]

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

  console.log("DONE");



};

Pedestrian.prototype.removePedestrian = function (next, sprite) {


console.log("CURRENTLY EATING");
  sprite.visible = false;
  sprite.thoughts.needs[0].maslow[0].value = 0;
  next();


};

Pedestrian.prototype.putBack = function () {





};

Pedestrian.prototype.onSpriteHover = function (sprite, pointer) {




};

Pedestrian.prototype.getWeight= function (x,y,i) {
  return ( (y*(i+1)-y*(i))/(x*(i+1)-x*(i)) - (y*(i)-y*(i-1))/(x*(i)-x*(i-1))/(x*(i+1)-x*(i-1)));
};

Pedestrian.prototype.getRandomRange= function (low, high) {
return this.game.rnd.integerInRange(low, high);
};
Pedestrian.prototype.life = function () {
  //console.log(this.hunger);




  for ( var i = 0; i < this.thoughts.needs.length; i++)
  {
    var needs = this.thoughts.needs[i];

    for(var j = 0; j< needs.maslow.length;j++){

      //TODO: adjust calculation of 0.0032 to reflaect maslow hierarchy

        this.thoughts.needs[i].maslow[j].value += 0.01;
        this.thoughts.needs[i].maslow[j].weight = this.getWeight(this.thoughts.needs[i].maslow[j].baseWeight,this.thoughts.needs[i].maslow[j].value,i);


      
      //console.log(needs.maslow[j].need, this.thoughts.needs[i].maslow[j].weight);
    }


  }
  
  //this.goal = this.thoughts.needs[0].maslow[0].goal;

};

Pedestrian.prototype.sortThoughts = function() {
  for (var i = 0; i < this.thoughts.needs.length; i++) {
    var total = 0;
    for (var k = 0; k < this.thoughts.needs[i].maslow.length; k++) {
      total += this.thoughts.needs[i].maslow[k].weight;
    }
    this.thoughts.needs[i].totalWeight = total;
    //console.log("TOTAL:",this.thoughts.needs[i].totalWeight);

    this.thoughts.needs[i].maslow.sort(function (a, b) {
      return b.weight - a.weight;
    });
    this.thoughts.needs.sort(function (a, b) {
      return b.totalWeight - a.totalWeight;
    });

  }

  //this.thoughts.needs[0].maslow[0].value = 100;
  //console.log(this.thoughts.needs[0].maslow[0].emotion);
};

Pedestrian.prototype.setGoal = function () {

  this.sortThoughts();
  return this.thoughts.needs[0].maslow[0].goal;
  //var startXArray = this.randomChoice([[0, this.x+1000], [0, this.x-1000]]);
  //  var start = this.getRandomRange(startXArray[0], startXArray[1]);
  //  return this.getRandomRange(start, this.game.world.width-20);

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
Pedestrian.prototype.brain = function() {


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
  this.brain();



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
      this.movement();
      this.thoughts.needs[0].maslow[0].acts[0](this.thoughts.needs[0].maslow[0].acts[1], this);
    },
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
  if(this.visible){
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
      //console.log(this.anim, "CHANGED GOAL");

    }
  }else{
    this.thoughts.needs[0].maslow[0].value -= 0.01;
    if(this.thoughts.needs[0].maslow[0].value <= 0){
      this.thoughts.needs[0].maslow[0].value = 0;
      this.visible = true;
      console.log("GOAL COMPLETED");
      //console.log(this.thoughts);
    }
  }


};



module.exports = Pedestrian;

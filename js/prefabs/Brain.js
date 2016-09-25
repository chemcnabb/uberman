
BRAIN = function (game) {
  this.game = game;
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
              "CAFE",
              "RETURN"
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
              "GROCERY",
              "RETURN"
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
              "HOME",
              "RETURN"
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
              "BANK",
              "RETURN"
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
              "INDOORS",
              "RETURN"
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
              "MAKE_FRIEND",
              "RETURN"
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
              "BE_INTIMATE",
              "RETURN"
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
              "HOME",
              "RETURN"
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
              "GYM",
              "RETURN"
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
              "ART_GALLERY",
              "RETURN"
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
              "LIBRARY",
              "RETURN"
            ]
          }
        ], "totalWeight": 1.03
      }
    ]

  };


};

BRAIN.prototype = Object.create(Phaser.Sprite.prototype);
BRAIN.prototype.constructor = BRAIN;

BRAIN.prototype.getWeight= function (x,y,i) {
  return ( (y*(i+1)-y*(i))/(x*(i+1)-x*(i)) - (y*(i)-y*(i-1))/(x*(i)-x*(i-1))/(x*(i+1)-x*(i-1)));
};

BRAIN.prototype.life = function () {
  //console.log(this.hunger);




  for ( var i = 0; i < this.thoughts.needs.length; i++)
  {
    var needs = this.thoughts.needs[i];

    for(var j = 0; j< needs.maslow.length;j++){

      //TODO: adjust calculation of 0.0032 to reflaect maslow hierarchy

      needs.maslow[j].value += 0.01;
      needs.maslow[j].weight = this.getWeight(needs.maslow[j].baseWeight,needs.maslow[j].value,i);



      //console.log(needs.maslow[j].need, this.thoughts.needs[i].maslow[j].weight);
    }


  }

  //this.goal = this.thoughts.needs[0].maslow[0].goal;

};

BRAIN.prototype.sortThoughts = function() {
  for (var i = 0; i < this.thoughts.needs.length; i++) {
    var total = 0;
    var needs = this.thoughts.needs[i];
    for (var k = 0; k < needs.maslow.length; k++) {
      total += needs.maslow[k].weight;
    }
    needs.totalWeight = total;
    //console.log("TOTAL:",this.thoughts.needs[i].totalWeight);

    needs.maslow.sort(function (a, b) {
      return b.weight - a.weight;
    });
    this.thoughts.needs.sort(function (a, b) {
      return b.totalWeight - a.totalWeight;
    });

  }

  //this.thoughts.needs[0].maslow[0].value = 100;
  //console.log(this.thoughts.needs[0].maslow[0].emotion);
};

BRAIN.prototype.getRandomRange= function (low, high) {
  return this.game.rnd.integerInRange(low, high);
};

BRAIN.prototype.setGoal = function () {

  this.sortThoughts();
  return this.thoughts.needs[0].maslow[0].goal;


};

BRAIN.prototype.preload = function () {

};


BRAIN.prototype.update = function() {

};

module.exports = BRAIN;

BRAIN = function (game) {
  this.game = game;
  this.profile = this.generateProfile();
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
              "cafe",
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
              "bakery",
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
              "library",
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
              "library",
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
              "bank",
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
              "library",
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
              "bank",
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
              "library",
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
              "bookstore",
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

BRAIN.prototype.generateProfile = function () {
  var workplaces = ['bank', 'library', 'cafe', 'bakery', 'bookstore'];
  var shiftStart = this.getRandomRange(7, 10);
  return {
    homeX: this.getRandomRange(100, this.game.world.width - 100),
    workplace: workplaces[this.getRandomRange(0, workplaces.length - 1)],
    shiftStart: shiftStart,
    shiftEnd: shiftStart + this.getRandomRange(6, 9),
    income: this.getRandomRange(5, 25),
    wallet: this.getRandomRange(15, 65),
    lastIntent: null
  };
};

BRAIN.prototype.getCurrentHour = function () {
  var dayLength = this.game.dayLength || 60000 * 5;
  var elapsed = this.game.time.now % dayLength;
  return Math.floor((elapsed / dayLength) * 24);
};

BRAIN.prototype.isWorkingHour = function (hour) {
  return hour >= this.profile.shiftStart && hour < this.profile.shiftEnd;
};

BRAIN.prototype.getNeedCost = function (need) {
  var costs = {
    WATER: 3,
    FOOD: 6,
    ART: 8,
    EDUCATION: 8,
    CONFIDENCE: 4,
    WARMTH: 2
  };
  return costs[need] || 0;
};

BRAIN.prototype.findNeedByName = function (name) {
  for (var i = 0; i < this.thoughts.needs.length; i++) {
    var needs = this.thoughts.needs[i].maslow;
    for (var k = 0; k < needs.length; k++) {
      if (needs[k].need === name) {
        return needs[k];
      }
    }
  }
  return null;
};

BRAIN.prototype.buildIntent = function (type, doorKey, fallbackX, emotion, needName) {
  var goalX = fallbackX;
  if (doorKey && this.game.doors[doorKey]) {
    goalX = this.game.doors[doorKey].centerX;
  }
  return {
    type: type,
    door: doorKey,
    goal: goalX,
    message: emotion,
    need: needName
  };
};

BRAIN.prototype.getWeight= function (x,y,i) {
  return ( (y*(i+1)-y*(i))/(x*(i+1)-x*(i)) - (y*(i)-y*(i-1))/(x*(i)-x*(i-1))/(x*(i+1)-x*(i-1)));
};

BRAIN.prototype.life = function () {
  for ( var i = 0; i < this.thoughts.needs.length; i++) {
    var needs = this.thoughts.needs[i];
    for(var j = 0; j< needs.maslow.length;j++){
      needs.maslow[j].value += 0.01;
      needs.maslow[j].weight = this.getWeight(needs.maslow[j].baseWeight,needs.maslow[j].value,i);
    }
  }
  if (this.profile.wallet < 10) {
    var moneyNeed = this.findNeedByName('MONEY');
    if (moneyNeed) {
      moneyNeed.value += 0.5;
      moneyNeed.weight += 0.2;
    }
  }
  if (this.getCurrentHour() > 21 || this.getCurrentHour() < 6) {
    var warmthNeed = this.findNeedByName('WARMTH');
    if (warmthNeed) {
      warmthNeed.weight += 0.05;
    }
  }
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

BRAIN.prototype.chooseIntent = function () {
  this.sortThoughts();
  var hour = this.getCurrentHour();
  if (this.isWorkingHour(hour)) {
    return this.buildIntent('WORK', this.profile.workplace, this.game.world.centerX, 'Heading to work', 'MONEY');
  }

  if (hour >= 22 || hour < 6) {
    return this.buildIntent('REST', null, this.profile.homeX, 'Heading home to rest', null);
  }

  var topNeed = this.thoughts.needs[0].maslow[0];
  var requiredCost = this.getNeedCost(topNeed.need);
  if (requiredCost > this.profile.wallet && topNeed.need !== 'MONEY') {
    return this.buildIntent('WORK', this.profile.workplace, this.game.world.centerX, "I need cash first", 'MONEY');
  }
  var doorKey = topNeed.acts[0].toLowerCase();
  return this.buildIntent('FULFILL_NEED', doorKey, this.game.world.centerX, topNeed.emotion, topNeed.need);
};

BRAIN.prototype.resolveIntent = function (intent) {
  if (!intent) {
    return;
  }
  if (intent.type === 'WORK') {
    this.profile.wallet += this.profile.income;
    var moneyNeed = this.findNeedByName('MONEY');
    if (moneyNeed) {
      moneyNeed.value = 0;
    }
  }

  if (intent.type === 'FULFILL_NEED' && intent.need) {
    var need = this.findNeedByName(intent.need);
    if (need) {
      need.value = 0;
      var cost = this.getNeedCost(intent.need);
      this.profile.wallet = Math.max(0, this.profile.wallet - cost);
    }
  }

  if (intent.type === 'REST') {
    var securityNeed = this.findNeedByName('SECURITY');
    if (securityNeed) {
      securityNeed.value = Math.max(0, securityNeed.value - 10);
    }
  }
  this.profile.lastIntent = intent.type;
};

BRAIN.prototype.setGoal = function () {
  var intent = this.chooseIntent();
  this.profile.lastIntent = intent;
  return intent.goal;
};

BRAIN.prototype.preload = function () {

};


BRAIN.prototype.update = function() {

};

module.exports = BRAIN;

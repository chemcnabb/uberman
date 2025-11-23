
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
            "emotion": "Mouth is dry—need a drink before I keel over",
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
            "emotion": "Stomach is growling for something warm",
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
            "emotion": "Need a safe corner where I can breathe",
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
            "emotion": "Wallet feels too light—time to earn",
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
            "emotion": "Freezing up here, must find a warm spot",
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
            "emotion": "Craving some company, not just crowds",
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
            "emotion": "Wish I had someone to share the walk with",
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
            "emotion": "Missing the comfort of my people",
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
            "emotion": "Confidence is thin—I need a win",
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
            "emotion": "I feel dull—need art to spark me",
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
            "emotion": "Brain fog. I should learn something new",
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
    lastIntent: null,
    fatigue: this.getRandomRange(10, 40),
    savingsGoal: this.getRandomRange(25, 60),
    favoriteNeed: this.thoughts.needs[this.getRandomRange(0, this.thoughts.needs.length - 1)].maslow[0].need
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

BRAIN.prototype.hasBudgetFor = function (needName) {
  var cost = this.getNeedCost(needName);
  var reserve = Math.floor(this.profile.savingsGoal * 0.5);
  return (this.profile.wallet - cost) >= reserve;
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

BRAIN.prototype.describeIntent = function (type, data) {
  var walletText = ' ($' + this.profile.wallet + ')';
  var fatigueText = ' (fatigue ' + Math.round(this.profile.fatigue) + '%)';
  if (type === 'WORK') {
    return 'Off to my ' + this.profile.workplace + ' shift to refill the wallet' + walletText;
  }
  if (type === 'REST') {
    var restReason = this.profile.fatigue > 80 ? 'can barely keep eyes open' : 'better rest before the next shift';
    return 'Heading home, ' + restReason + fatigueText;
  }
  if (type === 'FULFILL_NEED' && data && data.need) {
    var cost = this.getNeedCost(data.need);
    var thoughts = {
      WATER: 'Need a cool drink before my throat cracks',
      FOOD: 'Hunting for something hearty to quiet this stomach',
      ART: 'Craving color and music to wake my senses',
      EDUCATION: 'Time to feed my brain with something new',
      CONFIDENCE: 'Need a quick win to feel like myself again',
      WARMTH: 'Chasing a cozy corner to thaw out',
      FRIENDSHIP: 'Looking for friendly faces and small talk',
      INTIMACY: 'Hoping to connect with someone who gets me',
      FAMILY: 'Want to feel grounded around familiar voices',
      MONEY: 'I should get some cash together'
    };
    var needThought = thoughts[data.need] || data.emotion || 'I know what I want right now';
    return needThought + ' ($' + cost + ')';
  }
  return data && data.emotion ? data.emotion : 'On the move';
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
  this.profile.fatigue = Math.min(100, this.profile.fatigue + 0.05);
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

BRAIN.prototype.pickTopNeed = function () {
  var fallback = null;
  var best = null;
  var bestScore = -Infinity;
  this.sortThoughts();
  for (var i = 0; i < this.thoughts.needs.length; i++) {
    var needs = this.thoughts.needs[i].maslow;
    for (var k = 0; k < needs.length; k++) {
      var candidate = needs[k];
      var score = candidate.weight;
      if (!fallback) {
        fallback = candidate;
      }
      if (this.profile.lastIntent && this.profile.lastIntent.need === candidate.need) {
        score -= 0.2;
      }
      if (candidate.need === this.profile.favoriteNeed) {
        score += 0.1;
      }
      if (score > bestScore) {
        bestScore = score;
        best = candidate;
      }
    }
  }
  return best || fallback;
};

BRAIN.prototype.chooseIntent = function () {
  var hour = this.getCurrentHour();
  var approachingShift = hour >= this.profile.shiftStart - 1 && hour < this.profile.shiftEnd;
  if (approachingShift && this.profile.fatigue < 90) {
    var workIntent = this.buildIntent('WORK', this.profile.workplace, this.game.world.centerX, 'Heading to work', 'MONEY');
    workIntent.message = this.describeIntent('WORK', { need: 'MONEY' });
    return workIntent;
  }

  if (this.profile.fatigue > 80 || hour >= 22 || hour < 6) {
    var restIntent = this.buildIntent('REST', null, this.profile.homeX, 'Heading home to rest', null);
    restIntent.message = this.describeIntent('REST');
    return restIntent;
  }

  var topNeed = this.pickTopNeed();
  if (!this.hasBudgetFor(topNeed.need) && topNeed.need !== 'MONEY') {
    var brokeIntent = this.buildIntent('WORK', this.profile.workplace, this.game.world.centerX, "I need cash first", 'MONEY');
    brokeIntent.message = this.describeIntent('WORK', { need: 'MONEY' });
    return brokeIntent;
  }
  var doorKey = topNeed.acts[0].toLowerCase();
  var intent = this.buildIntent('FULFILL_NEED', doorKey, this.game.world.centerX, topNeed.emotion, topNeed.need);
  intent.message = this.describeIntent('FULFILL_NEED', { need: topNeed.need, emotion: topNeed.emotion });
  return intent;
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
    this.profile.fatigue = Math.min(100, this.profile.fatigue + 5);
  }

  if (intent.type === 'FULFILL_NEED' && intent.need) {
    var need = this.findNeedByName(intent.need);
    if (need) {
      need.value = 0;
      var cost = this.getNeedCost(intent.need);
      this.profile.wallet = Math.max(0, this.profile.wallet - cost);
      this.profile.fatigue = Math.max(0, this.profile.fatigue - 2);
    }
  }

  if (intent.type === 'REST') {
    var securityNeed = this.findNeedByName('SECURITY');
    if (securityNeed) {
      securityNeed.value = Math.max(0, securityNeed.value - 10);
    }
    this.profile.fatigue = Math.max(0, this.profile.fatigue - 25);
  }
  this.profile.lastIntent = intent;
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

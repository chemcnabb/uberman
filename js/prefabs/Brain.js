
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
            "emotion": "Mouth is dry—need a drink before I keel over",
            "emotionLines": [
              "Mouth is dry—need a drink before I keel over",
              "Throat feels like sandpaper; I need something cold",
              "Every step kicks up more dust inside me—water, now",
              "I can taste the air—give me a cup to quiet this cough",
              "Craving something crisp to rinse the day out"
            ],
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
            "emotionLines": [
              "Stomach is growling for something warm",
              "Need a solid bite before I tip over",
              "Fantasizing about anything hearty and fresh",
              "Energy is fading—time to refuel with real food",
              "Craving a quick sit-down and a hot plate"
            ],
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
            "emotionLines": [
              "Need a safe corner where I can breathe",
              "Stomach knots up—I want somewhere steady",
              "Too exposed out here, I need a calm nook",
              "Heart is racing; I should tuck into someplace safe",
              "Looking for walls that feel like they have my back"
            ],
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
            "emotionLines": [
              "Wallet feels too light—time to earn",
              "Funds are thin; better clock in and rebuild",
              "Bank account is sighing—need to stack some bills",
              "Too close to empty for comfort; payday mindset engaged",
              "I can almost hear my savings goal calling me back"
            ],
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
            "emotionLines": [
              "Freezing up here, must find a warm spot",
              "Fingers are numb—need a heater and a mug",
              "This chill is sinking in; any cozy corner will do",
              "Shoulders are stiff; need someplace with steam or sun",
              "Dreaming of blankets and a hot drink"
            ],
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
            "emotionLines": [
              "Craving some company, not just crowds",
              "Need real chatter, not just passing faces",
              "Hoping to bump into someone warm and familiar",
              "Would love to hear a friendly voice right now",
              "Longing for a laugh with someone nearby"
            ],
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
            "emotionLines": [
              "Wish I had someone to share the walk with",
              "Looking for a spark, not just a hello",
              "Want to lean on someone who leans back",
              "Missing closeness; even a quick moment would do",
              "My heart is wandering; maybe I can meet someone"
            ],
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
            "emotionLines": [
              "Missing the comfort of my people",
              "Need familiar voices to steady me",
              "Hoping to feel rooted with someone who knows me",
              "Craving a reminder that I belong somewhere",
              "Would love to check in with the folks who get me"
            ],
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
            "emotionLines": [
              "Confidence is thin—I need a win",
              "Need a small victory to steady my stride",
              "Looking for proof I can handle today",
              "Feeling small; want to stand taller again",
              "A quick success would switch my mood around"
            ],
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
            "emotionLines": [
              "I feel dull—need art to spark me",
              "My mind is gray; I want color and music",
              "Need a gallery of ideas to recharge",
              "Craving stories, paint, anything bright",
              "Would love to browse something beautiful"
            ],
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
            "emotionLines": [
              "Brain fog. I should learn something new",
              "Mind feels slow—time for a fresh idea",
              "Need to stretch my head with something challenging",
              "Hungry for a fact or two to brighten my thinking",
              "Could use a good read to sharpen my focus"
            ],
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

  this.profile = this.generateProfile();


};

BRAIN.prototype = Object.create(Phaser.Sprite.prototype);
BRAIN.prototype.constructor = BRAIN;

BRAIN.prototype.createPersonality = function () {
  var archetypes = [
    {
      id: 'earnest',
      openers: ["Honestly,", "Note to self:", "For real,"],
      closers: ["gotta take this seriously.", "no excuses this time.", "focus up."],
      tempo: 'steady'
    },
    {
      id: 'chatty',
      openers: ["You know what?", "Oh!", "Fun fact:"],
      closers: ["let's make a moment of it.", "maybe I’ll talk someone’s ear off.", "I could share this with someone."],
      tempo: 'quick'
    },
    {
      id: 'dreamer',
      openers: ["Drifting along,", "Huh,", "Imagine this:"],
      closers: ["maybe I’ll find inspiration.", "let’s follow the vibe.", "could be a story in this."],
      tempo: 'calm'
    },
    {
      id: 'pragmatic',
      openers: ["Practical move:", "Plan:", "Next step:"],
      closers: ["keep it efficient.", "in and out.", "stick to the plan."],
      tempo: 'brisk'
    }
  ];
  return archetypes[this.getRandomRange(0, archetypes.length - 1)];
};

BRAIN.prototype.generateProfile = function () {
  var workplaces = ['bank', 'library', 'cafe', 'bakery', 'bookstore'];
  var shiftStart = this.getRandomRange(7, 10);
  var personality = this.createPersonality();
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
    favoriteNeed: this.thoughts.needs[this.getRandomRange(0, this.thoughts.needs.length - 1)].maslow[0].need,
    personality: personality
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

BRAIN.prototype.pickLine = function (lines) {
  if (!lines || lines.length === 0) {
    return '';
  }
  var index = this.getRandomRange(0, lines.length - 1);
  return lines[index];
};

BRAIN.prototype.composeNeedThought = function (needName, fallbackEmotion) {
  var need = this.findNeedByName(needName);
  var baseLines = need && need.emotionLines ? need.emotionLines : [];
  if (baseLines.length === 0 && need && need.emotion) {
    baseLines.push(need.emotion);
  }
  if (baseLines.length === 0 && fallbackEmotion) {
    baseLines.push(fallbackEmotion);
  }

  var line = this.pickLine(baseLines);
  var personality = this.profile.personality || { openers: [], closers: [] };
  var opener = this.pickLine(personality.openers);
  var closer = this.pickLine(personality.closers);
  var budgetHint = '';
  if (!this.hasBudgetFor(needName) && needName !== 'MONEY') {
    budgetHint = ' (but I have to keep it cheap)';
  }
  var fatigueHint = this.profile.fatigue > 70 ? ' Moving slower than usual.' : '';
  var sentence = '';
  if (opener) {
    sentence += opener + ' ';
  }
  sentence += line;
  if (budgetHint) {
    sentence += budgetHint;
  }
  if (closer) {
    sentence += ' ' + closer;
  }
  if (fatigueHint) {
    sentence += fatigueHint;
  }
  return sentence;
};

BRAIN.prototype.composeWorkThought = function () {
  var personality = this.profile.personality || { openers: [], closers: [] };
  var openers = ['Off to my ' + this.profile.workplace + ' shift to refill the wallet', 'Clocking in at the ' + this.profile.workplace + ', chasing those bills', 'Heading to the ' + this.profile.workplace + ' before the day gets away'];
  var closer = this.pickLine(personality.closers);
  var line = this.pickLine(openers);
  if (closer) {
    line += ' ' + closer;
  }
  return line;
};

BRAIN.prototype.composeRestThought = function () {
  var fatigue = this.profile.fatigue;
  var personality = this.profile.personality || { openers: [], closers: [] };
  var restReasons = fatigue > 90 ? ['Eyes sting—home is the only answer', 'Too worn out; need to collapse for a bit', 'Every step feels heavy; home, now'] : ['Better recharge before the next shift', 'A quick breather will help me focus', 'Should rest up so I don’t drag tomorrow'];
  var opener = this.pickLine(personality.openers);
  var closer = this.pickLine(personality.closers);
  var line = this.pickLine(restReasons);
  var text = opener ? opener + ' ' + line : line;
  return closer ? text + ' ' + closer : text;
};

BRAIN.prototype.describeIntent = function (type, data) {
  if (type === 'WORK') {
    return this.composeWorkThought();
  }
  if (type === 'REST') {
    return this.composeRestThought();
  }
  if (type === 'FULFILL_NEED' && data && data.need) {
    var thought = this.composeNeedThought(data.need, data.emotion);
    var cost = this.getNeedCost(data.need);
    return cost ? thought + ' ($' + cost + ')' : thought;
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

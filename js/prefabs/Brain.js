var NEED_BALANCING = require('../data/brainNeedBalancing.json');

BRAIN = function (game) {
  this.game = game;
  this.needBalancing = NEED_BALANCING;
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
  this.profile.simTick = 0;
  this.profile.venueHistory = [];
  this.initializeNeedRuntimeData();


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
  var needsPool = (this.thoughts && this.thoughts.needs) ? this.thoughts.needs : [];
  var favoriteNeed = 'WATER';

  if (needsPool.length) {
    var poolIndex = this.getRandomRange(0, needsPool.length - 1);
    var pick = needsPool[poolIndex];
    if (pick && pick.maslow && pick.maslow.length) {
      favoriteNeed = pick.maslow[0].need;
    }
  }

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
    favoriteNeed: favoriteNeed,
    personality: personality,
    memory: {
      outcomes: {},
      venuePreferenceWeights: {},
      maxOutcomeHistory: 8
    }
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
  var economy = this.game && this.game.economy;
  if (economy && economy.needVenueMap && economy.needVenueMap[need]) {
    var venueSnapshot = economy.getVenueSnapshot(economy.needVenueMap[need]);
    if (venueSnapshot && venueSnapshot.price !== undefined) {
      return venueSnapshot.price;
    }
  }
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

BRAIN.prototype.getEconomy = function () {
  return this.game && this.game.economy ? this.game.economy : null;
};


BRAIN.prototype.getCity = function () {
  return this.game && this.game.city ? this.game.city : null;
};

BRAIN.prototype.ensureMemoryState = function () {
  if (!this.profile.memory) {
    this.profile.memory = { outcomes: {}, venuePreferenceWeights: {}, maxOutcomeHistory: 8 };
  }
  if (!this.profile.memory.outcomes) {
    this.profile.memory.outcomes = {};
  }
  if (!this.profile.memory.venuePreferenceWeights) {
    this.profile.memory.venuePreferenceWeights = {};
  }
  if (!this.profile.memory.maxOutcomeHistory) {
    this.profile.memory.maxOutcomeHistory = 8;
  }
  return this.profile.memory;
};

BRAIN.prototype.getNeedVenueOutcomeMemory = function (needName, venue) {
  var memory = this.ensureMemoryState();
  if (!memory.outcomes[needName]) {
    memory.outcomes[needName] = {};
  }
  if (!memory.outcomes[needName][venue]) {
    memory.outcomes[needName][venue] = { successes: [], failures: [] };
  }
  return memory.outcomes[needName][venue];
};

BRAIN.prototype.getVenuePreferenceWeight = function (needName, venue) {
  var memory = this.ensureMemoryState();
  if (!memory.venuePreferenceWeights[needName]) {
    memory.venuePreferenceWeights[needName] = {};
  }
  if (memory.venuePreferenceWeights[needName][venue] === undefined) {
    memory.venuePreferenceWeights[needName][venue] = 1;
  }
  return memory.venuePreferenceWeights[needName][venue];
};

BRAIN.prototype.adjustVenuePreferenceWeight = function (needName, venue, delta) {
  var memory = this.ensureMemoryState();
  var current = this.getVenuePreferenceWeight(needName, venue);
  memory.venuePreferenceWeights[needName][venue] = Math.max(0.35, Math.min(1.8, current + delta));
};

BRAIN.prototype.rememberVenueOutcome = function (needName, venue, wasSuccess) {
  if (!needName || !venue) {
    return;
  }
  var memory = this.ensureMemoryState();
  var bucket = this.getNeedVenueOutcomeMemory(needName, venue);
  var tick = this.profile.simTick || 0;
  if (wasSuccess) {
    bucket.successes.push(tick);
    this.adjustVenuePreferenceWeight(needName, venue, 0.08);
  } else {
    bucket.failures.push(tick);
    this.adjustVenuePreferenceWeight(needName, venue, -0.12);
  }
  if (bucket.successes.length > memory.maxOutcomeHistory) {
    bucket.successes.shift();
  }
  if (bucket.failures.length > memory.maxOutcomeHistory) {
    bucket.failures.shift();
  }
};

BRAIN.prototype.decayRecentFailurePenalty = function (needName, venue) {
  var bucket = this.getNeedVenueOutcomeMemory(needName, venue);
  if (bucket.failures.length === 0) {
    return 0;
  }
  var tick = this.profile.simTick || 0;
  var penalty = 0;
  for (var i = 0; i < bucket.failures.length; i++) {
    var age = Math.max(0, tick - bucket.failures[i]);
    penalty += 1.15 * Math.exp(-age / 65);
  }
  return Math.min(2.8, penalty);
};

BRAIN.prototype.getVenuePressurePenalty = function (venue, quote) {
  var economy = this.getEconomy();
  if (!economy || !economy.getVenueSnapshot) {
    return 0;
  }
  var snapshot = economy.getVenueSnapshot(venue);
  if (!snapshot) {
    return 0;
  }
  var crowdPenalty = Math.max(0, snapshot.demandPressure || 0) * 0.45;
  var queuePenalty = 0;
  if (quote && quote.reason === 'capacity') {
    queuePenalty = 2;
  } else if ((snapshot.operationalCapacity || 0) <= 1) {
    queuePenalty = 0.6;
  }
  return crowdPenalty + queuePenalty;
};

BRAIN.prototype.scoreVenueForNeed = function (needName, venue, quote) {
  var weight = this.getVenuePreferenceWeight(needName, venue);
  var memoryBonus = (weight - 1) * 1.5;
  var failurePenalty = this.decayRecentFailurePenalty(needName, venue);
  var pressurePenalty = this.getVenuePressurePenalty(venue, quote);
  var costPenalty = quote && quote.price ? (quote.price * 0.02) : 0;
  if (quote && !quote.ok) {
    return -999;
  }
  return 10 + memoryBonus - failurePenalty - pressurePenalty - costPenalty;
};

BRAIN.prototype.composeMemoryRouteMessage = function (needName, chosenVenue, skippedVenue) {
  if (!chosenVenue || !skippedVenue || chosenVenue === skippedVenue) {
    return '';
  }
  var skippedBucket = this.getNeedVenueOutcomeMemory(needName, skippedVenue);
  if (!skippedBucket.failures.length) {
    return '';
  }
  var lastFailureTick = skippedBucket.failures[skippedBucket.failures.length - 1];
  var age = (this.profile.simTick || 0) - lastFailureTick;
  if (age > 90) {
    return '';
  }
  return this.toTitleCase(skippedVenue) + ' was crowded earlier, trying ' + chosenVenue;
};

BRAIN.prototype.resolveVenueForNeed = function (needName) {
  var excludedVenues = arguments.length > 1 && arguments[1] ? arguments[1] : {};
  var need = this.findNeedByName(needName);
  if (!need || !need.acts || need.acts.length === 0) {
    return null;
  }

  var city = this.getCity();
  var economy = this.getEconomy();

  var primary = need.acts[0].toLowerCase();
  var candidates = [];
  var seen = {};

  for (var i = 0; i < need.acts.length; i++) {
    var venue = need.acts[i].toLowerCase();
    if (excludedVenues[venue] || seen[venue]) {
      continue;
    }
    seen[venue] = true;
    var quote = economy ? economy.requestService({ type: 'FULFILL_NEED', door: venue, need: needName }, this.profile) : { ok: true };
    if (city && !city.isVenueOperational(venue)) {
      continue;
    }
    if (quote && quote.ok) {
      candidates.push({
        venue: venue,
        quote: quote,
        rerouted: venue !== primary,
        score: this.scoreVenueForNeed(needName, venue, quote)
      });
    }
  }

  if (city && city.getVenueAlternatives) {
    var alternatives = city.getVenueAlternatives(primary, needName);
    for (var j = 0; j < alternatives.length; j++) {
      var alternative = alternatives[j];
      if (excludedVenues[alternative] || seen[alternative]) {
        continue;
      }
      seen[alternative] = true;
      var altQuote = economy ? economy.requestService({ type: 'FULFILL_NEED', door: alternative, need: needName }, this.profile) : { ok: true };
      if (altQuote && altQuote.ok) {
        candidates.push({
          venue: alternative,
          quote: altQuote,
          rerouted: true,
          score: this.scoreVenueForNeed(needName, alternative, altQuote)
        });
      }
    }
  }

  if (!candidates.length) {
    return null;
  }
  candidates.sort(function (a, b) {
    return b.score - a.score;
  });
  var chosen = candidates[0];
  chosen.memoryMessage = this.composeMemoryRouteMessage(needName, chosen.venue, primary);
  return chosen;
};

BRAIN.prototype.applyUnmetNeedPressure = function (needName, amount) {
  var need = this.findNeedByName(needName);
  if (need) {
    need.value = this.clampNeedValue(need.value + (amount || 3));
  }
  var economy = this.getEconomy();
  if (economy && economy.registerUnmetNeed) {
    economy.registerUnmetNeed(needName, 0.35);
  }
};


BRAIN.prototype.attachServiceQuote = function (intent) {
  if (!intent) {
    return intent;
  }
  var economy = this.getEconomy();
  if (!economy) {
    intent.quote = { ok: true, price: this.getNeedCost(intent.need), reason: 'legacy' };
    return intent;
  }
  intent.quote = economy.requestService(intent, this.profile);
  return intent;
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

BRAIN.prototype.toTitleCase = function (value) {
  if (!value) {
    return 'venue';
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
};

BRAIN.prototype.queueDeferredIntent = function (intent) {
  this.profile.deferredIntent = intent || null;
};

BRAIN.prototype.consumeDeferredIntent = function () {
  var deferred = this.profile.deferredIntent || null;
  this.profile.deferredIntent = null;
  return deferred;
};

BRAIN.prototype.applyFailureState = function (needName, pressure, emotion) {
  if (!needName) {
    return;
  }
  var need = this.findNeedByName(needName);
  if (!need) {
    return;
  }
  var amount = pressure || 2;
  need.value = this.clampNeedValue(need.value + amount);
  if (emotion) {
    need.emotion = emotion;
  }
  this.applyUnmetNeedPressure(needName, amount * 0.15);
};

BRAIN.prototype.mapServiceStatus = function (intent, quote) {
  if (!intent || intent.type === 'REST') {
    return 'SUCCESS';
  }
  if (!quote) {
    return 'DEFER';
  }
  if (quote.ok) {
    if (intent.type === 'FULFILL_NEED' && this.profile.wallet < quote.price) {
      return 'TOO_EXPENSIVE';
    }
    return 'SUCCESS';
  }
  if (quote.reason === 'capacity') {
    return 'QUEUE';
  }
  if (quote.reason === 'stock') {
    return 'OUT_OF_STOCK';
  }
  if (quote.reason === 'closed' || quote.reason === 'no_venue') {
    return 'CLOSED';
  }
  return 'DEFER';
};

BRAIN.prototype.requestServiceStatus = function (intent) {
  var economy = this.getEconomy();
  if (!intent || intent.type === 'REST') {
    return { status: 'SUCCESS', quote: { ok: true, reason: 'rested', price: 0 } };
  }
  if (!economy) {
    return { status: 'SUCCESS', quote: { ok: true, reason: 'legacy', price: this.getNeedCost(intent.need) } };
  }
  var quote = economy.requestService(intent, this.profile);
  intent.quote = quote;
  return {
    status: this.mapServiceStatus(intent, quote),
    quote: quote
  };
};

BRAIN.prototype.makeWorkIntentFromFailure = function (reasonText) {
  var workIntent = this.buildIntent('WORK', this.profile.workplace, this.game.world.centerX, 'Need to earn first', 'MONEY');
  workIntent.message = reasonText + ', taking a work shift';
  return this.attachServiceQuote(workIntent);
};

BRAIN.prototype.makeNeedIntentFromRoute = function (needName, route, reasonText) {
  var need = this.findNeedByName(needName);
  var emotion = need ? need.emotion : 'Trying a different spot';
  var intent = this.buildIntent('FULFILL_NEED', route.venue, this.game.world.centerX, emotion, needName);
  intent.quote = route.quote;
  intent.rerouted = true;
  intent.message = reasonText + ', trying ' + route.venue;
  return intent;
};

BRAIN.prototype.handleArrival = function (intent) {
  if (!intent) {
    return { nextIntent: this.chooseIntent(), waitMs: Phaser.Timer.SECOND * 4 };
  }

  var service = this.requestServiceStatus(intent);
  var venueName = this.toTitleCase(intent.door);
  var status = service.status;

  if (status === 'SUCCESS') {
    this.resolveIntent(intent);
    return {
      status: status,
      waitMs: Phaser.Timer.SECOND * 4,
      nextIntent: this.chooseIntent(),
      bubbleMessage: intent.message
    };
  }

  if (status === 'QUEUE') {
    this.rememberVenueOutcome(intent.need, intent.door, false);
    this.applyFailureState(intent.need, 1.5, 'Queue is long and patience is thinning');
    var queueIntent = {
      type: intent.type,
      door: intent.door,
      goal: intent.goal,
      need: intent.need,
      message: venueName + ' line is packed, waiting in queue',
      queued: true
    };
    this.queueDeferredIntent(queueIntent);
    return { status: status, waitMs: Phaser.Timer.SECOND * 6, bubbleMessage: queueIntent.message };
  }

  if ((status === 'CLOSED' || status === 'OUT_OF_STOCK') && intent.need) {
    this.rememberVenueOutcome(intent.need, intent.door, false);
    this.applyFailureState(intent.need, 2.5, 'Need is still unresolved after a failed stop');
    var excluded = {};
    if (intent.door) {
      excluded[intent.door] = true;
    }
    var route = this.resolveVenueForNeed(intent.need, excluded);
    var reasonMessage = status === 'CLOSED' ? venueName + ' closed' : venueName + ' out of stock';
    if (route) {
      var rerouteIntent = this.makeNeedIntentFromRoute(intent.need, route, reasonMessage);
      this.queueDeferredIntent(rerouteIntent);
      return { status: status, waitMs: Phaser.Timer.SECOND * 3, bubbleMessage: rerouteIntent.message };
    }
    var deferIntent = this.buildIntent('REST', null, this.profile.homeX, 'No alternatives, deferring for now', intent.need);
    deferIntent.message = reasonMessage + ', deferring until later';
    this.queueDeferredIntent(deferIntent);
    return { status: 'DEFER', waitMs: Phaser.Timer.SECOND * 5, bubbleMessage: deferIntent.message };
  }

  if (status === 'TOO_EXPENSIVE') {
    this.rememberVenueOutcome(intent.need, intent.door, false);
    if (intent.need) {
      this.applyFailureState(intent.need, 3, 'Prices spiked and the need remains urgent');
    }
    var workIntent = this.makeWorkIntentFromFailure(venueName + ' is too expensive');
    this.queueDeferredIntent(workIntent);
    return { status: status, waitMs: Phaser.Timer.SECOND * 2, bubbleMessage: workIntent.message };
  }

  if (intent.need) {
    this.rememberVenueOutcome(intent.need, intent.door, false);
    this.applyFailureState(intent.need, 2, 'Could not get service, holding the plan');
  }
  this.queueDeferredIntent(intent);
  return { status: 'DEFER', waitMs: Phaser.Timer.SECOND * 5, bubbleMessage: 'Service failed, trying again soon' };
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
    var cost = data.price !== undefined ? data.price : this.getNeedCost(data.need);
    return cost ? thought + ' ($' + cost + ')' : thought;
  }
  return data && data.emotion ? data.emotion : 'On the move';
};

BRAIN.prototype.initializeNeedRuntimeData = function () {
  for (var i = 0; i < this.thoughts.needs.length; i++) {
    var tierName = this.getTierName(i);
    var tierNeeds = this.thoughts.needs[i].maslow;
    for (var j = 0; j < tierNeeds.length; j++) {
      tierNeeds[j].tier = tierName;
      tierNeeds[j].lastServedVenue = null;
      tierNeeds[j].lastServedTick = -99999;
    }
  }
};

BRAIN.prototype.decayMemory = function () {
  var memory = this.ensureMemoryState();
  var revertRate = 0.004;
  var pruneAfterTicks = 240;
  var tick = this.profile.simTick || 0;
  var needKeys = Object.keys(memory.venuePreferenceWeights);
  for (var i = 0; i < needKeys.length; i++) {
    var needName = needKeys[i];
    var venueWeights = memory.venuePreferenceWeights[needName];
    var venues = Object.keys(venueWeights);
    for (var j = 0; j < venues.length; j++) {
      var venue = venues[j];
      var current = venueWeights[venue];
      venueWeights[venue] = current + (1 - current) * revertRate;
    }
  }

  var outcomeNeeds = Object.keys(memory.outcomes);
  for (var n = 0; n < outcomeNeeds.length; n++) {
    var outcomeNeed = outcomeNeeds[n];
    var outcomeVenues = Object.keys(memory.outcomes[outcomeNeed]);
    for (var v = 0; v < outcomeVenues.length; v++) {
      var key = outcomeVenues[v];
      var bucket = memory.outcomes[outcomeNeed][key];
      bucket.successes = bucket.successes.filter(function (t) { return (tick - t) <= pruneAfterTicks; });
      bucket.failures = bucket.failures.filter(function (t) { return (tick - t) <= pruneAfterTicks; });
    }
  }
};

BRAIN.prototype.getTierName = function (tierIndex) {
  var order = this.needBalancing.tierOrder;
  return order[tierIndex] || order[order.length - 1];
};

BRAIN.prototype.clampNeedValue = function (value) {
  var clamp = this.needBalancing.clamp;
  return Math.max(clamp.min, Math.min(clamp.max, value));
};

BRAIN.prototype.getNeedCurve = function (needName) {
  var curves = this.needBalancing.needCurves || {};
  return curves[needName] || this.needBalancing.defaultCurve;
};

BRAIN.prototype.getTierGateMultiplier = function (tierIndex, lowerTierStable, normalizedDeficit) {
  var gating = this.needBalancing.gating;
  if (tierIndex === 0) {
    return 1;
  }
  if (lowerTierStable) {
    return 1 + gating.stableLowerTierBoost * normalizedDeficit;
  }
  return gating.unstableLowerTierMultiplier;
};

BRAIN.prototype.getNeedCooldownPenalty = function (need) {
  if (!need) {
    return 0;
  }
  var cooldown = this.needBalancing.cooldown;
  var history = this.profile.venueHistory || [];
  if (!need.lastServedVenue || history.length === 0) {
    return 0;
  }

  var repeatCount = 0;
  for (var i = history.length - 1; i >= 0; i--) {
    if ((this.profile.simTick - history[i].tick) > cooldown.lookbackTicks) {
      break;
    }
    if (history[i].venue === need.lastServedVenue) {
      repeatCount += 1;
    }
  }

  var sinceLastServed = this.profile.simTick - (need.lastServedTick || 0);
  if (sinceLastServed <= cooldown.graceTicks) {
    repeatCount += cooldown.recentVisitBonusCount;
  }
  return repeatCount * cooldown.penaltyPerRepeat;
};

BRAIN.prototype.getWeight= function (x,y,i) {
  var clampedValue = this.clampNeedValue(y);
  var tierName = this.getTierName(i);
  var tierUrgency = this.needBalancing.tierUrgency[tierName] || 1;
  var normalizedDeficit = (this.needBalancing.clamp.max - clampedValue) / this.needBalancing.clamp.max;
  normalizedDeficit = Math.max(0, Math.min(1, normalizedDeficit));
  var deficitCurve = Math.pow(normalizedDeficit, this.needBalancing.weightCurve.deficitExponent);
  return x * tierUrgency * (this.needBalancing.weightCurve.baseline + deficitCurve);
};

BRAIN.prototype.life = function () {
  this.profile.simTick += 1;
  this.decayMemory();
  var lowerTierStable = true;
  for ( var i = 0; i < this.thoughts.needs.length; i++) {
    var needs = this.thoughts.needs[i];
    var tierDeficitPeak = 0;
    for(var j = 0; j< needs.maslow.length;j++){
      var need = needs.maslow[j];
      var curve = this.getNeedCurve(need.need);
      need.value = this.clampNeedValue(need.value + curve.decayPerTick - curve.passiveRecoveryPerTick);
      var normalizedDeficit = (this.needBalancing.clamp.max - need.value) / this.needBalancing.clamp.max;
      tierDeficitPeak = Math.max(tierDeficitPeak, normalizedDeficit);
      var gateMultiplier = this.getTierGateMultiplier(i, lowerTierStable, normalizedDeficit);
      need.weight = this.getWeight(need.baseWeight, need.value, i) * gateMultiplier;
      need.weight = Math.max(0, need.weight - this.getNeedCooldownPenalty(need));
    }
    lowerTierStable = lowerTierStable && tierDeficitPeak <= this.needBalancing.gating.lowerTierDeficitThreshold;
  }
  this.profile.fatigue = Math.min(100, this.profile.fatigue + 0.05);
  if (this.profile.wallet < 10) {
    var moneyNeed = this.findNeedByName('MONEY');
    if (moneyNeed) {
      moneyNeed.value = this.clampNeedValue(moneyNeed.value + 0.5);
    }
  }
  if (this.getCurrentHour() > 21 || this.getCurrentHour() < 6) {
    var warmthNeed = this.findNeedByName('WARMTH');
    if (warmthNeed) {
      warmthNeed.value = this.clampNeedValue(warmthNeed.value - 0.3);
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
    return this.attachServiceQuote(workIntent);
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
    return this.attachServiceQuote(brokeIntent);
  }
  var route = this.resolveVenueForNeed(topNeed.need);
  if (!route) {
    this.applyUnmetNeedPressure(topNeed.need, 4);
    var fallbackIntent = this.buildIntent('REST', null, this.profile.homeX, 'No safe venue is open; heading home', topNeed.need);
    fallbackIntent.message = this.describeIntent('REST') + ' Service outage is making needs worse.';
    return fallbackIntent;
  }

  var intent = this.buildIntent('FULFILL_NEED', route.venue, this.game.world.centerX, topNeed.emotion, topNeed.need);
  intent.quote = route.quote;
  intent.rerouted = !!route.rerouted;
  if (route.memoryMessage) {
    intent.message = route.memoryMessage + '. ' + this.describeIntent('FULFILL_NEED', { need: topNeed.need, emotion: topNeed.emotion, price: intent.quote && intent.quote.price });
  } else if (intent.rerouted) {
    intent.message = 'Rerouting to ' + route.venue + ' due to disruption. ' + this.describeIntent('FULFILL_NEED', { need: topNeed.need, emotion: topNeed.emotion, price: intent.quote && intent.quote.price });
  } else {
    intent.message = this.describeIntent('FULFILL_NEED', { need: topNeed.need, emotion: topNeed.emotion, price: intent.quote && intent.quote.price });
  }
  return intent;
};

BRAIN.prototype.resolveIntent = function (intent) {
  if (!intent) {
    return;
  }
  var economy = this.getEconomy();
  var settlement = null;
  if (economy) {
    settlement = economy.settleTransaction(intent, this.profile);
    this.profile.wallet = Math.max(0, this.profile.wallet + settlement.walletDelta);
  }
  if (intent.type === 'WORK') {
    if (!economy) {
      this.profile.wallet += this.profile.income;
    }
    var moneyNeed = this.findNeedByName('MONEY');
    if (moneyNeed && (!settlement || settlement.ok)) {
      moneyNeed.value = this.clampNeedValue(moneyNeed.value - this.getNeedCurve('MONEY').recoveryOnResolve);
      moneyNeed.emotion = "Wallet's breathing again after that shift";
    }
    if (!settlement || settlement.ok) {
      this.profile.fatigue = Math.min(100, this.profile.fatigue + 5);
    }
  }

  if (intent.type === 'FULFILL_NEED' && intent.need) {
    var need = this.findNeedByName(intent.need);
    if (need && (!settlement || settlement.ok)) {
      this.rememberVenueOutcome(intent.need, intent.door, true);
      var recovery = this.getNeedCurve(intent.need).recoveryOnResolve;
      need.value = this.clampNeedValue(need.value - recovery);
      need.emotion = "That helped; the pressure eased for now";
      this.profile.fatigue = Math.max(0, this.profile.fatigue - 2);
      need.lastServedVenue = intent.door || null;
      need.lastServedTick = this.profile.simTick;
      this.profile.venueHistory.push({
        venue: intent.door || 'unknown',
        tick: this.profile.simTick
      });
      if (this.profile.venueHistory.length > this.needBalancing.cooldown.historyLimit) {
        this.profile.venueHistory.shift();
      }
    } else if (need && settlement && !settlement.ok) {
      this.rememberVenueOutcome(intent.need, intent.door, false);
      need.value = this.clampNeedValue(need.value + 2);
      this.applyUnmetNeedPressure(intent.need, 2);
      need.emotion = "Didn't get served; still chasing relief";
    }
    if (!economy && need) {
      var cost = this.getNeedCost(intent.need);
      this.profile.wallet = Math.max(0, this.profile.wallet - cost);
    }
  }

  if (intent.type === 'REST') {
    var securityNeed = this.findNeedByName('SECURITY');
    if (securityNeed) {
      securityNeed.value = Math.max(0, securityNeed.value - 10);
    }
    this.profile.fatigue = Math.max(0, this.profile.fatigue - 25);
  }
  intent.outcome = settlement;
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

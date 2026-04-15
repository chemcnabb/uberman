
CITY = function (game,  x, y) {
  Phaser.Sprite.call(this, game, x, y, '', 0);
  this.game = game;
  this.buildings = this.game.add.group();
  this.game.doors = {};
  this.game.fade = {};

  this.building_data = [
    {"building":1, "ground":37, "floor":25, "top":34, "earth":270, "max_height":40},
    {"building":2, "ground":0, "floor":52, "top":78, "earth":250, "max_height":45},
    {"building":3, "ground":0, "floor":136, "top":111, "earth":260, "max_height":20},
    {"building":4, "ground":0, "floor":52, "top":166, "earth":295, "max_height":20}
  ];

  this.serviceTypes = {
    hydration: { venues: ['cafe'], severity: 0, state: 'stable', recoveryTimerMs: 0, rebuildCost: 0, laborRequired: 0 },
    food: { venues: ['bakery'], severity: 0, state: 'stable', recoveryTimerMs: 0, rebuildCost: 0, laborRequired: 0 },
    shelter: { venues: ['library'], severity: 0, state: 'stable', recoveryTimerMs: 0, rebuildCost: 0, laborRequired: 0 },
    finance: { venues: ['bank'], severity: 0, state: 'stable', recoveryTimerMs: 0, rebuildCost: 0, laborRequired: 0 },
    culture: { venues: ['bookstore', 'library'], severity: 0, state: 'stable', recoveryTimerMs: 0, rebuildCost: 0, laborRequired: 0 }
  };
  this.venueServiceTypeMap = {
    cafe: 'hydration',
    bakery: 'food',
    library: 'shelter',
    bank: 'finance',
    bookstore: 'culture'
  };

  this.damageStates = {
    destroyed: { capacityMultiplier: 0, inventoryMultiplier: 0, durationMs: 90000, costMultiplier: 1.4, laborMultiplier: 1.8 },
    degraded: { capacityMultiplier: 0.45, inventoryMultiplier: 0.5, durationMs: 55000, costMultiplier: 1.0, laborMultiplier: 1.2 },
    recovering: { capacityMultiplier: 0.75, inventoryMultiplier: 0.8, durationMs: 35000, costMultiplier: 0.6, laborMultiplier: 0.6 },
    stable: { capacityMultiplier: 1, inventoryMultiplier: 1, durationMs: 0, costMultiplier: 0, laborMultiplier: 0 }
  };

  this.damageModel = {
    instability: 0,
    instabilityDecayPerSecond: 0.035,
    lastUpdateAt: this.game.time.now,
    venueStatus: {},
    debugLines: []
  };

  this.addOrderedBuildings();
  this.addBank();
  this.addLibrary();
  this.addBakery();
  this.addCafe();
  this.addBookstore();
  this.addBuildingsToGame();

  this.initializeDamageModel();
};

CITY.prototype = Object.create(Phaser.Sprite.prototype);
CITY.prototype.constructor = CITY;

CITY.prototype.initializeDamageModel = function () {
  var venues = ['bank', 'bakery', 'cafe', 'library', 'bookstore'];
  for (var i = 0; i < venues.length; i++) {
    this.damageModel.venueStatus[venues[i]] = {
      venue: venues[i],
      state: 'stable',
      severity: 0,
      recoveryTimerMs: 0,
      rebuildCost: 0,
      laborRequired: 0,
      unavailable: false,
      capacityModifier: 1,
      inventoryModifier: 1,
      source: null
    };
  }
};

CITY.prototype.shuffleGroupChildren = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

CITY.prototype.addBuildingsToGame = function () {
  var counter = 0;
  var startX = 200;
  var buildingWidth;

  var building_data = this.building_data;
  this.buildings.children = this.shuffleGroupChildren(this.buildings.children);

  for (var bcount = 0; bcount < this.buildings.children.length; bcount++) {
    var sprite = this.buildings.children[bcount];
    var type = sprite instanceof Phaser.Group;

    if (type === false) {
      sprite.exists = true;
      sprite.x = startX;
      this.game.doors[sprite.key] = this.game.add.sprite(sprite.centerX, sprite.y + sprite.height - 40, 'door');
      this.game.doors[sprite.key].anchor.setTo(0.5, 0.5);

      buildingWidth = sprite.width;
      counter += 1;
    } else {

      var nextY = sprite.game.world.height - 270;
      var heightCount = 0;

      for (var gcount = 0; gcount < sprite.children.length; gcount++) {
        var deepSprite = sprite.children[gcount];

        var data = deepSprite.key.split('_');
        var level = data[0];
        var level_data;
        var building_num = data[1];
        deepSprite.exists = true;
        deepSprite.x = startX;

        for (var i = 0; i < building_data.length; i++) {
          var building_level = building_data[i];

          if (building_level.building === parseInt(building_num)) {
            level_data = building_level;
            break;

          }
        }

        switch (level) {
          case 'ground':
            nextY = sprite.game.world.height - (level_data.earth + level_data.ground);
            break;
          case 'floor':
            nextY = (sprite.game.world.height - (level_data.earth + level_data.ground + (level_data.floor * heightCount)));
            break;
          case 'top':
            nextY = (sprite.game.world.height - (level_data.earth + level_data.ground + (level_data.floor * (heightCount - 1))) - (level_data.top));
            break;
        }

        deepSprite.y = nextY;

        buildingWidth = deepSprite.width;
        counter += 1;
        heightCount += 1;
      }
    }

    startX = startX + buildingWidth + sprite.game.rnd.integerInRange(0, 15);
  }
};

CITY.prototype.addLibrary = function () {
  this.buildings.create(0, this.game.world.height - 440, 'library', 0, false);
};
CITY.prototype.addBakery = function () {
  this.buildings.create(0, this.game.world.height - 495, 'bakery', 0, false);

};
CITY.prototype.addCafe = function () {
  this.buildings.create(0, this.game.world.height - 495, 'cafe', 0, false);

};
CITY.prototype.addBookstore = function () {
  this.buildings.create(0, this.game.world.height - 495, 'bookstore', 0, false);

};

CITY.prototype.addBank = function () {
  this.buildings.create(0, this.game.world.height - 488, 'bank', 0, false);
};

CITY.prototype.addRandomBuildings = function () {
  for (var i = 0; i < this.game.rnd.integerInRange(10, 100); i++) {
    var building = this.building_data[this.game.rnd.integerInRange(0, this.building_data.length - 1)];
    this.createBuilding(
      ['ground_' + building.building, building.ground],
      ['floor_' + building.building, building.floor],
      ['top_' + building.building, building.top],
      building.earth, building.max_height);
  }
};

CITY.prototype.addOrderedBuildings = function () {
  for (var i = 0; i < this.building_data.length; i++) {
    var building = this.building_data[i];

    var building_added = this.createBuilding(
      ['ground_' + building.building, building.ground],
      ['floor_' + building.building, building.floor],
      ['top_' + building.building, building.top], building.max_height);
    this.buildings.add(building_added);
  }
};

CITY.prototype.createBuilding = function (ground, floor, top, max_height) {
  var height = this.game.rnd.integerInRange(10, max_height);
  var floored_building = this.game.add.group();

  floored_building.create(0, 0, ground[0], 0, false);

  for (var i = 0; i < height; i++) {
    floored_building.create(0, 0, floor[0], 0, false);
  }

  floored_building.create(0, 0, top[0], 0, false);

  return floored_building;
};

CITY.prototype.getRecoveryProfile = function (state, severity) {
  var template = this.damageStates[state] || this.damageStates.degraded;
  var normalizedSeverity = Math.max(0.1, Math.min(1, severity || 0.5));
  return {
    state: state,
    capacityModifier: template.capacityMultiplier,
    inventoryModifier: template.inventoryMultiplier,
    recoveryTimerMs: Math.ceil(template.durationMs * (0.7 + normalizedSeverity)),
    rebuildCost: Math.ceil((140 + normalizedSeverity * 420) * template.costMultiplier),
    laborRequired: Math.ceil((35 + normalizedSeverity * 130) * template.laborMultiplier)
  };
};

CITY.prototype.markVenueDamage = function (venue, state, options) {
  var venueState = this.damageModel.venueStatus[venue];
  if (!venueState) {
    return null;
  }

  var damageState = this.damageStates[state] ? state : 'degraded';
  var severity = options && options.severity !== undefined ? options.severity : 0.5;
  var profile = this.getRecoveryProfile(damageState, severity);

  venueState.state = damageState;
  venueState.severity = severity;
  venueState.recoveryTimerMs = profile.recoveryTimerMs;
  venueState.rebuildCost = profile.rebuildCost;
  venueState.laborRequired = profile.laborRequired;
  venueState.unavailable = damageState === 'destroyed';
  venueState.capacityModifier = profile.capacityModifier;
  venueState.inventoryModifier = profile.inventoryModifier;
  venueState.source = options && options.source ? options.source : 'incident';

  this.damageModel.instability = Math.min(1.5, this.damageModel.instability + (0.2 + severity * 0.55));

  return venueState;
};

CITY.prototype.markServiceDamage = function (serviceType, state, options) {
  var service = this.serviceTypes[serviceType];
  if (!service) {
    return;
  }
  service.state = state;
  service.severity = Math.max(service.severity || 0, options && options.severity !== undefined ? options.severity : 0.5);

  for (var i = 0; i < service.venues.length; i++) {
    this.markVenueDamage(service.venues[i], state, options);
  }
};

CITY.prototype.markVenueUnavailable = function (venue, source) {
  return this.markVenueDamage(venue, 'destroyed', { severity: 0.85, source: source || 'battle' });
};

CITY.prototype.markVenueReducedCapacity = function (venue, severity, source) {
  return this.markVenueDamage(venue, 'degraded', { severity: severity || 0.45, source: source || 'catastrophe' });
};

CITY.prototype.triggerCatastrophe = function (options) {
  var intensity = options && options.intensity !== undefined ? options.intensity : this.game.rnd.frac();
  var allVenues = Object.keys(this.damageModel.venueStatus);
  var hitCount = Math.max(1, Math.min(allVenues.length, Math.ceil(1 + intensity * 3)));
  var impacted = [];

  for (var i = 0; i < hitCount; i++) {
    var venue = allVenues[this.game.rnd.integerInRange(0, allVenues.length - 1)];
    if (impacted.indexOf(venue) !== -1) {
      continue;
    }
    impacted.push(venue);
    if (this.game.rnd.frac() < 0.35 + intensity * 0.4) {
      this.markVenueUnavailable(venue, 'catastrophe');
    } else {
      this.markVenueReducedCapacity(venue, 0.35 + intensity * 0.55, 'catastrophe');
    }
  }

  this.damageModel.instability = Math.min(1.8, this.damageModel.instability + 0.25 + intensity * 0.8);
};

CITY.prototype.getVenueStatus = function (venue) {
  return this.damageModel.venueStatus[venue] || null;
};

CITY.prototype.isVenueOperational = function (venue) {
  var status = this.getVenueStatus(venue);
  return !status || status.state !== 'destroyed';
};

CITY.prototype.getVenueAlternatives = function (venue, needName) {
  var economy = this.game && this.game.economy;
  var serviceType = this.venueServiceTypeMap[venue] || null;

  if (!serviceType && economy && economy.needVenueMap && needName) {
    serviceType = this.venueServiceTypeMap[economy.needVenueMap[needName]];
  }

  if (!serviceType || !this.serviceTypes[serviceType]) {
    return [];
  }

  var possibilities = this.serviceTypes[serviceType].venues;
  var alternatives = [];

  for (var i = 0; i < possibilities.length; i++) {
    var candidate = possibilities[i];
    if (candidate === venue) {
      continue;
    }
    var damage = this.getVenueStatus(candidate);
    if (damage && damage.state === 'destroyed') {
      continue;
    }
    if (economy && economy.isVenueClosedForDisruption && economy.isVenueClosedForDisruption(candidate)) {
      continue;
    }
    alternatives.push(candidate);
  }

  return alternatives;
};

CITY.prototype.advanceVenueRecovery = function (venueState, deltaMs) {
  if (venueState.state === 'stable') {
    return;
  }

  venueState.recoveryTimerMs = Math.max(0, venueState.recoveryTimerMs - deltaMs);
  if (venueState.recoveryTimerMs > 0) {
    return;
  }

  if (venueState.state === 'destroyed') {
    var recovering = this.getRecoveryProfile('recovering', venueState.severity || 0.5);
    venueState.state = 'recovering';
    venueState.unavailable = false;
    venueState.capacityModifier = recovering.capacityModifier;
    venueState.inventoryModifier = recovering.inventoryModifier;
    venueState.recoveryTimerMs = recovering.recoveryTimerMs;
    venueState.rebuildCost = Math.ceil(venueState.rebuildCost * 0.55);
    venueState.laborRequired = Math.ceil(venueState.laborRequired * 0.5);
    return;
  }

  if (venueState.state === 'degraded') {
    var recoveringProfile = this.getRecoveryProfile('recovering', venueState.severity || 0.45);
    venueState.state = 'recovering';
    venueState.capacityModifier = recoveringProfile.capacityModifier;
    venueState.inventoryModifier = recoveringProfile.inventoryModifier;
    venueState.recoveryTimerMs = recoveringProfile.recoveryTimerMs;
    venueState.rebuildCost = Math.ceil(venueState.rebuildCost * 0.45);
    venueState.laborRequired = Math.ceil(venueState.laborRequired * 0.55);
    return;
  }

  venueState.state = 'stable';
  venueState.severity = 0;
  venueState.rebuildCost = 0;
  venueState.laborRequired = 0;
  venueState.unavailable = false;
  venueState.capacityModifier = 1;
  venueState.inventoryModifier = 1;
  venueState.recoveryTimerMs = 0;
};

CITY.prototype.applyRecoveryEconomics = function (venueState, deltaMs) {
  var economy = this.game && this.game.economy;
  if (!economy || venueState.state === 'stable') {
    return;
  }
  var venue = economy.venues[venueState.venue];
  if (!venue) {
    return;
  }

  var repairBudgetPerSecond = Math.max(2, Math.floor(Math.max(0, venue.balance + 80) * 0.04));
  var laborBudgetPerSecond = Math.max(1, Math.floor(venue.staffCount * venue.wage * 0.08));

  var dtSeconds = Math.max(0.016, deltaMs / 1000);
  var repairSpend = Math.min(venueState.rebuildCost, Math.ceil(repairBudgetPerSecond * dtSeconds));
  var laborSpend = Math.min(venueState.laborRequired, Math.ceil(laborBudgetPerSecond * dtSeconds));

  venueState.rebuildCost = Math.max(0, venueState.rebuildCost - repairSpend);
  venueState.laborRequired = Math.max(0, venueState.laborRequired - laborSpend);

  if (repairSpend > 0) {
    venue.balance = Math.max(-450, venue.balance - repairSpend);
  }
  if (laborSpend > 0) {
    venue.balance = Math.max(-450, venue.balance - Math.ceil(laborSpend * 0.25));
  }

  if (venueState.rebuildCost === 0 && venueState.laborRequired === 0) {
    venueState.recoveryTimerMs = Math.min(venueState.recoveryTimerMs, Math.ceil(2200 + (1 - Math.max(0, venue.balance) / 900) * 3000));
  }
};

CITY.prototype.pushDisruptionToEconomy = function () {
  var economy = this.game && this.game.economy;
  if (!economy || !economy.applyDisruptionSnapshot) {
    return;
  }
  economy.applyDisruptionSnapshot(this.damageModel.venueStatus, this.damageModel.instability);
};

CITY.prototype.updateDebugLines = function () {
  var keys = Object.keys(this.damageModel.venueStatus);
  var lines = ['CITY INSTABILITY ' + this.damageModel.instability.toFixed(2)];

  for (var i = 0; i < keys.length; i++) {
    var status = this.damageModel.venueStatus[keys[i]];
    var timerSeconds = Math.ceil((status.recoveryTimerMs || 0) / 1000);
    lines.push(
      status.venue.toUpperCase() + ': ' + status.state +
      ' cap x' + status.capacityModifier.toFixed(2) +
      ' t-' + timerSeconds + 's' +
      (status.rebuildCost > 0 ? ' $' + status.rebuildCost : '') +
      (status.laborRequired > 0 ? ' L' + status.laborRequired : '')
    );
  }

  this.damageModel.debugLines = lines;
};

CITY.prototype.getDebugDamageLines = function () {
  return this.damageModel.debugLines || [];
};

CITY.prototype.animateDamage = function () {

};

CITY.prototype.updateDamageModel = function (deltaMs) {
  var dt = deltaMs || Math.max(16, this.game.time.now - this.damageModel.lastUpdateAt);
  this.damageModel.lastUpdateAt = this.game.time.now;

  if (this.game.rnd.frac() < (0.00002 + Math.max(0, this.damageModel.instability) * 0.0003)) {
    this.triggerCatastrophe({ intensity: Math.min(1, 0.25 + this.damageModel.instability) });
  }

  var keys = Object.keys(this.damageModel.venueStatus);
  for (var i = 0; i < keys.length; i++) {
    var venueState = this.damageModel.venueStatus[keys[i]];
    this.applyRecoveryEconomics(venueState, dt);
    this.advanceVenueRecovery(venueState, dt);
  }

  this.damageModel.instability = Math.max(0, this.damageModel.instability - this.damageModel.instabilityDecayPerSecond * (dt / 1000));

  this.pushDisruptionToEconomy();
  this.updateDebugLines();
};

CITY.prototype.update = function () {
  var deltaMs = this.game.time.elapsedMS || 16;

  this.game.back.x -= this.game.player.body.velocity.x * (0.001);
  this.game.fade.x -= this.game.player.body.velocity.x * (0.0005);

  this.game.back.y -= this.game.player.body.velocity.y * (0.001);
  this.game.fade.y -= this.game.player.body.velocity.y * (0.0005);

  this.updateDamageModel(deltaMs);
};

module.exports = CITY;

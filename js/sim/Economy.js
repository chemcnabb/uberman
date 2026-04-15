var Economy = function (game) {
  this.game = game;
  this.rebalanceIntervalMs = 12000;
  this.timeSinceRebalance = 0;
  this.lastRebalanceAt = 0;

  this.venueOrder = ['bank', 'bakery', 'cafe', 'library', 'bookstore'];
  this.needVenueMap = {
    WATER: 'cafe',
    FOOD: 'bakery',
    SECURITY: 'library',
    MONEY: 'bank',
    WARMTH: 'library',
    FRIENDSHIP: 'bank',
    INTIMACY: 'library',
    FAMILY: 'bank',
    CONFIDENCE: 'library',
    ART: 'bookstore',
    EDUCATION: 'library'
  };

  this.venues = {
    bank: this.createVenue('bank', {
      serviceCapacity: 4,
      tellerSlots: 4,
      basePrice: 1,
      wage: 16,
      staffCount: 3,
      inventoryMax: 0,
      restockUnitCost: 0,
      openingBalance: 450
    }),
    bakery: this.createVenue('bakery', {
      serviceCapacity: 7,
      seats: 6,
      basePrice: 6,
      wage: 11,
      staffCount: 2,
      inventoryMax: 36,
      inventory: 18,
      restockUnitCost: 2,
      openingBalance: 220
    }),
    cafe: this.createVenue('cafe', {
      serviceCapacity: 8,
      seats: 8,
      basePrice: 4,
      wage: 10,
      staffCount: 2,
      inventoryMax: 44,
      inventory: 22,
      restockUnitCost: 2,
      openingBalance: 220
    }),
    library: this.createVenue('library', {
      serviceCapacity: 9,
      seats: 12,
      basePrice: 3,
      wage: 9,
      staffCount: 2,
      inventoryMax: 22,
      inventory: 16,
      restockUnitCost: 1,
      openingBalance: 260
    }),
    bookstore: this.createVenue('bookstore', {
      serviceCapacity: 5,
      seats: 4,
      basePrice: 8,
      wage: 10,
      staffCount: 2,
      inventoryMax: 28,
      inventory: 12,
      restockUnitCost: 3,
      openingBalance: 240
    })
  };
};

Economy.prototype.createVenue = function (key, options) {
  var venue = {
    key: key,
    open: true,
    serviceCapacity: options.serviceCapacity || 1,
    tellerSlots: options.tellerSlots || 0,
    seats: options.seats || 0,
    inventoryMax: options.inventoryMax || 0,
    inventory: options.inventory || 0,
    basePrice: options.basePrice || 1,
    dynamicPrice: options.basePrice || 1,
    restockUnitCost: options.restockUnitCost || 0,
    wage: options.wage || 0,
    staffCount: options.staffCount || 1,
    balance: options.openingBalance || 0,
    demandPressure: 0,
    cycleRequests: 0,
    cycleServed: 0,
    cycleFailures: 0,
    accounting: {
      revenue: 0,
      expenses: 0,
      payroll: 0,
      restock: 0,
      transactions: 0,
      failedRequests: 0
    }
  };
  venue.dynamicPrice = this.computeDynamicPrice(venue);
  return venue;
};

Economy.prototype.resolveVenueForIntent = function (intent) {
  if (!intent) {
    return null;
  }
  if (intent.door && this.venues[intent.door]) {
    return intent.door;
  }
  if (intent.need && this.needVenueMap[intent.need]) {
    return this.needVenueMap[intent.need];
  }
  return null;
};

Economy.prototype.computeDynamicPrice = function (venue) {
  var shortageRatio = 0;
  if (venue.inventoryMax > 0) {
    shortageRatio = 1 - (venue.inventory / venue.inventoryMax);
    shortageRatio = Math.max(0, Math.min(1, shortageRatio));
  }
  var pressure = Math.max(0, Math.min(2, venue.demandPressure));
  var multiplier = 1 + (shortageRatio * 0.8) + (pressure * 0.45);
  var minPrice = venue.basePrice * 0.6;
  var maxPrice = venue.basePrice * 2.5;
  return Math.max(minPrice, Math.min(maxPrice, venue.basePrice * multiplier));
};

Economy.prototype.hasCapacity = function (venue) {
  return venue.cycleRequests <= venue.serviceCapacity;
};

Economy.prototype.hasInventory = function (venue, intent) {
  if (!intent || intent.type !== 'FULFILL_NEED') {
    return true;
  }
  if (venue.inventoryMax <= 0) {
    return true;
  }
  return venue.inventory > 0;
};

Economy.prototype.requestService = function (intent, actorProfile) {
  var venueKey = this.resolveVenueForIntent(intent);
  var quote = {
    ok: false,
    venue: venueKey,
    price: 0,
    reason: 'no_venue',
    capacity: 0,
    inventory: 0,
    open: false
  };

  if (!venueKey || !this.venues[venueKey]) {
    return quote;
  }

  var venue = this.venues[venueKey];
  venue.cycleRequests += 1;
  venue.dynamicPrice = this.computeDynamicPrice(venue);

  quote.capacity = Math.max(0, venue.serviceCapacity - venue.cycleRequests);
  quote.inventory = venue.inventory;
  quote.open = venue.open;
  quote.price = Math.ceil(venue.dynamicPrice);

  if (!venue.open) {
    venue.cycleFailures += 1;
    venue.accounting.failedRequests += 1;
    quote.reason = 'closed';
    return quote;
  }

  if (!this.hasCapacity(venue)) {
    venue.cycleFailures += 1;
    venue.accounting.failedRequests += 1;
    quote.reason = 'capacity';
    return quote;
  }

  if (!this.hasInventory(venue, intent)) {
    venue.cycleFailures += 1;
    venue.accounting.failedRequests += 1;
    quote.reason = 'stock';
    return quote;
  }

  if (intent && intent.type === 'WORK') {
    quote.price = venue.wage;
  }

  quote.ok = true;
  quote.reason = 'ok';
  return quote;
};

Economy.prototype.applyRevenue = function (venue, amount) {
  venue.balance += amount;
  venue.accounting.revenue += amount;
};

Economy.prototype.applyExpense = function (venue, amount, expenseType) {
  venue.balance -= amount;
  venue.accounting.expenses += amount;
  if (expenseType && venue.accounting[expenseType] !== undefined) {
    venue.accounting[expenseType] += amount;
  }
};

Economy.prototype.settleTransaction = function (intent, actorProfile) {
  var outcome = {
    ok: false,
    walletDelta: 0,
    venue: null,
    reason: 'no_transaction',
    price: 0
  };

  if (!intent) {
    return outcome;
  }

  if (intent.type === 'REST') {
    outcome.ok = true;
    outcome.reason = 'rested';
    return outcome;
  }

  var venueKey = this.resolveVenueForIntent(intent);
  if (!venueKey || !this.venues[venueKey]) {
    outcome.reason = 'no_venue';
    return outcome;
  }

  var venue = this.venues[venueKey];
  var quote = intent.quote || this.requestService(intent, actorProfile);
  outcome.venue = venueKey;
  outcome.price = quote.price || 0;

  if (!quote.ok) {
    outcome.reason = quote.reason;
    return outcome;
  }

  if (intent.type === 'WORK') {
    var wage = Math.max(1, quote.price || venue.wage);
    outcome.ok = true;
    outcome.walletDelta = wage;
    outcome.reason = 'paid';

    this.applyExpense(venue, wage, 'payroll');
    venue.cycleServed += 1;
    venue.accounting.transactions += 1;
    return outcome;
  }

  var price = Math.max(0, quote.price || Math.ceil(venue.dynamicPrice));
  if (!actorProfile || actorProfile.wallet < price) {
    venue.cycleFailures += 1;
    venue.accounting.failedRequests += 1;
    outcome.reason = 'insufficient_funds';
    outcome.price = price;
    return outcome;
  }

  if (!this.hasInventory(venue, intent)) {
    venue.cycleFailures += 1;
    venue.accounting.failedRequests += 1;
    outcome.reason = 'stock';
    return outcome;
  }

  outcome.ok = true;
  outcome.walletDelta = -price;
  outcome.reason = 'served';
  outcome.price = price;

  if (venue.inventoryMax > 0) {
    venue.inventory = Math.max(0, venue.inventory - 1);
  }

  this.applyRevenue(venue, price);
  venue.cycleServed += 1;
  venue.accounting.transactions += 1;

  return outcome;
};

Economy.prototype.rebalanceVenue = function (venue) {
  var shortageRatio = 0;
  if (venue.inventoryMax > 0) {
    shortageRatio = 1 - (venue.inventory / venue.inventoryMax);
  }

  var demandSignal = 0;
  if (venue.cycleRequests > 0) {
    demandSignal = (venue.cycleRequests - venue.cycleServed) / venue.cycleRequests;
  }

  venue.demandPressure = (venue.demandPressure * 0.6) + (Math.max(0, demandSignal) * 0.8);

  if (venue.inventoryMax > 0) {
    var target = Math.ceil(venue.inventoryMax * 0.65);
    if (shortageRatio > 0.45) {
      target = Math.ceil(venue.inventoryMax * 0.85);
    }
    var deficit = Math.max(0, target - venue.inventory);
    if (deficit > 0) {
      var restockAmount = Math.max(1, Math.min(deficit, Math.ceil(venue.serviceCapacity + venue.demandPressure * 4)));
      var restockCost = restockAmount * venue.restockUnitCost;
      venue.inventory = Math.min(venue.inventoryMax, venue.inventory + restockAmount);
      this.applyExpense(venue, restockCost, 'restock');
    }
  }

  var baselinePayroll = Math.ceil(venue.wage * venue.staffCount * 0.35);
  if (baselinePayroll > 0) {
    this.applyExpense(venue, baselinePayroll, 'payroll');
  }

  if (venue.balance < -120 && venue.inventoryMax > 0) {
    venue.open = false;
  } else if (venue.balance > -30) {
    venue.open = true;
  }

  venue.dynamicPrice = this.computeDynamicPrice(venue);
  venue.cycleRequests = 0;
  venue.cycleServed = 0;
  venue.cycleFailures = 0;
};

Economy.prototype.rebalance = function () {
  for (var i = 0; i < this.venueOrder.length; i++) {
    var key = this.venueOrder[i];
    this.rebalanceVenue(this.venues[key]);
  }
  this.lastRebalanceAt = this.game.time.now;
};

Economy.prototype.update = function (deltaMs) {
  this.timeSinceRebalance += deltaMs || 16;
  if (this.timeSinceRebalance >= this.rebalanceIntervalMs) {
    this.timeSinceRebalance = 0;
    this.rebalance();
  }
};

Economy.prototype.getVenueSnapshot = function (key) {
  var venue = this.venues[key];
  if (!venue) {
    return null;
  }
  return {
    open: venue.open,
    inventory: venue.inventory,
    inventoryMax: venue.inventoryMax,
    capacity: venue.serviceCapacity,
    demandPressure: venue.demandPressure,
    price: Math.ceil(venue.dynamicPrice),
    accounting: venue.accounting,
    balance: venue.balance,
    seats: venue.seats,
    tellerSlots: venue.tellerSlots
  };
};

module.exports = Economy;

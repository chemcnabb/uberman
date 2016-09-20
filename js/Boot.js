var Uberman = Uberman || {};



Uberman.Boot = function (game) {

};

Uberman.Boot.prototype = {

  preload: function () {

  },

  create: function () {

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    this.game.scale.refresh();

    this.game.stage.backgroundColor = '#000';
    this.game.world.setBounds(0, 0, 4267, 8192);

    this.game.state.start("Preloader");

  },

  update: function () {

  },
  render: function () {

  }

};

module.exports = Uberman.Boot;
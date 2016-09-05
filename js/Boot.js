var Uberman = Uberman || {};




Uberman.Boot = function (game) {

};

Uberman.Boot.prototype = {


  preload: function () {


//http://kvazars.com/littera/




  },


  create: function () {

    console.log("BOOT");
    //this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
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
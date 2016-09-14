var Uberman = Uberman || {};


Uberman.MainMenu = function (Uberman) {

};

Uberman.MainMenu.prototype = {


  preload: function () {



  },
  gofull: function() {

    this.game.scale.startFullScreen(false);

},

  create: function () {
    console.log("MAINMENU");

    var message = ["Uberman!"];
    message.push("Start");
    message.push("Continue");
    message.push("Full Screen");

    var title = this.game.add.bitmapText((this.game.width/2), this.game.height/2-200, 'font',message[0],48);
    title.anchor.set(0.5, 0.5);


    var menu_item = this.game.add.bitmapText((this.game.width/2), this.game.height/2-100, 'font',message[1],38);
    menu_item.anchor.set(0.5, 0.5);
    var tween = this.game.add.tween(menu_item.scale).to( { x: 1.1, y:1.1 }, 350, Phaser.Easing.Linear.InOut, true, -1, -1, true).loop(true);
    menu_item.inputEnabled = true;

    var menu_item2 = this.game.add.bitmapText((this.game.width/2), this.game.height/2, 'font',message[3],38);
    menu_item2.anchor.set(0.5, 0.5);
    menu_item2.inputEnabled = true;
    menu_item2.events.onInputUp.add(this.gofull, this);

    var that = this;
    menu_item.events.onInputUp.add(function () {
      that.game.add.tween(menu_item.scale).to( { x:0.8, y:0.8 }, 350, Phaser.Easing.Circular.In, true);
      var tween = that.game.add.tween(menu_item).to( { y: -100 }, 350, Phaser.Easing.Circular.In, true);
      tween.onComplete.add(function(){
        that.game.state.start("Game");
      });
    });
    menu_item.events.onInputOver.add(function () {
      console.log("Hover");
    });
  },


  update: function () {


  },

  render: function () {

  }

};

module.exports = Uberman.MainMenu;
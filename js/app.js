/**
 * Created by che.mcnabb on 16-08-20.
 */
/**
 * Generated from the Phaser Sandbox
 *
 * http://phaser.io/sandbox/jQAfQlUa
 *
 * This source requires Phaser 2.6.1
 */
var Uberman = Uberman || {};
Boot = require("./Boot");
Preloader = require("./Preloader");
Game = require("./Game");



var size = {
  width:window.innerWidth,
  height:window.innerHeight
};


(function (size) {
  // initialize the framework

  var game = new Phaser.Game(size.width, size.height, Phaser.AUTO, '');





  // add game states
  game.state.add('Boot', Boot);
  game.state.add('Preloader', Preloader);
  //game.state.add('MainMenu', MainMenu);
  game.state.add('Game', Game);
  // start the Boot state
  game.state.start('Boot');

})(size);

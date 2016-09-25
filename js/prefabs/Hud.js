
HUD = function (game,  x, y) {
  // the bar itself
  this.player = game.player;
  this.bar = game.add.bitmapData(128, 20);
  Phaser.Sprite.call(this, game, 0, 0, this.bar);
  this.fixedToCamera = true;
  this.cameraOffset.setTo(162, 100);
  this.damage = 0;

  var clock = this.game.add.bitmapText(this.game.width/2-55, 50, 'digits', "", 62);

  //clock.anchor.setTo(0.5, 0.5);
  clock.fixedToCamera = true;
  clock.align = "center";
  //console.log(clock);
  var timeValue = {};
  timeValue.time = 0;
  this.timeTween = this.game.add.tween(timeValue).to({time:  this.game.dayLength}, this.game.dayLength);

  this.timeTween.onUpdateCallback(function() {


    clock.text = (parseInt(timeValue.time / 1000 / 60 )%12 + ":" + parseInt(timeValue.time / 1000 % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}));
  });
  this.timeTween.start();
  //this.clockTween.onComplete.add(this.sunset, this);

  //this.clock.bringToTop();

  this.uber_disk = this.game.add.sprite(0,0, 'uber_disk');
  this.uber_disk.anchor.setTo(0.5, 0.5);
  this.uber_disk.fixedToCamera = true;
  this.uber_disk.cameraOffset.setTo(89, 89);
  this.alter_disk = this.game.add.sprite(0,0, 'alter_disk');
  this.alter_disk.anchor.setTo(0.5, 0.5);
  this.alter_disk.fixedToCamera = true;
  this.alter_disk.cameraOffset.setTo(89,89);


  // just a property we can tween so the bar has a progress to show
  this.barProgress = 128;


};

HUD.prototype = Object.create(Phaser.Sprite.prototype);
HUD.prototype.constructor = HUD;

HUD.prototype.preload = function () {
  this.game.time.advancedTiming = true;
};

HUD.prototype.switchState = function() {
  if (this.player.currentState == "uber") {
    //console.log("SCALE:", this.uber_disk.scale, this.uber_disk.alpha, this.uber_disk.x);
    //this.game.add.tween(this.alter_disk).to({alpha:0}, 100, Phaser.Easing.Bounce.InOut, true);
    this.game.add.tween(this.alter_disk.scale).to({x:0, y:0}, 30, Phaser.Easing.Bounce.InOut, true);
    //this.game.add.tween(this.uber_disk).to({alpha:1}, 100, Phaser.Easing.Bounce.InOut, true);
    this.game.add.tween(this.uber_disk.scale).to({x:1, y:1}, 30, Phaser.Easing.Bounce.InOut, true);
    this.uber_disk.bringToTop();

  }
  if (this.player.currentState == "alter") {
    //this.game.add.tween(this.uber_disk).to({alpha:0}, 100, Phaser.Easing.Bounce.InOut, true);
    this.game.add.tween(this.uber_disk.scale).to({x:0, y:0}, 30, Phaser.Easing.Bounce.InOut, true);
    //this.game.add.tween(this.alter_disk).to({alpha:1}, 100, Phaser.Easing.Bounce.InOut, true);
    this.game.add.tween(this.alter_disk.scale).to({x:1, y:1}, 30, Phaser.Easing.Bounce.InOut, true);
    this.alter_disk.bringToTop();
  }
};



HUD.prototype.animateDamage = function() {
  if(this.damage > 0){
    this.game.add.tween(this).to({barProgress:this.barProgress-this.damage}, 200, "Linear", true);
    this.damage = 0;
  }

};
HUD.prototype.update = function() {
  this.switchState();




  // ensure you clear the context each time you update it or the bar will draw on top of itself
  this.bar.context.clearRect(0, 0, this.bar.width, this.bar.height);

  // some simple colour changing to make it look like a health bar
  if (this.barProgress < 32) {
    this.bar.context.fillStyle = '#f00';
  }
  else if (this.barProgress < 64) {
    this.bar.context.fillStyle = '#ff0';
  }
  else {
    this.bar.context.fillStyle = '#0f0';
  }

  // draw the bar
  this.bar.context.fillRect(0, 0, this.barProgress, 20);

  // important - without this line, the context will never be updated on the GPU when using webGL
  this.bar.dirty = true;
  this.animateDamage();
};

module.exports = HUD;
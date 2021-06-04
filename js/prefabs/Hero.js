Hero = function (game, x, y, frame) {
    Phaser.Sprite.call(this, game, x, y, 'hero', frame);

    this.originHeight = this.game.world.height;
    this.isZooming = false;
    // initialize your prefab here
    this.frame = 0;
    this.currentState = "uber";
    this.isClicked = false;
    this.sprite_message = "";
    this.pointerHover = false;
    //this.dummy = this.game.add.sprite(0, 0);
    this.inputEnabled = true;
    this.events.onInputDown.add(this.onSpriteClick, this);
    this.events.onInputOver.add(this.onSpriteHover, this);
    this.events.onInputOut.add(this.onSpriteBlur, this);

    this.zoom_in_on = [];

    this.followedObject = this.body;


    this.game.physics.arcade.enable(this);
    this.directions = ["LEFT", "UP_LEFT", "UP", "UP_RIGHT", "RIGHT", "DOWN_RIGHT", "DOWN", "DOWN_LEFT"];
    this.alter_walk = this.animations.add("alter_up", [5], 6, false);
    this.alter_walk = this.animations.add("alter_fall", [5, 6, 7, 8, 9, 10], 6, false);
    this.alter_walk = this.animations.add("alter_walk", [5, 6, 7, 8, 9, 10], 6, false);
    this.alter_walk = this.animations.add("alter_stand", [5], 6, false);
    this.alter_walk = this.animations.add("uber_stand", [0], 6, false);
    this.alter_walk = this.animations.add("uber_walk", [17, 18, 19, 20, 21, 22], 6, false);

    this.alter_walk = this.animations.add("fly_get_ready", [23], 1, true);
    this.alter_walk = this.animations.add("fly_side", [3, 4], 6, false);
    this.alter_walk = this.animations.add("fly_side_up", [11, 12], 6, true);
    this.alter_walk = this.animations.add("fly_side_down", [13, 14], 6, true);
    this.alter_walk = this.animations.add("fly_hover", [1, 2], 6, true);
    this.alter_walk = this.animations.add("fly_up", [15, 16], 6, true);
    this.alter_walk = this.animations.add("fly_down", [15, 16], 6, true);
    this.alter_walk = this.animations.add("fly_up_diagonal", [3, 4], 6, true);
    this.alter_walk = this.animations.add("fly_down_diagonal", [3, 4], 6, true);

    this.body.gravity.y = 300;
    this.body.collideWorldBounds = true;
    this.body.fixedRotation = true;
    this.anchor.setTo(0.5, 0.5);


    this.game.camera.follow(this, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);


};

Hero.prototype = Object.create(Phaser.Sprite.prototype);

Hero.prototype.constructor = Hero;


Hero.prototype.spriteMessage = function (sprite, message) {


    if (!this.game.input.activePointer.isDown) {
        this.sprite_message = this.game.add.bitmapText(sprite.x - sprite.body.width * 2, sprite.y - sprite.body.height / 2, 'smallfont', message, 18);

        var tween = this.game.add.tween(this.sprite_message).to({y: (sprite.y - sprite.body.height / 2) - 10}, 200, "Linear", true, -1, -1, true).loop(true);

    }


};

Hero.prototype.onSpriteHover = function (sprite, pointer) {
    this.pointerHover = true;

    var message;
    if (this.currentState === "uber") {
        message = "[click] Change into Secret Identity!";
    } else {
        message = "[click] Change into Uberman!";
    }

    if (this.body.touching.down) {
        this.spriteMessage(this, message);
    }


};

Hero.prototype.onSpriteBlur = function (sprite, pointer) {
    if (this.sprite_message) {
        this.sprite_message.destroy();

    }
    this.pointerHover = false;


};
Hero.prototype.onDoorClick = function (door) {
    console.log("DOOR CLICKED");

    this.zoom_in_on = [door.x, door.y];
    this.followedObject = door;
};
Hero.prototype.onDoorHover = function () {

    var message;
    if (this.currentState === "uber") {
        message = "[click] Change before entering!";
    } else {
        message = "[click] Enter Daily Planet!";

    }


    this.spriteMessage(this.game.door, message);

};
Hero.prototype.onDoorBlur = function () {

};
Hero.prototype.switch_char = function (sprite) {
    if (sprite.body.touching.down) {
        console.log("ON GROUND");
        if (sprite.currentState === "uber") {
            console.log("GOING CLARK");
            sprite.currentState = "alter";
            sprite.angle = 0;
            sprite.animations.play("alter_stand");

        } else {
            console.log("GOING UBER");
            sprite.currentState = "uber";
            sprite.animations.play("uber_stand");
        }
    }
};
Hero.prototype.onSpriteClick = function (sprite, pointer) {

    if (this.sprite_message) {
        this.sprite_message.destroy();
    }

    if (!this.checkOverlap(sprite, this.game.doors)) {


        this.switch_char(sprite);
    } else if (this.currentState !== "uber" && this.checkOverlap(sprite, this.game.doors)) {
      if(this.game.door){
        this.onDoorClick(this.game.door);
      }

    } else {
        console.log("SWITCHING");
        this.switch_char(sprite);
    }


};
Hero.prototype.checkOverlap = function (spriteA, spriteList) {
    var boundsA = spriteA.getBounds();

    for (var i = 0; i < Object.keys(spriteList).length; i++) {
        var boundsB = spriteList[Object.keys(spriteList)[i]].getBounds();

        if (Phaser.Rectangle.intersects(boundsA, boundsB)) {
            this.game.door = spriteList[Object.keys(spriteList)[i]];
            return true;
        }
    }

    this.game.door = null;
    return false;
};
Hero.prototype.onSpriteRelease = function (sprite, pointer) {
    this.isClicked = false;
};
Hero.prototype.getCardinal = function (angle, diagonals) {

    if (diagonals) {
        angle = Math.round((angle + Math.PI) / (Math.PI * 2) * 8) % 8;
        return (this.directions[angle]);
    } else {
        angle = Math.round((angle + Math.PI) / (Math.PI * 2) * 4) % 4;
        return (this.directions[angle * 2]);
    }
};


Hero.prototype.alter_movement = function (onGround) {
    if (onGround) {
        this.body.velocity.y = 0;
    }

    this.angle = 0;
    this.body.allowRotation = false;
    var pointer = this.game.input.activePointer;


    if (onGround) {
        //this.game.back.x -= this.body.velocity.x * (0.001);

        if (pointer.worldX > this.x) {
            //RIGHT

            this.scale.x = 1;
            this.animations.play("alter_walk");
        }
        if (pointer.worldX < this.x) {
            //LEFT

            this.scale.x = -1;
            this.animations.play("alter_walk");
        }

        this.game.physics.arcade.moveToXY(this, pointer.worldX, this.y, 225);


    }

};

Hero.prototype.uber_movement = function (onGround) {
    var angle = this.game.physics.arcade.moveToPointer(this, 60, this.game.input.activePointer, 500);
    var direction = this.getCardinal(angle, true);


    this.scale.y = 1;

    switch (direction) {


        case "UP":
            this.angle = 0;

            if (!onGround) {
                this.animations.play("fly_up");
            } else {
                this.animations.play("uber_stand");
                //this.animations.currentAnim.onComplete.add(function () {	this.animations.play("fly_up");}, this);

            }


            break;
        case "DOWN":
            this.angle = 0;
            this.scale.y = -1;

            if (!onGround) {
                if (this.y > this.game.world.height - 1200) {


                    if (this.animations.currentAnim.name == "fly_down") {

                        this.animations.play("fly_get_ready");
                        this.events.onAnimationComplete.add(function () {

                            this.scale.y = 1;
                            this.animations.play("fly_hover");
                        }, this);


                    } else {
                        this.scale.y = 1;
                        this.animations.play("fly_hover");
                    }


                } else {
                    this.animations.play("fly_down");
                }
            } else {
                this.scale.y = 1;
                this.animations.play("uber_stand");
            }


            break;
        case "UP_LEFT":

            this.scale.x = -1;
            if (!onGround) {
                this.angle = -45;
                this.animations.play("fly_side_up");
            } else {
                this.animations.play("uber_stand");
                //this.animations.currentAnim.onComplete.add(function () {
                //  this.angle = -45;
                //  this.animations.play("fly_up_diagonal");
                //}, this);
            }


            break;
        case "UP_RIGHT":
            this.scale.x = 1;

            if (!onGround) {
                this.angle = 45;
                this.animations.play("fly_side_up");
            } else {
                this.animations.play("take_off");
                //this.animations.currentAnim.onComplete.add(function () {
                //  this.angle = 45;
                //  this.animations.play("fly_up_diagonal");
                //}, this);
            }

            break;
        case "RIGHT":
            this.scale.x = 1;
            if (!onGround) {
                this.angle = 90;
                this.animations.play("fly_side");
            } else {

                this.angle = 0;
                this.animations.play("uber_walk");
            }


            break;
        case "DOWN_RIGHT":
            this.scale.x = 1;
            if (!onGround) {
                this.angle = 135;
                this.animations.play("fly_side_down");
            } else {

                this.angle = 0;
                this.animations.play("uber_walk");
            }

            break;
        case "DOWN_LEFT":
            this.scale.x = -1;
            if (!onGround) {
                this.angle = -135;
                this.animations.play("fly_side_down");
            } else {

                this.angle = 0;
                this.animations.play("uber_walk");
            }

            break;
        case "LEFT":
            this.scale.x = -1;


            if (!onGround) {
                this.angle = -90;
                this.animations.play("fly_side");
            } else {
                this.angle = 0;

                this.animations.play("uber_walk");
            }


            break;

    }
};

Hero.prototype.isMoving = function () {
    return Phaser.Point.equals(this.body.velocity, new Phaser.Point(0, 0));
};


Hero.prototype.update = function () {

    var onGround = this.body.touching.down;
    var direction;
    if (!this.isZooming) {


        if (this.game.input.activePointer.isDown) {
            if (!this.pointerHover) {

                if (this.currentState == "uber") {
                    this.uber_movement(onGround);
                } else {
                    this.alter_movement(onGround);
                }
            } else {

                this.pointerHover = false;
            }

        }

        if (!this.game.input.activePointer.isDown) {
            this.angle = 0;
            this.body.velocity.set(0);
            direction = null;

            if (this.currentState == "uber") {
                this.scale.y = 1;
                this.animations.play("fly_hover");
                if (onGround) {
                    this.animations.play("uber_stand");
                }
            } else {
                this.animations.stop();
            }

        }
    }


    //console.log(this.originHeight, this.y);
};


Hero.prototype.render = function () {
    this.game.debug.text(direction || "--", 2, 14, '#0f0');
};


module.exports = Hero;
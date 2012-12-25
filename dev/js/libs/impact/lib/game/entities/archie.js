ig.module(
        'game.entities.archie'
    )
    .requires(
        'impact.entity'
    )
    .defines(function () {
        EntityArchie = ig.Entity.extend({
            size: {x: 32, y: 48},
            collides: ig.Entity.COLLIDES.FIXED,
            friction: {x: 600, y: 0},
            animSheet: new ig.AnimationSheet('media/archie.png', 32, 48),
            maxVel: {x: 100, y: 150},
            flip: false,
            jumping: false,
            accelGround: 400,
            accelAir: 400,
            jump: 400,
            hasPassedHalfway: false,
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('idle', 1, [0]);
                this.addAnim('walk', 0.03, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]);
                this.flip = false
            },

            update: function () {
                var acceleration = this.standing ? this.accelGround : this.accelAir;
                if (ig.input.state('left')) {
                    this.accel.x = -acceleration;
                    this.flip = true;
                }
                else if (ig.input.state('right')) {
                    this.accel.x = acceleration;
                    this.flip = false;
                }
                else {
                    this.accel.x = 0;
                }

                if (this.standing && ig.input.pressed('jump') || this.jumping && ig.input.pressed('jump')) {
                    this.vel.y = -this.jump;
                    this.jumping = true;
                }
                if (this.vel.y < 0) {
                    //jumping anim
                }
                else if (this.vel.y > 0) {
                    this.jumping = false;
                    //falling anim
                }
                else if (this.vel.x != 0) {
                    this.currentAnim = this.anims.walk;
                }
                else {
                    this.currentAnim = this.anims.idle;
                }
                if(this.pos.x >= ig.system.width * 0.5){
                    this.hasPassedHalfway = true;
                }
                else{
                    this.hasPassedHalfway = false;
                }
                this.currentAnim.flip.x = this.flip;
                this.parent();
            }
        })
    });

ig.module(
        'game.entities.archie'
    )
    .requires(
        'impact.entity'
    )
    .defines(function () {
        EntityArchie = ig.Entity.extend({
            size: {x: 32, y: 48},
            friction: {x: 600, y: 0},
            animSheet: new ig.AnimationSheet('media/archie.png', 32, 48),
            maxVel: {x: 100, y: 150},
            collides: ig.Entity.COLLIDES.ACTIVE,
            type: ig.Entity.TYPE.A,
            checkAgainst: ig.Entity.TYPE.B,
            flip: false,
            jumping: false,
            accelGround: 400,
            accelAir: 400,
            jump: 400,
            health: 10,
            isHit: false,
            flashAmount: 0,
            startPosition: {},
            hasPassedHalfway: false,
            interval: 0,
            alpha: 1,
            healthModel: {},
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.startPosition = {x: x, y: y};
                this.addAnim('idle', 1, [0]);
                this.addAnim('walk', 0.03, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]);
                this.flip = false;
                this.healthModel = ig.game.healthModel;
                this.health = this.healthModel.health;
            },
            reset:function () {
                this.alpha = 1;
                this.isHit = false;
                this.flashAmount = 0;
            },
            kill: function () {
                this.health = 10;
                this.pos.x = this.startPosition.x;
                this.pos.y = this.startPosition.y;
                this.reset();
            },
            hit: function () {
                var self = this;
                if (!this.isHit) {
                    this.isHit = true;
                    this.health = this.health - 1;
                    if (this.health == 0) {
                        this.kill();
                    }
                    else {
                        this.interval = setInterval(function () {
                            self.flash();
                        }, 200);
                    }
                }
                this.healthModel.setHealth(this.health);
            },
            flash: function () {
                this.flashAmount++;
                if (this.flashAmount < 16) {
                    this.alpha = (this.alpha == 1 ? 0.2 : 1);
                }
                else {
                    clearInterval(this.interval);
                    this.reset();
                }
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
                this.currentAnim.alpha = this.alpha;
                this.hasPassedHalfway = this.pos.x >= ig.system.width * 0.5;
                this.currentAnim.flip.x = this.flip;
                this.parent();
            }
        })
    });

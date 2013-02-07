//todo implement lives?
ig.module(
        'game.entities.archie'
    )
    .requires(
        'impact.entity',
        'game.entities.death-explosion',
        'game.entities.bullet'
    )
    .defines(function () {
        EntityArchie = ig.Entity.extend({
            size: {x: 20, y: 48},
            offset:{x:4, y: 0},
            friction: {x: 600, y: 0},
            animSheet: new ig.AnimationSheet('media/archie.png', 42, 48),
            maxVel: {x: 100, y: 150},
            collides: ig.Entity.COLLIDES.ACTIVE,
            type: ig.Entity.TYPE.A,
            checkAgainst: ig.Entity.TYPE.B,
            flip: false,
            jumping: false,
            accelGround: 400,
            accelAir: 600,
            jump: 800,
            health: 10,
            isHit: false,
            flashAmount: 0,
            startPosition: {},
            hasPassedHalfway: false,
            interval: 0,
            alpha: 1,
            model: {},
            jumpPressed: 0,
            currentWalkMode: 'walk-basic',
            currentIdleMode: 'idle',
            currentJumpMode: 'jump',
            shootable: false,
            bullets: 0,
            oldAnim: null,
            keyDown: false,
            hitSound: new ig.Sound('media/sounds/hurt.*'),
            jumpSound: new ig.Sound('media/sounds/jump.*'),
            shootSound: new ig.Sound('media/sounds/shoot.*'),
            dieSound: new ig.Sound('media/sounds/die.*'),
            respawnSound: new ig.Sound('media/sounds/respawn.*'),
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.startPosition = {x: x, y: y};
                this.addAnim('idle', 1, [0]);
                this.addAnim('idle-with-gun', 1, [23]);
                this.addAnim('walk-basic', 0.03, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]);
                this.addAnim('walk-with-gun', 0.03, [23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43]);
                this.addAnim('jump', 0.03, [44]);
                this.addAnim('jump-with-gun', 0.03, [45]);
                this.addAnim('shooting', 0.01, [46]);
                this.flip = false;
                this.model = ig.game.model || new PlayerModel();
                this.health = this.model.health;
                if(ig.game.model.hasGun === true){
                    this.enableGun();
                }
            },
            reset: function () {
                this.alpha = 1;
                this.isHit = false;
                this.flashAmount = 0;
            },
            triggerCollision: function () {
                this.hasCollided = true;
            },
            kill: function () {
                var self = this;
                self.parent();
                var x = self.startPosition.x;
                var y = self.startPosition.y;
                ig.game.model.setLives(ig.game.model.lives - 1);
                if(ig.game.model.lives === 0){
                    ig.game.gameOver();
                }
                ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {callback: function () {
                    ig.game.resetPlayer();
                    ig.game.spawnEntity(EntityArchie, x, y);
                    self.respawnSound.play();
                }});
                ig.game.model.hasGun = false;
                this.dieSound.play();

            },
            toString:function(){
                return 'Archie';
            },

            hit: function (value) {
                var self = this;
                if (!this.isHit) {
                    this.isHit = true;
                    this.vel.y = -this.jump;
                    this.flip ? this.accel.x = -this.accelGround : this.accelGround;
                    this.jumping = true;
                    this.health -= value ? value : 2;
                    if (this.health <= 0) {
                        this.kill();
                    }
                    else {
                        this.interval = setInterval(function () {
                            self.flash();
                        }, 200);
                    }
                }
                this.hitSound.play();
                this.model.setHealth(this.health);
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
            enableGun: function () {
                ig.game.model.hasGun = true;
                this.shootable = this.hasGun = true;
                this.currentWalkMode = 'walk-with-gun';
                this.currentIdleMode = 'idle-with-gun';
                this.currentJumpMode = 'jump-with-gun';
            },
            update: function () {
                var self = this;
                var acceleration = this.standing ? this.accelGround : this.accelAir;
                if (ig.input.state('left')) {
                    this.accel.x = -acceleration;
                    this.flip = true;
                }
                else if (ig.input.state('right')) {
                    this.accel.x = acceleration;
                    if (ig.game.model) ig.game.model.setScore(ig.game.model.score + 1);
                    this.flip = false;
                }
                else if (ig.input.state('shoot')) {
                    if (this.shootable && this.bullets === 0) {
                        this.shootable = false;
                        if (this.hasGun) {
                            this.bullets = 1;
                            this.oldAnim = this.currentAnim;
                            this.currentAnim = this.anims['shooting'];
                            ig.game.spawnEntity(EntityBullet, this.pos.x + (this.flip ? 0 : 32), this.pos.y + 16, {flip: this.flip, callback: function () {
                                self.shootable = true;
                                self.bullets = 0;
                            }, resetCallback: function () {
                                if (self.oldAnim) {
                                    self.currentAnim = self.oldAnim;
                                    self.oldAnim = null
                                }
                            }});

                            this.shootSound.play();
                        }
                    }
                } else {
                    this.accel.x = 0;
                }

                if (this.standing && ig.input.pressed('jump') || this.jumping && ig.input.pressed('jump')) {
                    if (this.jumpPressed <= 1) {
                        this.vel.y = -this.jump;
                        this.jumping = true;
                        this.jumpPressed++;
                        this.jumpSound.play();
                    }
                }
                if (this.vel.y < 0) {
                    this.setAnim(this.anims[this.currentJumpMode])
                } else if (this.vel.y > 0) {
                    this.jumping = false;
                    this.jumpPressed = 0;
                    this.setAnim(this.anims[this.currentJumpMode]);
                }
                if (this.vel.x === 0) {
                    this.setAnim(this.anims[this.currentIdleMode]);
                } else {
                    this.currentAnim = this.anims[this.currentWalkMode];
                }
                this.currentAnim.alpha = this.alpha;
                this.hasPassedHalfway = this.pos.x >= ig.system.width * 0.5;
                this.currentAnim.flip.x = this.flip;
                this.parent();
            },

            setAnim: function (animation) {
                if (!this.isShooting()) {
                    this.currentAnim = animation;
                }
            },
            isShooting: function () {
                return this.currentAnim == this.anims['shooting']
            }
        })
    });

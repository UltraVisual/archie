ig.module(
        'game.entities.coin'
    )
    .requires(
        'impact.entity'
    )
    .defines(function () {
        EntityCoin = ig.Entity.extend({
            animSheet: new ig.AnimationSheet('media/sprites.png', 32, 32),
            size: {x: 32, y: 32},
            checkAgainst: ig.Entity.TYPE.BOTH,
            tweenOut: false,
            update: function () {
                this.parent();
                if (this.tweenOut) {
                    this.pos.y -= 2;
                    this.currentAnim.alpha = this.currentAnim.alpha - 0.05;
                    if(this.currentAnim.alpha <= 0){
                       ig.game.removeEntity(this);
                    }
                }
            },
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('idle', 1, [0]);
                console.log(this.pos.x - ig.game.screen.x)
            },
            check: function (other) {
                if (typeof other.hit != 'undefined' && !this.tweenOut) {
                    ig.game.model.setScore(ig.game.model.score + 500);
                    this.tweenOut = true;
                    this.checkAgainst = ig.Entity.TYPE.NONE;
                    console.log('we have a hit')
                }
            }
        })
    });

ig.module(
        'game.entities.egg'
    )
    .requires(
        'impact.entity',
        'game.abstract.collectible'
    )
    .defines(function () {
        EntityEgg = EntityCollectible.extend({
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('idle', 1, [1]);
            },
            check: function (other) {
                if (typeof other.hit != 'undefined' && !this.tweenOut && this.currentAnim.alpha > 0) {
                    ig.game.model.setScore(ig.game.model.score + 1000);
                    this.tweenOut = true;
                    this.checkAgainst = ig.Entity.TYPE.NONE;
                    ig.game.levelComplete();
                }
            },
            update: function () {
                console.log('collected coins', ig.game.model.coins.amount);
                if (!this.tweenOut) {
                    if (ig.game.model.coins.amount == ig.game.model.coins.total) {
                        this.currentAnim.alpha = 1;
                    }
                    else {
                        this.currentAnim.alpha = 0;
                    }
                }
                this.parent();
            }
        })
    });
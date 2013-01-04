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
                if (typeof other.hit != 'undefined' && !this.tweenOut) {
                    ig.game.model.setScore(ig.game.model.score + 1000);
                    this.tweenOut = true;
                    this.checkAgainst = ig.Entity.TYPE.NONE;
                }
            }
        })
    });
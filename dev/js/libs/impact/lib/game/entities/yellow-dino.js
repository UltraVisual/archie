ig.module(
        'game.entities.yellow-dino'
    )
    .requires(
        'impact.entity',
        'game.entities.green-dino'
    )
    .defines(function () {
        EntityYellowDino = EntityGreenDino.extend({
            size: {x: 42, y: 43},
            animSheet: new ig.AnimationSheet('media/yellow-dino.png', 42, 43),
            init: function (x, y, settings) {
                this.parent(x, y, settings);
            }
        })
    });
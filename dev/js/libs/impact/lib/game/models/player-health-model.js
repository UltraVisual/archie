ig.module(
        'game.models.player-health-model'
    )
    .requires(
        'impact.entity'
    )
    .defines(function () {
        PlayerHealthModel = function () {
        };
        PlayerHealthModel.prototype = {
            health: 10,
            pos: {x: 35, y: 35},
            setHealth: function (val) {
                this.health = val;
            }
        };
    });

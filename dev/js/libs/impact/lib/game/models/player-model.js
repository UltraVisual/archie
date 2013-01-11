ig.module(
        'game.models.player-model'
    )
    .requires(
        'impact.entity'
    )
    .defines(function () {
        PlayerModel = function () {
        };
        PlayerModel.prototype = {
            health: 10,
            pos: {x: 35, y: 35},
            score: 0,
            coins:{total:0, amount:0},
            setHealth: function (val) {
                this.health = val;
            },
            setScore:function(val){
               this.score = val;
            }
        };
    });

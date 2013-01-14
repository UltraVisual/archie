ig.module(
        'game.screens.end-of-level'
    )
    .requires(
        'impact.game'
    )
    .defines(function () {
        EndOfLevelScreen = ig.Game.extend({
            endOfLevelText: new ig.Font('media/04b03.font.png'),
            background:new ig.Image('media/level-complete.png'),
            init: function () {

            },

            update: function () {
                this.parent();
            },
            draw: function () {
                this.parent();
                this.background.draw(0, 0);
            }
        })
    });

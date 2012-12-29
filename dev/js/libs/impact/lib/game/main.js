ig.module(
        'game.main'
    )
    .requires(
        'impact.game',
        'impact.font',
        'game.levels.levelOne',
        'game.models.player-health-model'
    )
    .defines(function () {
        MyGame = ig.Game.extend({
            healthModel: new PlayerHealthModel(),
            gravity: 300,
            font: new ig.Font('media/04b03.font.png'),
            init: function () {
                ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
                ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
                ig.input.bind(ig.KEY.UP_ARROW, 'jump');
                ig.input.bind(ig.KEY.SPACE, 'jump');
                this.loadLevel(LevelLevelOne);
            },

            update: function () {
                this._setCameraPosition();
                this._checkCameraIsInBounds.call(this);
                this.parent();
            },

            draw: function () {
                this.parent();
            },

            _setCameraPosition: function () {
                var player = this.getEntitiesByType(EntityArchie)[0];
                if (player) {
                    if (player.hasPassedHalfway) {
                        this.screen.x = player.pos.x - ig.system.width * 0.5;
                    }
                    this.screen.y = player.pos.y - ig.system.height * 0.5;
                }
            },

            _checkCameraIsInBounds: function () {
                if (this.screen.x <= 0) {
                    this.screen.x = 0;
                }
                if (this.screen.y <= 0) {
                    this.screen.y = 0;
                }
                if (this.screen.x >= this.collisionMap.width * this.collisionMap.tilesize - ig.system.width) {
                    this.screen.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
                }

                if (this.screen.y >= this.collisionMap.height * this.collisionMap.tilesize - ig.system.height) {
                    this.screen.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;
                }
            }
        });

        ig.main('#canvas', MyGame, 60, 1000, 750, 1);
    });

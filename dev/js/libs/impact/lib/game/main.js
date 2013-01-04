ig.module(
        'game.main'
    )
    .requires(
        'impact.game',
        'impact.font',
        'game.levels.levelOne',
        'game.models.player-model'
    )
    .defines(function () {
        MyGame = ig.Game.extend({
            model: new PlayerModel(),
            gravity: 300,
            font: new ig.Font('media/04b03.font.png'),
            init: function () {
                this.startPosition = {x: this.screen.x, y: this.screen.y};
                ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
                ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
                ig.input.bind(ig.KEY.UP_ARROW, 'jump');
                ig.input.bind(ig.KEY.SPACE, 'jump');
                ig.input.bind(ig.KEY.X, 'shoot');
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

            resetPlayer:function(){
                this.model.health = 10;
                this.screen.x = this.startPosition.x;
                this.screen.y = this.startPosition.y;
            },

            _setCameraPosition: function () {
                var player = this.getEntitiesByType(EntityArchie)[0];
                if (player != undefined) {
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

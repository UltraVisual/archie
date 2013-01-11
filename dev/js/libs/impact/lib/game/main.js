ig.module(
        'game.main'
    )
    .requires(
        'impact.game',
        'impact.font',
        'game.levels.levelOne',
        'game.models.player-model',
        'game.entities.start-button'
    )
    .defines(function () {
        MyGame = ig.Game.extend({
            levels:[{level:LevelLevelOne, backGround:'media/sky.png', coins:8}],
            model: new PlayerModel(),
            gravity: 300,
            font: new ig.Font('media/04b03.font.png'),
            background:null,
            clearColor:null,
            levelIndex:0,
            self : null,
            pictures: this.addImagesToPreloader(this.levels),
            hasInstructions : false,
            init: function () {
                self = this;
                this.startPosition = {x: this.screen.x, y: this.screen.y};
                ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
                ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
                ig.input.bind(ig.KEY.UP_ARROW, 'jump');
                ig.input.bind(ig.KEY.SPACE, 'jump');
                ig.input.bind(ig.KEY.X, 'shoot');
                ig.input.bind(ig.KEY.MOUSE1, 'mouse-pressed');
                this.showStartScreen();
            },
            addImagesToPreloader: function (levels) {
                for(var i = 0; i < levels.length; i++){
                   if(levels[i].backGround){
                       var tmpImage = new ig.Image(levels[i].backGround);
                   }
                }
            },

            showInstructions:function(){
                this.background = new ig.Image('media/instructions.png');
                this.hasInstructions = true;
            },

            showFirstLevel: function () {
                this.hasInstructions = false;
                self.addLevel();
                self.index++;
            },
            showStartScreen: function () {
                this.background = new ig.Image('media/title.png');
                ig.game.spawnEntity(EntityStartButton, 550, 275)
            },
            levelComplete:function(){
                //todo once more levels are added this will go to another level until all are exhausted
                 console.log('level complete');
            },

            addLevel:function(){
                this.model.coins.total = this.levels[this.levelIndex].coins;
                this.model.coins.amount = 0;
                var levelData = this.levels[this.levelIndex];
                if(levelData.backGround){
                    this.background = new ig.Image(levelData.backGround);
                }
                this.loadLevel(levelData.level);
            },

            update: function () {
                if(this.hasInstructions === true && ig.input.state('shoot')){
                    this.showFirstLevel();
                }
                this._setCameraPosition();
                this._checkCameraIsInBounds.call(this);
                this.parent();
            },

            draw: function () {
                this.background.draw(0, 0);
                this.parent();
            },

            resetPlayer:function(){
                this.model.health = 10;
                this.screen.x = this.startPosition.x;
                this.screen.y = this.startPosition.y;
            },

            _setCameraPosition: function () {
                var player = this.getEntitiesByType(EntityArchie)[0];
                if (player !== undefined) {
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

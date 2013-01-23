//,
//{level: LevelLevelTwo, backGround: 'media/sky-orange.png', coins: 29, title: 'Level Two - Closer to the Gate'},
//{level: LevelLevelThree, backGround: 'media/sky-red.png', coins: 31, title: 'Level Three - Into the Castle'},
//{level: LevelLevelFour, backGround: 'media/sky-red.png', coins: 25, title: 'Level Four - The Courtyard'}

ig.module(
        'game.main'
    )
    .requires(
        'impact.game',
        'impact.font',
        'game.levels.levelOne',
        'game.levels.levelTwo',
        'game.levels.levelThree',
        'game.levels.levelFour',
        'game.models.player-model',
        'game.entities.start-button'
    )
    .defines(function () {
        MyGame = ig.Game.extend({
            levels: [
                {level: LevelLevelOne, backGround: 'media/sky.png', coins: 8, title: 'Level One - The Outer Reaches'}
            ],
            model: new PlayerModel(),
            gravity: 300,
            font: new ig.Font('media/04b03.font.png'),
            background: null,
            clearColor: null,
            levelIndex: 0,
            self: null,
            picOne: new ig.Image('media/sky.png'),
            instructionsScreen: new ig.Image('media/instructions.png'),
            titleImage: new ig.Image('media/title.png'),
            levelDoneImage: new ig.Image("media/level-complete.png"),
            picTwo: new ig.Image("media/sky-red.png"),
            picThree: new ig.Image("media/sky-orange.png"),
            successScreen: new ig.Image("media/success.png"),
            failureScreen: new ig.Image("media/game-over.png"),
            hasInstructions: false,
            levelIsComplete: false,
            startData: null,
            init: function () {
                self = this;
                this.startPosition = {x: this.screen.x, y: this.screen.y};
                ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
                ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
                ig.input.bind(ig.KEY.R, 'restart');
                ig.input.bind(ig.KEY.UP_ARROW, 'jump');
                ig.input.bind(ig.KEY.SPACE, 'jump');
                ig.input.bind(ig.KEY.X, 'shoot');
                ig.input.bind(ig.KEY.MOUSE1, 'mouse-pressed');
                this.showStartScreen();
            },

            getLifeValue: function () {
                return Math.random() * 10;
            },

            restartLevel: function () {
                self.model.setHealth(self.startData.health);
                self.model.setLives(self.startData.lives);
                self.model.setScore(0);
                self.model.setCoins(0);
                self.levelIndex--;
                self.addLevel();
            },

            gameOver: function () {
                this.removeLevel();
                this.background = this.failureScreen;
            },

            showInstructions: function () {
                this.background = this.instructionsScreen;
                this.hasInstructions = true;
            },

            removeLevel: function () {
                this.entities = [];
                this.backgroundMaps = [];
            },

            showFirstLevel: function () {
                this.hasInstructions = false;
                self.addLevel();
            },
            showStartScreen: function () {
                this.background = this.titleImage;
                ig.game.spawnEntity(EntityStartButton, 550, 275)
            },
            showEndOfLevelScreen: function () {
                self.removeLevel();
                self.levelIsComplete = true;
                self.levelDoneImage = new ig.Image("media/level-complete.png");
            },
            gameComplete: function () {
                self.removeLevel();
                self.background = self.successScreen;
            },
            levelComplete: function () {
                console.log(this.levels.length, this.levelIndex)
                if(this.levelIndex < this.levels.length){
                    setTimeout(self.showEndOfLevelScreen, 1000)
                }
                else{
                    setTimeout(self.gameComplete, 1000)
                }
            },

            addLevel: function () {
                this.startData = {lives: this.model.lives, health: this.model.health};
                var levelData = this.levels[this.levelIndex];
                if (typeof levelData != 'undefined') {
                    this.model.coins.total = levelData.coins;
                    this.model.coins.amount = 0;
                    if (levelData.backGround) {
                        this.background = new ig.Image(levelData.backGround);
                    }
                    this.loadLevelDeferred(levelData.level);
                    this.levelIndex++;
                }
            },

            update: function () {
                if (ig.input.state('restart')) {
                    this.restartLevel();
                }
                else if(ig.input.state('shoot')){
                    if (this.background == this.instructionsScreen) {
                        this.showFirstLevel();
                    }
                    else if (this.levelIsComplete === true) {
                        this.levelIsComplete = false;
                        self.addLevel();
                    }
                    else if(this.background === this.failureScreen || this.background === this.successScreen){
                        ig.system.setGame(MyGame);
                    }
                }


                this._setCameraPosition();
                this._checkCameraIsInBounds.call(this);
                this.parent();
            },

            draw: function () {
                if (this.levelIsComplete === true) {
                    this.levelDoneImage.draw(0, 0);
                }
                else {
                    this.background.draw(0, 0);
                }
                this.parent();
            },

            resetPlayer: function () {
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
    })
;

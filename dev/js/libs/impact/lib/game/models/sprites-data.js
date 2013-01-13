ig.module(
        'game.models.sprites-data'
    )
    .requires(
        'impact.entity'
    )
    .defines(function () {
        SpritesData = {
            SPIKES:0,
            EGG:2,
            GUN:1,
            COIN:3
        };

    });

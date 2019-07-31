/* Game namespace */
var game = {

    // an object where to store game information
    data : {
        // score
        lives : 5,
        score : 0
    },


    // Run on page load.
    "onload" : function () {
        // Initialize the video.
        if (!me.video.init(360, 240, {wrapper : "screen", scale : "auto"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // set and load all resources.
        // (this will also automatically switch to the loading screen)
        me.loader.preload(game.resources, this.loaded.bind(this));
    },

    // Run on game resources loaded.
    "loaded" : function () {
        me.state.set(me.state.WORLDMAP, new game.WorldMap());
        me.state.set(me.state.PLAY, new game.PlayScreen());

        // add our player entity in the entity pool
        me.pool.register("Mario", game.PlayerEntity);       
        me.pool.register("Goomba", game.GoombaEntity);
        me.pool.register("Coins", game.CoinEntity);
        me.pool.register("Turtle", game.KoopaEntity);
        me.pool.register("ItemBlocks", game.ItemBlocksEntity);
        me.pool.register("PirhanaPlant", game.PirhanaPlant);
        me.pool.register("MarioLevelSelect", game.MarioLevelSelectEntity);
        me.pool.register("1-UP", game.OneUpEntity);
        //me.pool.register("Mushroom", game.MushroomEntity);
        //me.pool.register("Leaf", game.LeafEntity);

        
        //enable the keyboard
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.DOWN, "down");
       
        //Jump
        me.input.bindKey(me.input.KEY.SPACE, "jump", true);
        me.input.bindKey(me.input.KEY.X, "jump", true);
        me.input.bindKey(me.input.KEY.UP, "jump", true);


        // Start the game.
        me.state.change(me.state.WORLDMAP);
    }    
};

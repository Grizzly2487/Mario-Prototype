game.WorldMap = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        ; // TODO
        me.levelDirector.loadLevel("World Select");
        me.audio.playTrack("World1BGM");

        // Add our HUD to the game world, add it last so that this is on top of the rest.
        // Can also be forced by specifying a "Infinity" z value to the addChild function.
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
        
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        ; // TODO
        me.game.world.removeChild(this.HUD);
        me.audio.stopTrack();
    }
});

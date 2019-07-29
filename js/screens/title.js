game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        // reset the score
        game.data.score = 0;
        

        

        me.levelDirector.loadLevel("title");
    //Adds blinking text - called from index.html line 19
      <script>
      function blinker() {
	    $('.blinking').fadeOut(500);
	    $('.blinking').fadeIn(500);
    }
    setInterval(blinker, 1000);
      </script>
       

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    }
});

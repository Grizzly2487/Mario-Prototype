game.StartScreen = me.ScreenObject.extend(
{
  /**
   * action to perform on state change
   */
  onResetEvent : function () 
  {
	me.levelDirector.loadLevel("title");
    this.HUD = new game.HUD.Container();
    me.game.world.addChild(this.HUD);
    // change to play state on press Enter or click/tap
    me.input.bindKey(me.input.KEY.ENTER, "enter", true);
    this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) 
    {
      if (action === "enter") 
      {
        // play something on tap / enter
        // this will unlock audio on mobile devices
        me.audio.play("cling");
        me.audio.playTrack("World1BGM");
        me.levelDirector.loadLevel("World Select");
      }
    });
  },

  /**
   * action to perform when leaving this screen (state change)
   */
  onDestroyEvent : function () 
  {
    me.input.unbindKey(me.input.KEY.ENTER);
    me.event.unsubscribe(this.handler);
    me.game.world.removeChild(this.HUD);
  }
});
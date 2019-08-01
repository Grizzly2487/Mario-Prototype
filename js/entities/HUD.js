/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({

    init: function() {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // give a name
        this.name = "HUD";

        // add our child score object at the top left corner
        this.addChild(new game.HUD.ScoreItem(5, 5));
        this.addChild(new game.HUD.LivesItem(10, 5));
    }
});


/**
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend({
    /**
     * constructor
     */
    init: function(x, y) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 2, 2]);
        
         //create the font object
        this.font= new me.BitmapFont(me.loader.getBinary('PressStart2P'),
        //0.4 is the font size
        me.loader.getImage('PressStart2P'),0.4);
        
        // font alignment to right bottom
        this.font.textAlign = "right";
        this.font.textBaseline = "bottom";
        
        ;
        // change font size
        
        

            
        // local copy of the global score
        this.score = -1;
    },

    /**
     * update function
     */
    update : function () {
        // we don't do anything fancy here, so just
        // return true if the score has been updated
        if (this.score !== game.data.score) {
            this.score = game.data.score;
            return true;
        }
        return false;
    },

    /**
     * draw the score
     */
    draw : function (context) {
        // draw it baby !
         //this.pos.x, this.pos.y are the relative position from the screen right bottom
        //placement of the text
        this.font.draw(context, game.data.score, 340, 25);
        this.font.draw(context, "SCORE", 300, 25);
        
      
    }

});

game.HUD.LivesItem = me.Renderable.extend({
    /**
     * constructor
     */
    init: function(x, y) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 2, 2]);
        
         //create the font object
        this.font= new me.BitmapFont(me.loader.getBinary('PressStart2P'),
        //0.4 is the font size
        me.loader.getImage('PressStart2P'),0.4);
        
        // font alignment to right bottom
        this.font.textAlign = "right";
        this.font.textBaseline = "bottom";
        
        ;
        // change font size
        
        

            
        // local copy of the global score
        this.Lives = -1;
    },

    /**
     * update function
     */
    update : function () {
        // we don't do anything fancy here, so just
        // return true if the score has been updated
        if (this.lives !== game.data.lives) {
            this.lives = game.data.lives;
            return true;
        }
        return false;
    },

    /**
     * draw the score
     */
    draw : function (context) {
        // draw it baby !
         //this.pos.x, this.pos.y are the relative position from the screen right bottom
        //placement of the text
        this.font.draw(context, game.data.lives, 240, 25);
        this.font.draw(context, "Lives", 220, 25);
        
      
    }

});

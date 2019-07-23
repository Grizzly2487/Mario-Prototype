/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);
        
        this.body.setMaxVelocity(3,15);
        this,body.setfriction(0.4, 0);
        
        //set display to follow our postion on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);
        
        //ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        
        //TODO: add an animation to player
    },

    /**
     * update the entity
     */
    update : function (dt) {
        if(me.input.isKeyPressed('left'))
        {
            this.body.force.x = -this.body.maxVel.x;    
        }
         else
        {
            this.body.force.x =0;
        }
        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        // Make all other objects solid
        return true;
    }
});

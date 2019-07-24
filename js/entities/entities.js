/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);
        
        this.body.setMaxVelocity(3,15);
        this.body.setFriction(0.4, 0);
        
        //set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);
        
        //ensure that the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        
        
        //TODO: Add Animation to player
        
        //define a basic animation (using all frames)
        //this.renderable.addAnimation("walk", [0,1,2,3,4,5,6,7])
        
        //this.renderable.addAnimation("stand", [0])
        
        //set standing animation as default  
        //this.renderable.setCurrentAnimation("stand")
    },
    
    /**
     * update the entity
     */

    update : function (dt) 
    {
        if(me.input.isKeyPressed('left'))
            {
                this.renderable.flipX(true);
                this.body.force.x = -this.body.maxVel.x;
                //change to walking animation
                //if(!this.renderable.isCurrentAnimation("walk"))
                //{
                //this.renderable.setCurrentAnimation("walk");
                //}
            }
            else if(me.input.isKeyPressed('right'))
            {
                this.renderable.flipX(false);
                this.body.force.x = this.body.maxVel.x;
                //if(!this.renderable.isCurrentAnimation("walk"))
                //{
                //this.renderable.setCurrentAnimation("walk");
                //}
                
            }
            else
            {
                this.body.force.x = 0;
                //if(!this.renderable.isCurrentAnimation("stand"))
                //{
                //this.renderable.setCurrentAnimation("stand");
                //}
            }
       if(me.input.isKeyPressed('jump'))
        {
                
            if(!this.body.jumping && !this.body.falling)
            {
                //set current vel to the max defined value
                //gravity will then do the rest
                this.body.force.y = -this.body.maxVel.y;
            }   
            
        }
        else
        {
            this.body.force.y = 0;   
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

game.CoinEntity = me.CollectableEntity.extend({

     // extending the init function is not mandatory
    //unles you need to add some extra initialization
     
     init:function (x, y, settings) {
        // call the  parent constructor
        this._super(me.CollectableEntity, 'init', [x, y, settings]);
    },
    //this function is called by the engine
    //an object is touched by something (here collected)
    onCollision : function (response, other){
        //do something when collected
            
        //make sure is not collected again
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
            
        //remove it
        me.game.world.removeChild(this);
            
        return false
    }
});

game.KoopaEntity = me.Entity.extend({
    /**
     * constructor
     */
    
    init:function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);
        
        this.body.setMaxVelocity(3,15);
        this.body.setFriction(0.4, 0);
        
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
        //if(me.)
        //{
            //this.body.force.x = -this.body.maxVel.x;    
        //}
         //else
        //{
            this.body.force.x = this.body.maxVel.x;
        //}
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

        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
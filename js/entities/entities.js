/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {

        this.settings = settings;
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);
        
        this.body.setMaxVelocity(1.7,13);
        this.body.setFriction(0.4, 0);
        
        //set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);
        
        //ensure that the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        
        
        //TODO: Add Animation to player
        
        //define a basic animation (using all frames)
        this.renderable.addAnimation("walk", [0,1,2]);
        
        this.renderable.addAnimation("stand", [0]);
        
        //set standing animation as default  
        this.renderable.setCurrentAnimation("stand");
    },
    
    /**
     * update the entity
     */

    update : function (dt) 
    {
        if(me.input.isKeyPressed('run'))
        {
            this.body.setMaxVelocity(2.2,12.2);
            this.body.setFriction(0.4,0.3);
        }
        else{
            this.body.setMaxVelocity(1.7,13);
            this.body.setFriction(0.4, 0.3);
        }
            
        if(me.input.isKeyPressed('left'))
        {
            this.renderable.flipX(true);

            //update the entity velocity
            this.body.force.x = -this.body.maxVel.x;

            //change to walking animation
            if(!this.renderable.isCurrentAnimation("walk"))
            {
            this.renderable.setCurrentAnimation("walk");
            }
        }
            else if(me.input.isKeyPressed('right'))
            {
                //unflip the sprite
                this.renderable.flipX(false);
                
                //update the entity velocity
                this.body.force.x = this.body.maxVel.x;
                
                //change to walking animation
                if(!this.renderable.isCurrentAnimation("walk"))
                {
                this.renderable.setCurrentAnimation("walk");
                }
            }
            else
            {
                
                this.body.force.x = 0;
                
                //change to the standing animation
                //if(!this.renderable.isCurrentAnimation("stand"))
                //{
                this.renderable.setCurrentAnimation("stand");
                //}
            }
            if (me.input.isKeyPressed('jump')) 
            {
                if (!this.body.jumping && !this.body.falling && !this.body.jumping == 1)
                {
                  // --- Sets Jumping to 0, so mario can jump
                  this.body.jumping = 0;
                  // set current vel to the maximum defined value
                  // gravity will then do the rest
                  this.body.force.y = -this.body.maxVel.y
                  me.audio.play("jump");
              }
            } 
            else 
            {
              this.body.force.y = 0;
              // --- Sets Jumping to 1, so Mario cant jump mid air
              this.body.jumping = 1;
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
        
        switch(response.b.body.collisionType)
        {
                
            case me.collision.types.WORLD_SHAPE:
                
                //simulate platform object
                
                if(other.type === "platform")
                 {
                     if (this.body.falling && !me.input.isKeyPressed('down') && (response.overlapV.y > 0) && (~~this.body.vel.y >= ~~response.overlapV.y))
                    {
                    response.overlapV.x = 0;
                         //respond to the platform it is solid
                    // Make all other objects solid
                    return true;
                    }
                     //Do not repond to the platform pass through
                     return false;
                 }
                if(other.type === "TeleporterIn" && me.input.isKeyPressed('down'))
                    {
                        this.pos.x = 2271, 
                        this.pos.y = 589;
                    }
                if(other.type === "TeleporterOut")
                 {
                     this.pos.x = 2336;
                     this.pos.y = 416;
                 }
                if(other.type === "TeleporterUp")
                 {
                     this.pos.x = 2271;
                     this.pos.y = 137;
                 }
                break;
                case me.collision.types.ENEMY_OBJECT:
                if(other.type === "ItemBlock")
                 {
                     //other.type ="ItemBlockEmpty";
                     return true;
                 }
                
                    if( (response.overlapV.y > 0) && !this.body.jumping)
                        {
                            // make sure were on top of the other object
                            this.pos.y = other.pos.y - this.height - 2;
                            
                            //bounce (force jump)
                            this.body.falling = false
                            this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                            
                            //set the jumping flag
                            this.body.jumping = true;                           
                        game.data.score +=100;      
                        
                        me.audio.play("stomp");
                        
                            //onDestroyEvent: function() {
                        
                        
                        //make sure is not collected again
                        other.body.setCollisionMask(me.collision.types.NO_OBJECT);
            
                        //remove it
                        me.game.world.removeChild(other);
                        
                        }
                        else
                        {
                            this.renderable.flicker(300);
                            //me.levelDirector.loadLevel("Mario-Prototype");
					        //game.data.lives -= 1;
                        }
                        //if (game.data.lives === 0)
                        //{
                            //me.levelDirector.loadLevel("World Select");
                        //}
                        

            default:
                    //Do not respond to other objects (e.g.Coins)
                    return false;
        }
        
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
        game.data.score +=100;
        me.audio.play("cling");
        //make sure is not collected again
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
            
        //remove it
        me.game.world.removeChild(this);
            
        return false
    }
});
game.OneUpEntity = me.CollectableEntity.extend({

     // extending the init function is not mandatory
    //unles you need to add some extra initialization
     
    init:function (x, y, settings) {
        // call the  parent constructor
        
        var width = settings.width;
        settings.image ="1-UP";
        settings.framewidth = settings.width = 16;
        settings.frameheight = settings.height = 16;
        this._super(me.CollectableEntity, 'init', [x, y, settings]);
        
    },
    //this function is called by the engine
    //an object is touched by something (here collected)
    onCollision : function (response, other)
    {
        //do something when collected
         game.data.lives +=1;      
        //make sure is not collected again
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        //remove it
        me.game.world.removeChild(this);
            
        return false;
    }
});
game.LeafEntity = me.CollectableEntity.extend({

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
        game.data.score +=100;
        //insert animation here  
        //make sure is not collected again
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);   
        //remove it
        me.game.world.removeChild(this);
            
        return false
    }
});
game.MushroomEntity = me.CollectableEntity.extend({

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
        game.data.score +=100;
        //insert animation here      
        //make sure is not collected again
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
            
        //remove it
        me.game.world.removeChild(this);
            
        return false
    }
});       
game.ItemBlocksEntity = me.Entity.extend({
    /**
     * constructor
     */
    init:function (x, y, settings)
    {
        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);
    }
});
game.MarioLevelSelectEntity = me.Entity.extend(
{
    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);
        
        this.body.setMaxVelocity(1.5,1.5);
        this.body.setFriction(0.4, 0);
        this.body.gravity = 0;
        
        //set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);
        
        //ensure that the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        
        
        //TODO: Add Animation to player
        
        //define a basic animation (using all frames)
        this.renderable.addAnimation("walk", [0,1])
        
        this.renderable.addAnimation("stand", [0])
        
        //set standing animation as default  
        this.renderable.setCurrentAnimation("stand")
    },
    
    /**
     * update the entity
     */

    update : function (dt) 
    {
        if(me.input.isKeyPressed('left'))
            {
                this.body.force.x = -this.body.maxVel.x;
                //change to walking animation
                if(!this.renderable.isCurrentAnimation("walk"))
                {
                this.renderable.setCurrentAnimation("walk");
                }
            }
            else if(me.input.isKeyPressed('right'))
            {
                this.body.force.x = this.body.maxVel.x;
                if(!this.renderable.isCurrentAnimation("walk"))
                {
                this.renderable.setCurrentAnimation("walk");
                }
                
            }
            else if(me.input.isKeyPressed('down'))
            {
                this.body.force.y = this.body.maxVel.y;
                if(!this.renderable.isCurrentAnimation("walk"))
                {
                this.renderable.setCurrentAnimation("walk");
                }
                
            }
            else
            {
                this.body.force.x = 0;
                if(!this.renderable.isCurrentAnimation("stand"))
                {
                this.renderable.setCurrentAnimation("stand");
                }
            }
        if (me.input.isKeyPressed('jump'))
            if (!this.body.jumping && !this.body.falling && !this.body.jumping == 1)
            {
                // --- Sets Jumping to 0, so mario can jump
                //this.body.jumping = 0;
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.body.force.y = -this.body.maxVel.y
            }
            else 
            {
                this.body.force.y = 0;
                // --- Sets Jumping to 1, so Mario cant jump mid air
                //this.body.jumping = 1;
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
        
        switch(response.b.body.collisionType)
        {
                
            case me.collision.types.WORLD_SHAPE:
                
                //simulate platform object
                if(other.type === "platform")
                 {
                     if(this.body.falling && !me.input.isKeyPressed('down') && response.overlapV.y > 0 && ~~this.body.vel.y >= ~~response.overlapV.y)
                     {
                         response.overlapV.x = 0;
                         //respond to the platform it is solid
                    // Make all other objects solid
                    return true;
                    }
                     //Do not repond to the platform pass through
                     return false;
                 }
        // Make all other objects solid
        return true;
    
    }
}});
        
        
        
        
        
        
        
        
        
        
        
        
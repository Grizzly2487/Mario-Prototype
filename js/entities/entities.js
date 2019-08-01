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
        
        this.body.setMaxVelocity(1.5,15);
        this.body.setFriction(0.4, 0);
        
        //set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);
        
        //ensure that the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        this.isAlive = true;
        
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
        //change to running animation
        if(me.input.isKeyPressed('run'))
        {
            //update enemy velocity
            this.body.setMaxVelocity(2.5,18);
            this.body.setFriction(0.4,0.3);
        }
        else{
            this.body.setMaxVelocity(1.5,15);
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
                //Collision code for when mario falls off the map
                if(other.type === "DeathCollider")
                 {
                    console.log("onDeathCollider");
                    if(this.isAlive == true)
                            {   //if marios lives reach below 0 resets the game
                                this.isAlive = false;
                                if (game.data.lives === 0)
                                {   //Reset Score and lives back to normal
                                    game.data.lives = 5;
                                    game.data.score = 0;
                                    me.levelDirector.loadLevel("World Select");
                                }
                                else
                                {   //When mario has lost a life
                                    me.levelDirector.loadLevel("Mario-Prototype");
                                    game.data.lives -= 1;
                                }
                            }
                 }
                //Secret level pipe coding for transportation of mario to secret world
                if(other.type === "TeleporterIn" && me.input.isKeyPressed('down'))
                    {   //play sfx and move position
                        me.audio.play("warppipe");
                        this.pos.x = 2271, 
                        this.pos.y = 589;
                    }
                if(other.type === "TeleporterOut")
                 {  //play sfx and move position
                     me.audio.play("warppipe");
                     this.pos.x = 2336;
                     this.pos.y = 416;
                 }
                //Temporary fix because powerups are not working, teleports mario onto secret level pipe
                if(other.type === "TeleporterUp")
                 {
                     //move position
                     this.pos.x = 2271;
                     this.pos.y = 137;
                 }
                break;
                case me.collision.types.ENEMY_OBJECT:
                //item blocks are not working either, this makes them a solid entity
                if(other.type === "ItemBlock")
                 {
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
                            //Points from enemy death
                            game.data.score +=100;      
                            //Play sfx for enemy death
                            me.audio.play("stomp");
                        
                        //make sure is not collected again
                        other.body.setCollisionMask(me.collision.types.NO_OBJECT);
            
                        //remove it
                        me.game.world.removeChild(other);
                        
                        }
                        else
                        {   //Mario gets hit and flickers
                            this.renderable.flicker(300);
                            if(this.isAlive == true)
                            {   //if marios lives reach below 0 resets the game
                                this.isAlive = false;
                                if (game.data.lives === 0)
                                {
                                    game.data.lives = 5;
                                    game.data.score = 0;
                                    me.levelDirector.loadLevel("World Select");
                                }
                                else
                                {   //When mario has lost a life
                                    me.levelDirector.loadLevel("Mario-Prototype");
                                    game.data.lives -= 1;
                                }
                            }
                        }
            default:
                    //Do not respond to other objects (e.g.Coins)
                    return false;
        }
        
        // Make all other objects solid
        return true;
    
    }
});
//The Coin objects code
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
//One Up Power up entity
game.OneUpEntity = me.CollectableEntity.extend({

     // extending the init function is not mandatory
    //unles you need to add some extra initialization
     
    init:function (x, y, settings) {
        // call the  parent constructor
        
        var width = settings.width;
        //set the image
        settings.image ="1-UP";
        //set the settings of the frame
        settings.framewidth = settings.width = 16;
        settings.frameheight = settings.height = 16;
        //call the constructor
        this._super(me.CollectableEntity, 'init', [x, y, settings]);
        
    },
    //this function is called by the engine
    //an object is touched by something (here collected)
    onCollision : function (response, other)
    {
        //do something when collected
         game.data.lives +=1;      
         me.audio.play("1up");
        //make sure is not collected again
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        //remove it
        me.game.world.removeChild(this);
            
        return false;
    }
});
//Leaf entities code
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
        //Play sfx
        me.audio.play("powerup");
        //Gain Points in score
        game.data.score +=100;
        //insert animation here  
        //make sure is not collected again
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);   
        //remove it
        me.game.world.removeChild(this);
            
        return false
    }
});
//Mushroom entities code
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
        //Play sfx
        me.audio.play("powerup");
        //Gain points for score
        game.data.score +=100;
        //insert animation here      
        //make sure is not collected again
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
            
        //remove it
        me.game.world.removeChild(this);
            
        return false
    }
});
//Item Blocks code(didn't end up getting this working)
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
//Marios World Select Entity code
game.MarioLevelSelectEntity = me.Entity.extend(
{
    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);
        //set max velocity for x and y
        this.body.setMaxVelocity(1.5,1.5);
        //set friction for player
        this.body.setFriction(0.4, 0);
        //remove gravity for world select
        this.body.gravity = 0;
        
        //set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);
        
        //ensure that the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        
        
        //TODO: Add Animation to player
        
        //Walking Animation (using all frames)
        this.renderable.addAnimation("walk", [0,1])
        //Standing Animation
        this.renderable.addAnimation("stand", [0])
        
        //set standing animation as default  
        this.renderable.setCurrentAnimation("stand")
    },
    
    /**
     * update the entity
     */
    //Marios Movement and Keypressed Code
    update : function (dt) 
    {   //move mario left on world select screen
        if(me.input.isKeyPressed('left'))
            {
                this.body.force.x = -this.body.maxVel.x;
                //change to walking animation
                if(!this.renderable.isCurrentAnimation("walk"))
                {
                this.renderable.setCurrentAnimation("walk");
                }
            }
            //move mario right on world select screen
            else if(me.input.isKeyPressed('right'))
            {   //change to walking animation, move mario right on world select screen
                this.body.force.x = this.body.maxVel.x;
                if(!this.renderable.isCurrentAnimation("walk"))
                {
                this.renderable.setCurrentAnimation("walk");
                }
                
            }
            else if(me.input.isKeyPressed('down'))
            {   //change to walking animation,move mario down on world select screen
                this.body.force.y = this.body.maxVel.y;
                if(!this.renderable.isCurrentAnimation("walk"))
                {
                this.renderable.setCurrentAnimation("walk");
                }
                
            }
            else
            {   //stops mario and makes his animation stop
                this.body.force.x = 0;
                if(!this.renderable.isCurrentAnimation("stand"))
                {
                this.renderable.setCurrentAnimation("stand");
                }
            }
        //moves mario up in the world select screen
        if (me.input.isKeyPressed('jump'))
            if (!this.body.jumping && !this.body.falling && !this.body.jumping == 1)
            {   //moves mario up
                this.body.force.y = -this.body.maxVel.y
            }
            else 
            {   //stops marios movement
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
    //Mario world select only needs these collisions to react with the collisions set in tiled to navigate the world map.
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
        
        
        
        
        
        
        
        
        
        
        
        
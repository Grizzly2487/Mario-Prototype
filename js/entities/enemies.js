/**
 * Player Entity
 */
game.KoopaEntity = me.Entity.extend(
    
{
    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the constructor
        
        // save the area size as defined in tile
        var width = settings.width
        
        //define this here instead instead of tiled   
        settings.image ="Turtle.png";
        
        //adjust the setting information to match sprite size
        settings.framewidth = settings.width = 17;
        settings.frameheight = settings.height = 27;
        
        // call the parent constructor
        this._super(me.Entity, 'init', [x, y, settings]);
        
        // add a physics body
        this.body = new me.Body(this);
        //add a default collision shape
        this.body.addShape(new me.Rect(0,0,this.width,this.height));
        
        this.body.setMaxVelocity(3,15);
        this.body.setFriction(0.7, 0);
        //enable physic collision (off by default for basic me.Renderable
        this.isKinematic = false;
        
        // set start and end position on the initial area size
        x=this.pos.x;
        this.StartX = x;
        this.pos.x = this.endX = x + width - this.width;
        // to remeber which side we were walking
        this.walkLeft = false;
        //make it alive
        this.alive = true;
    },
    
    /**
     * update the entity
     */
    update : function (dt) 
    {
        if(this.alive)
        {
            if(this.walkLeft && this.pos.x <= this.StartX)
                {
                    this.walkLeft = false;
                    this.body.force.x = this.body.maxVel.x;
                }
                else if (!this.walkLeft && this.pos.x >= this.endX)    
                {
                    this.walkLeft = true
                    this.body.force.x = -this.body.maxVel.x;
                }
            
            
            this.renderable.flipX(this.walkLeft);
        }
        else
        {
            this.body.force.x = 0 
            
        }
            
        
        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

   /**
     * collision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        
        if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE)
        {
            
            //res.y>0 this means touched by something on the bottom
            //which means top position for this one
            
            if(this.alive && (response.overlapV.y > 0)&& 
                response.a.body.falling)
            {
                //this.renderable.flicker(750)
            }
                return false;
        }
        
        // Make all other objects solid
        return true;
    }
});

/*game.CoinEntity = me.CollectableEntity.extend({

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
     * constructor
    */
    
    //init:function (x, y, settings) {
        // call the constructor
        /*this._super(me.Entity, 'init', [x, y , settings]);
        
        this.body.setMaxVelocity(3,15);
        this.body.setFriction(0.4, 0);
        
        //ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        
        //TODO: add an animation to player
    },

    /**
     * update the entity
     */
    //update : function (dt) {
        //if(me.)
        //{
            //this.body.force.x = -this.body.maxVel.x;    
        //}
         //else
        //{
            /*this.body.force.x = this.body.maxVel.x;
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
    //onCollision : function (response, other) {
        // Make all other objects solid
        //return true;
    
//});

game.GoombaEntity = me.Entity.extend({
    /**
     * constructor
     */
    
     init:function (x, y, settings) {
        // call the constructor
        
        // save the area size as defined in tile
        var width = settings.width
        
        //define this here instead instead of tiled   
        settings.image ="Goomba.png";
        
        //adjust the setting information to match sprite size
        settings.framewidth = settings.width = 17;
        settings.frameheight = settings.height = 27;
        
        // call the parent constructor
        this._super(me.Entity, 'init', [x, y, settings]);
        
        // add a physics body
        this.body = new me.Body(this);
        //add a default collision shape
        this.body.addShape(new me.Rect(0,0,this.width,this.height));
        
        this.body.setMaxVelocity(3,15);
        this.body.setFriction(0.7, 0);
        //enable physic collision (off by default for basic me.Renderable
        this.isKinematic = false;
        
        // set start and end position on the initial area size
        x=this.pos.x;
        this.StartX = x;
        this.pos.x = this.endX = x + width - this.width;
        // to remeber which side we were walking
        this.walkLeft = false;
        //make it alive
        this.alive = true;
    },
    
    /**
     * update the entity
     */
    update : function (dt) 
    {
        if(this.alive)
        {
            if(this.walkLeft && this.pos.x <= this.StartX)
                {
                    this.walkLeft = false;
                    this.body.force.x = this.body.maxVel.x;
                }
                else if (!this.walkLeft && this.pos.x >= this.endX)    
                {
                    this.walkLeft = true
                    this.body.force.x = -this.body.maxVel.x;
                }
            
            
            this.renderable.flipX(this.walkLeft);
        }
        else
        {
            this.body.force.x = 0 
            
        }
            
        
        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

   /**
     * collision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) 
    {
        
        if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE)
        {
            
            //res.y>0 this means touched by something on the bottom
            //which means top position for this one
            
            if(this.alive && (response.overlapV.y > 0)&& 
                response.a.body.falling)
            {
                //this.renderable.flicker(750)
            }
                return false;
        }
        
        // Make all other objects solid
        return true;
    }
});       

game.PirhanaPlant = me.Entity.extend({

     init: function (x, y, settings)
     {
         // save the area size as defined in Tiled
         var width = settings.width;

         // define this here instead of tiled
         settings.image = "PirhanaPlant";

         // adjust the size setting information to match the sprite size
         // so that the entity object is created with the right size
         settings.framewidth = settings.width = 64;
         settings.frameheight = settings.height = 64;

         // call the parent constructor
         this._super(me.Sprite, 'init', [x, y , settings]);

         // add a physic body
         this.body = new me.Body(this);
         // add a default collision shape
         this.body.addShape(new me.Rect(0, 0, this.width, this.height));
         // configure max speed and friction
         this.body.setMaxVelocity(0, 6);
         
         // enable physic collision (off by default for basic me.Renderable)
         this.isKinematic = false;

         // set start/end position based on the initial area size
         //Must be changed for plant
         x = this.pos.x;
         this.startX = x;
         this.pos.x = this.endX = x + width - this.width;
         //this.pos.x  = x + width - this.width;

         // to remember which side we were walking
         this.walkLeft = false;

         // make it "alive"
         this.alive = true;
     },

  /**
   * update the entity
   */
  update : function (dt) 
  {
      if(this.alive)
      {
          if(this.walkLeft && this.pos.x <= this.startX)
          {
              this.walkLeft = false;
              this.body.force.x = this.body.maxVel.x;
          }
          else if(!this.walkLeft && this.pos.x >= this.endX)
          {
              this.walkLeft = true;
              this.body.force.x = -this.body.maxVel.x;
          }
          this.flipX(this.walkLeft);
      }
      else
      {
        this.body.force.x = 0;  
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
      
      if(response.b.body.collisionType !== me.collision.types.WORLD_SHAPE)
      {
          //res.y >0 this means touched by something on the bottom
          // which means at top position for this one
          
          if(this.alive && (response.overlapV.y > 0) && response.a.body.falling)
          {
              //this.renderable.flicker(750);
          }
          return false;
      }
      
    // Make all other objects solid
    return true;
  }
});
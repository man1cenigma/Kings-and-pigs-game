class Player extends Sprite {
    constructor({
        collisionBlocks = [], imageSrc, frameRate, animations, loop
    }) {
        // Initialize sprite with starting position and image
        super({ 
            position: { x: 250, y: 250 }, 
            imageSrc, 
            frameRate,
            animations,
            loop,  
        })
        
        // Canvas context references
        this.c = c
        this.canvas = canvas
        
        // Movement velocity
        this.velocity = {
            x: 0,
            y: 0,
        }
        
        // Player dimensions
        this.width = 35
        this.height = 35
        
        // Track bottom edge for ground detection
        this.sides = {
            bottom: this.position.y + this.height
        }
        
        // Physics properties
        this.gravity = 1
        this.onGround = false

        // Collision blocks for level collision detection
        this.collisionBlocks = collisionBlocks
        console.log(this.collisionBlocks)
    }

    // Switch between different sprite animations
    switchSprite(name) {
        if (this.image === this.animations[name].image) return
        this.currentFrame = 0
        this.image = this.animations[name].image
        this.frameRate = this.animations[name].frameRate
        this.frameBuffer = this.animations[name].frameBuffer
        this.loop = this.animations[name].loop
        this.currentAnimation = this.animations[name]
        this.currentAnimation.completed = false // Reset completion flag
    }

    // Update hitbox position relative to player
    updateHitBox() {
        this.hitBox = {
            position: {
                x: this.position.x + 58,
                y: this.position.y + 34,
            },
            width: 50,
            height: 53,
        }
    }

    // Draw player sprite and debug hitbox
    draw() {
        // Draw sprite or fallback rectangle
        if (this.loaded) {
            super.draw()
        } else {
            c.fillStyle = 'rgba(0, 0, 255, 0.5)'
            c.fillRect(this.position.x, this.position.y, this.width, this.height)
        }
        
        // Debug hitbox visualization
        if (this.hitBox) {
            c.fillStyle = 'rgba(255, 0, 0, 0.3)'
            c.fillRect(this.hitBox.position.x, this.hitBox.position.y, this.hitBox.width, this.hitBox.height)
        }
    }

    // Handle keyboard input for movement
    handleInput() {
        // Skip input if player is prevented (e.g., in door animation)
        if (this.preventInput) return
        
        // Handle both keys pressed (cancel movement)
        if (keys.a.pressed && keys.d.pressed) {
            this.velocity.x = 0
            this.switchSprite(lastDirection === 'right' ? 'idleRight' : 'idleLeft')
        }
        // Move right
        else if (keys.d.pressed) {
            this.switchSprite('runRight')
            this.velocity.x = 5
            lastDirection = 'right'
        }
        // Move left
        else if (keys.a.pressed) {
            this.switchSprite('runLeft')
            this.velocity.x = -5
            lastDirection = 'left'
        }
        // No movement (idle)
        else {
            this.velocity.x = 0
            this.switchSprite(lastDirection === 'right' ? 'idleRight' : 'idleLeft')
        }
    }

    update() {
        // Process input first
        this.handleInput()
        
        // Apply horizontal movement
        this.position.x += this.velocity.x
        
        // Update hitbox BEFORE collision detection
        this.updateHitBox()
        
        // Check horizontal collisions with level blocks
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const CollisionBlock = this.collisionBlocks[i]
            
            // AABB collision detection
            if (this.hitBox.position.x <= CollisionBlock.position.x + CollisionBlock.width &&
                this.hitBox.position.x + this.hitBox.width >= CollisionBlock.position.x &&
                this.hitBox.position.y + this.hitBox.height >= CollisionBlock.position.y &&
                this.hitBox.position.y <= CollisionBlock.position.y + CollisionBlock.height
            ) {
                // Resolve collision based on movement direction
                if (this.velocity.x < 0) {
                    this.position.x = CollisionBlock.position.x + CollisionBlock.width - (this.hitBox.position.x - this.position.x) + 0.01
                    break
                }
                if (this.velocity.x > 0) {
                    this.position.x = CollisionBlock.position.x - this.hitBox.width - (this.hitBox.position.x - this.position.x) - 0.01
                    break
                }
            }
        }
        
        // Apply vertical movement
        this.position.y += this.velocity.y
        this.sides.bottom = this.position.y + this.height

        // Update hitbox after vertical movement
        this.updateHitBox()

        // Reset ground state for each frame
        this.onGround = false

        // Check vertical collisions with level blocks
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const CollisionBlock = this.collisionBlocks[i]
            
            // AABB collision detection
            if (this.hitBox.position.x <= CollisionBlock.position.x + CollisionBlock.width &&
                this.hitBox.position.x + this.hitBox.width >= CollisionBlock.position.x &&
                this.hitBox.position.y + this.hitBox.height >= CollisionBlock.position.y &&
                this.hitBox.position.y <= CollisionBlock.position.y + CollisionBlock.height
            ) {
                // Landing on platform from above
                if (this.velocity.y > 0) {
                    const hitBoxBottomOffset = (this.hitBox.position.y - this.position.y) + this.hitBox.height
                    this.position.y = CollisionBlock.position.y - hitBoxBottomOffset - 0.01
                    this.velocity.y = 0
                    this.onGround = true
                    break
                }
                // Hitting ceiling from below
                if (this.velocity.y < 0) {
                    const hitBoxTopOffset = this.hitBox.position.y - this.position.y
                    this.position.y = CollisionBlock.position.y + CollisionBlock.height - hitBoxTopOffset + 0.01
                    this.velocity.y = 0
                    break
                }
            }
        }

        // Canvas bottom boundary collision
        if (this.sides.bottom >= this.canvas.height) {
            this.position.y = this.canvas.height - this.height
            this.velocity.y = 0
            this.onGround = true
        }
        
        // Apply gravity when not on ground
        if (!this.onGround) {
            this.velocity.y += this.gravity
        }
    }
}


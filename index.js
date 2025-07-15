// Canvas setup and initialization
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// Set canvas dimensions (16x9 grid of 64px tiles)
canvas.width = 64 * 16
canvas.height = 64 * 9

// Parse collision data into 2D array and create collision blocks
let parsedCollisions 
let collisionBlocks 
let background
let doors 

// Initialize level 1 first
let level = 1
let levels = {
    1: {
        init: () => {
            // Clear previous collision blocks
            collisionBlocks = []
            
            // Parse collision data into 2D array and create collision blocks
            parsedCollisions = collisionsLevel1.parse2D()
            collisionBlocks = parsedCollisions.createObjectsFrom2D()
            
            // Create game objects
            background = new Sprite({
                position: {
                    x: 0,
                    y: 0,
                },
                imageSrc: './img/backgroundLevel1.png'
            })
            doors = [
                new Sprite({
                    position: {
                        x: 768,
                        y: 272,
                    },
                    imageSrc: './img/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 5,
                    loop: false,
                    autoplay: false  
                }),
            ]
        },
    },
    2: {
        init: () => {
            // Clear previous collision blocks
            collisionBlocks = []
            
            // Parse collision data into 2D array and create collision blocks
            parsedCollisions = collisionsLevel2.parse2D()
            collisionBlocks = parsedCollisions.createObjectsFrom2D()
            
            // Update player position for level 2
            if (player) {
                player.position.x = 96
                player.position.y = 140
                
                // IMPORTANT: Update player's collision blocks reference
                player.collisionBlocks = collisionBlocks
                
                // Reset player state
                player.velocity.x = 0
                player.velocity.y = 0
                player.preventInput = false
                player.switchSprite('idleRight')
            }
            
            // Create game objects
            background = new Sprite({
                position: {
                    x: 0,
                    y: 0,
                },
                imageSrc: './img/backgroundLevel2.png'
            })
            doors = [
                new Sprite({
                    position: {
                        x: 772,
                        y: 336,
                    },
                    imageSrc: './img/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 5,
                    loop: false,
                    autoplay: false,
                }),
            ]
        },
    },
    3: {
        init: () => {
            // Clear previous collision blocks
            collisionBlocks = []
            
            // Parse collision data into 2D array and create collision blocks
            parsedCollisions = collisionsLevel3.parse2D()
            collisionBlocks = parsedCollisions.createObjectsFrom2D()
            
            // Update player position for level 3
            if (player) {
                player.position.x = 780  // Moved left from 815
                player.position.y = 320  // Moved higher from 355
                
                // IMPORTANT: Update player's collision blocks reference
                player.collisionBlocks = collisionBlocks
                
                // Reset player state
                player.velocity.x = 0
                player.velocity.y = 0
                player.preventInput = false
                player.switchSprite('idleRight')
            }
            
            // Create game objects
            background = new Sprite({
                position: {
                    x: 0,
                    y: 0,
                },
                imageSrc: './img/backgroundLevel3.png'
            })
            doors = [
                new Sprite({
                    position: {
                        x: 176,
                        y: 334,
                    },
                    imageSrc: './img/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 5,
                    loop: false,
                    autoplay: false,
                }),
            ]
        },
    }
}

// Initialize level before creating player
levels[level].init()

// create player with initialized collision blocks
const player = new Player({
    collisionBlocks,
    imageSrc: './img/king/idle.png',
    frameRate: 11,
    animations: {
        idleRight: {
            frameRate: 11,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/king/idle.png',
        },
         idleLeft: {
            frameRate: 11,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/king/idleLeft.png',
        },
         runRight: {
            frameRate: 8,
            frameBuffer: 3,
            loop: true,
            imageSrc: './img/king/runRight.png',
        },
         runLeft: {
            frameRate: 8,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/king/runLeft.png',
        },
         enterDoor: {
            frameRate: 8,
            frameBuffer: 2,
            loop: false,
            imageSrc: './img/king/enterDoor.png',
            onComplete: () => {
                console.log('completed animation')
                gsap.to(overlay, {
                    opacity: 1,
                    duration: 1,
                    onComplete: () => {
                        level++
                        if (levels[level]) {
                            levels[level].init()
                            gsap.to(overlay, {
                                opacity: 0,
                                duration: 1
                            })
                        } else {
                            console.log('Game completed!')
                            // Reset to level 1 or handle game completion
                            level = 1
                            levels[level].init()
                            gsap.to(overlay, {
                                opacity: 0,
                                duration: 1
                            })
                        }
                    }
                })
            }
        },
    },
})

// Input state tracking
const keys = {
    w: { pressed: false },
    a: { pressed: false },
    d: { pressed: false }
}

let lastDirection = 'right' // Track which way player was last facing

const overlay = {
    opacity: 0,
}

// Main game loop
function animate() {
    window.requestAnimationFrame(animate)
    
    // Clear canvas
    c.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw background
    background.draw()
    
    // Draw collision blocks
    collisionBlocks.forEach(block => {
        block.draw()
    })

    doors.forEach((door) => {
        door.update()
        door.draw()
    })

    // Update and draw player
    player.update()
    player.draw()

    // Draw overlay
    c.save()
    c.globalAlpha = overlay.opacity
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    c.restore()
}

// Start the game loop
animate()




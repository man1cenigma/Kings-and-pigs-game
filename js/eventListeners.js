// Make sure these variables are accessible
console.log('eventListeners.js loaded')
console.log('player:', player)
console.log('doors:', doors)
console.log('keys:', keys)

// Key press events - only handle 'w' key for door interaction
window.addEventListener('keydown', (event) => {
    console.log('Key pressed:', event.key)
    if (player.preventInput) return
    
    switch (event.key) {
        case 'w':
            console.log('=== DEBUG INFO ===')
            console.log('Player position:', player.position)
            console.log('Player hitbox:', player.hitBox)
            console.log('Door position:', doors[0].position)
            console.log('Door size:', doors[0].width, doors[0].height)
            console.log('Door loaded:', doors[0].loaded)
            
            // First check if player is colliding with any door for interaction
            let doorInteraction = false
            
            for (let i = 0; i < doors.length; i++) {
                const door = doors[i]
                
                // Add debug logging
                console.log('Checking door collision...')
                console.log('Player hitbox:', player.hitBox)
                console.log('Door position:', door.position, 'Door size:', door.width, door.height)
                
                // Use player.hitBox and make sure door dimensions exist
                if (player.hitBox && door.loaded &&
                    player.hitBox.position.x <= door.position.x + door.width &&
                    player.hitBox.position.x + player.hitBox.width >= door.position.x &&
                    player.hitBox.position.y + player.hitBox.height >= door.position.y &&
                    player.hitBox.position.y <= door.position.y + door.height
                ) {
                    console.log('Door collision detected!')
                    doorInteraction = true
                    player.velocity.x = 0
                    player.velocity.y = 0
                    player.preventInput = true
                    player.switchSprite('enterDoor')
                    
                    // Reset door animation and play
                    door.currentFrame = 0
                    door.autoplay = true
                    console.log('Door animation started')
                    return // Exit early - door interaction takes priority
                }
            }
            
            // If no door interaction and player is on ground, allow jumping
            if (!doorInteraction && player.onGround) {
                player.velocity.y = -15
            }
            break
        case 'a':
            keys.a.pressed = true
            break
        case 'd':
            keys.d.pressed = true
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'a':
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})
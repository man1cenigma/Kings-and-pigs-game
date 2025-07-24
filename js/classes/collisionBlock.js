class CollisionBlock { // Fixed: removed 's'
    constructor({position}) {
        // Block position on canvas
        this.position = position
        
        // Standard tile dimensions (64x64 pixels)
        this.width = 64
        this.height = 64
    }

    // Draw collision block as red rectangle (for debugging)
    draw() {
        c.fillStyle = 'rgba(255, 0, 0, 0)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

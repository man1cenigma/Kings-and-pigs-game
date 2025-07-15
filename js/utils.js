// Array method to convert 1D array to 2D array
// Splits array into rows of 16 elements each
Array.prototype.parse2D = function() {
    const rows = []
    for (let i = 0; i < this.length; i += 16) {
        rows.push(this.slice(i, i + 16))
    }
    return rows
}

// Array method to create collision objects from 2D array
Array.prototype.createObjectsFrom2D = function() {
    const objects = []
    this.forEach((row, y) => {
        row.forEach((symbol, x) => {
            // Check for all collision block types
            if (symbol === 292 || symbol === 290 || symbol === 250) {
                objects.push(
                    new CollisionBlock({
                        position: {
                            x: x * 64,
                            y: y * 64
                        }
                    })
                )
            }
        })
    })
    return objects
}
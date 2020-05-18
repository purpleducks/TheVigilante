class Pipe { 	// ADAPTED FROM THE FOLLOWING SOURCE: https://github.com/dheineman/pipes
	
	constructor(name, difficulty) {
		this.x = 0;
		this.y = 0;
		this.active = 0;
		this.connections = Array.apply(null, new Array(4)).map(Number.prototype.valueOf,0);
	}

	setActive(activeFlag) {
		this.active = (activeFlag ? 1 : 0);	
	}

	isActive() {
		return this.active === 1;	// we do this because 1 and true are not the same in JS
	}

	getNeighbour(direction, grid) {
		var dx = 0;
        var dy = 0;

        if (direction == grid.direction.RIGHT) {
            dx = 1;
        } else if(direction == grid.direction.LEFT) {
            dx = -1;
        }

        if (direction == grid.direction.UP) {
            dy = 1;
        } else if(direction == grid.direction.DOWN) {
            dy = -1;
        }

        return grid.getPipe(this.x + dx, this.y + dy);
	}

	hasConnection(direction) {
		return this.connections[direction] === 1;
	}

	rotate() {
		this.connections.splice(0, 0, this.connections.splice((this.connections.length-1), 1)[0]);
	}

}
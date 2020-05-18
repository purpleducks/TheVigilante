class Grid extends Minigame {	// ADAPTED FROM THE FOLLOWING SOURCE: https://github.com/dheineman/pipes
	
	constructor() {
        var tempCurrObj = JSON.parse(localStorage.getItem("currentObject"));
        super(tempCurrObj.name, 0);
		this.size = tempCurrObj["minigame-size"];
		this.pipes = [];
		this.direction = {
	        DOWN: 2,
	        LEFT: 3,
	        RIGHT: 1,
	        UP: 0
	    };
	    this.reverse_direction = {
	        2: 0,
	        3: 1,
	        1: 3,
	        0: 2
	    };
        this.noOfAttempts = tempCurrObj["minigame-attempts"];
        this.time = tempCurrObj["minigame-time"];
        this.failingObj = tempCurrObj.link[1];
        this.succeedingObj = tempCurrObj.link[0];
	}

	init() {
		if (this.size % 2 == false) {
            console.log("Cannot create grid with even number of rows/columns");
            return;
        }
        
        this.initPipes();
        this.buildPipes();
        this.scramblePipes();
        this.checkPipes();
        this.draw();
	} 

	getPipe(x, y) {
		if (typeof this.pipes[x] !== "undefined" && typeof this.pipes[x][y] !== "undefined") {
            return this.pipes[x][y];
        }
	}

	getPipes() {
		var pipes = [];
        for (x in this.pipes) {
            for(y in this.pipes[x]) {
                pipes.push(this.getPipe(x, y));
            }
        }

        return pipes;
	}

	initPipes() {
        this.pipes = [];
        for (var x = 1; x <= this.size; x++) {
            this.pipes[x] = [];
            for (var y = 1; y <= this.size; y++) {
                var pipe = new Pipe();
                pipe.x = x;
                pipe.y = y;

                this.pipes[x][y] = pipe;
            }
        }
	}

	buildPipes() {
		// Define variables
        var total_pipes = this.size * this.size;
        var connected_pipes = [];

        // Add a random first pipe
        var x = Math.ceil(this.size / 2);
        var y = Math.ceil(this.size / 2);

        pipe = this.getPipe(x, y);
        pipe.active = 1;

        connected_pipes.push(pipe);

        while (connected_pipes.length < total_pipes) {
            // Get a pipe in the set
            var pipe = connected_pipes[Math.floor(Math.random() * connected_pipes.length)];

            // Create a random direction
            var direction = Math.floor(Math.random() * 4);

            var neighbor = pipe.getNeighbour(direction, this);
            var reverse_direction = this.reverse_direction[direction];

            if (typeof neighbor != "undefined" && neighbor.connections.indexOf(1) == -1) {
                pipe.connections[direction] = 1;
                neighbor.connections[reverse_direction] = 1;

                connected_pipes.push(neighbor);
            }
        }
	}

	scramblePipes() {
		for (var x = 1; x < this.pipes.length; x++) {
            for (var y = 1; y < this.pipes.length; y++) {
                var pipe = this.getPipe(x, y);
                var random = Math.floor(Math.random() * 4);

                for (var i = 0; i < random; i++) {
                    pipe.rotate();
                }
            }
        }
	}

	deactivatePipes() {
		for (var x = 1; x < this.pipes.length; x++) {
            for (var y = 1; y < this.pipes.length; y++) {
                this.getPipe(x, y).setActive(false);
            }
        }
	}

	checkPipes() {
		var connected_pipes = [];
        var pipes_to_check = [];

        // Disable all pipes
        this.deactivatePipes();

        // Get the center pipe, set is to active, an add it to the set to be checked
        var center_pipe = this.getPipe(Math.ceil(this.size/2), Math.ceil(this.size/2));
        center_pipe.setActive(true);

        connected_pipes.push(center_pipe);
        pipes_to_check.push(center_pipe);

        // While there are still pipes left to be checked
        while (pipes_to_check.length > 0) {
            var pipe = pipes_to_check.pop();
            var x = pipe.x;
            var y = pipe.y

            // Check if this pipe has a connection up
            if (pipe.hasConnection(this.direction.UP)) {
                var pipe_above = this.getPipe(x-1, y);
                if (typeof pipe_above !== "undefined" && pipe_above.hasConnection(this.direction.DOWN) && !pipe_above.isActive()) {
                    pipe_above.setActive(true);

                    connected_pipes.push(pipe_above);
                    pipes_to_check.push(pipe_above);
                }
            }

            // Check if this pipe has a connection down
            if(pipe.hasConnection(this.direction.DOWN)) {
                var pipe_below = this.getPipe(x+1, y);
                if (typeof pipe_below !== "undefined" && pipe_below.hasConnection(this.direction.UP) && !pipe_below.isActive()) {
                    pipe_below.setActive(true);

                    connected_pipes.push(pipe_below);
                    pipes_to_check.push(pipe_below);
                }
            }

            // Check if this pipe has a connection right
            if (pipe.hasConnection(this.direction.RIGHT)) {
                var pipe_next = this.getPipe(x, y+1);
                if (typeof pipe_next !== "undefined" && pipe_next.hasConnection(this.direction.LEFT) && !pipe_next.isActive()) {
                    pipe_next.setActive(true);

                    connected_pipes.push(pipe_next);
                    pipes_to_check.push(pipe_next);
                }
            }

            // Check if the pipe has a connection left
            if (pipe.hasConnection(this.direction.LEFT)) {
                var pipe_previous = this.getPipe(x, y-1);
                if (typeof pipe_previous !== "undefined" && pipe_previous.hasConnection(this.direction.RIGHT) && !pipe_previous.isActive()) {
                    pipe_previous.setActive(true);

                    connected_pipes.push(pipe_previous);
                    pipes_to_check.push(pipe_previous);
                }
            }
        }

        // Check if the user has won
        if (connected_pipes.length == (this.size * this.size)) {
            var that = this;
            setTimeout(function(){
                document.getElementById("gameResult").style.visibility = "visible";
                document.getElementById("gameResultSpeech").innerHTML = "YOU'RE IN! 👩‍💻👨‍💻👨‍💻";
                document.getElementById("gameResultSpeech").style.color = "limegreen";
                var musicPlayer = $("#musicPlayer").get(0);
                musicPlayer.pause();
                musicPlayer.setAttribute('src', "../music/success.mp3");
                musicPlayer.load();
                musicPlayer.play();
                var allActions = JSON.parse(localStorage.getItem("allActions"));
                allActions.push(that.succeedingObj);
                localStorage.setItem("allActions", JSON.stringify(allActions));

                setTimeout(function() {
                    window.location.replace("../main.html");
                }, 2000);
            })
        }
	}

	draw() {
		var grid_div = document.getElementById("grid");
        grid_div.innerHTML = '';

        for (var x in this.pipes) {
            var row = this.pipes[x];

            var row_div = document.createElement('div');
            row_div.className = "row_pipes";

            for (var y in row) {
                var pipe = row[y];
                var pipe_div = document.createElement('img');

                pipe_div.className = "pipe";

                pipe_div.setAttribute('data-x', x);
                pipe_div.setAttribute('data-y', y);

                // pipe_div.setAttribute('onClick', 'rotatePipe(this)');

                pipe_div.setAttribute('onClick', 'rotatePipe(this)');

                if (pipe.connections[0] === 1) {
                    pipe_div.className += " u";
                }

                if (pipe.connections[1] === 1) {
                    pipe_div.className += " r";
                }

                if (pipe.connections[2] === 1) {
                    pipe_div.className += " d";
                }

                if (pipe.connections[3] === 1) {
                    pipe_div.className += " l";
                }
                var entryPoints = pipe.connections.filter(Boolean).length;
                var edgeCase = false;
                if (pipe.active == 1) {
                    pipe_div.className += " a";
                    console.log(pipe.connections);
                    switch(entryPoints) {
                        case 1:
                            pipe_div.src = "../images/end_a.png";
                            break;
                        case 3:
                            pipe_div.src = "../images/tsplit_a.png";
                            break;
                        case 4:
                            pipe_div.src = "../images/cross_a.png";
                            break;
                        default:
                            edgeCase = true;
                            break;
                    }
                } else {
                    switch(entryPoints) {
                        case 1:
                            pipe_div.src = "../images/end.png";
                            break;
                        case 3:
                            pipe_div.src = "../images/tsplit.png";
                            break;
                        case 4:
                            pipe_div.src = "../images/cross.png";
                            break;
                        default:
                            edgeCase = true;
                            break;
                    }
                }
                if (edgeCase) {
                    if ((pipe.connections[0] && pipe.connections[2]) || (pipe.connections[1] && pipe.connections[3])) {   // Up and Down / Left to Right ie a straight pipe
                        
                        if (pipe.active) { pipe_div.src = "../images/straight_a.png"; }
                        else { pipe_div.src = "../images/straight.png"; }
                    } else if ((pipe.connections[0] && (pipe.connections[1] || pipe.connections[3])) ||     // Up and ( Left OR Right ) corners!
                                    (pipe.connections[2] && (pipe.connections[1] || pipe.connections[3]))) {   // Down and ( Left OR Right )

                        if (pipe.active) { pipe_div.src = "../images/corner_a.png"; }
                        else { pipe_div.src = "../images/corner.png"; }
                    } 
                }
                

                row_div.appendChild(pipe_div);
            }

            grid_div.appendChild(row_div);
        }
	}

}

function failedGame(grid) {
    document.getElementById("gameResult").style.visibility = "visible";
    if (grid.noOfAttempts > 0) {    // if the player has more chances, let them play on.
        document.getElementById("gameResultSpeech").style.color = "darkorange";
        document.getElementById("gameResultSpeech").innerHTML = "YOUR HACK FAILED.. BUT YOU HAVE ANOTHER CHANCE TO TRY AGAIN!";
        document.cookie = grid.name+"Attempts="+grid.noOfAttempts+";path=/";
        setTimeout(function() {
            window.location.replace("../minigames/pipes-minigame.html");
        }, 2000);
    }
    else {
        document.getElementById("gameResultSpeech").style.color = "red";
        document.getElementById("gameResultSpeech").innerHTML = "YOUR HACK FAILED! THE SYSTEM HAS LOCKED YOU OUT. 🔒🔒🔒"
        var musicPlayer = $("#musicPlayer").get(0);
        musicPlayer.pause();
        musicPlayer.setAttribute('src', "../music/fail.mp3");
        musicPlayer.load();
        musicPlayer.play();
        var allActions = JSON.parse(localStorage.getItem("allActions"));
        allActions.push(grid.failingObj);
        localStorage.setItem("allActions", JSON.stringify(allActions));

        setTimeout(function() {
            window.location.replace("../main.html");
        }, 2000);
        return 0;
    }
}

function checkFirstVisit() {
        if (performance.navigation.type == 1) {
            console.info( "This page is reloaded" );
            // not first visit, so alert
            alert('Refreshing is not allowed.');        // cheating!
            var allActions = JSON.parse(localStorage.getItem("allActions"));
            allActions.push(this.failingObj);   // assume fail
            localStorage.setItem("allActions", JSON.stringify(allActions));
            window.location.replace("../main.html");    // redirect back to the game
            return false;
        } 
        else {
            console.info( "This page is not reloaded");
            return true;
        }
    }

function initGame(failingObj,succeedingObj) {
    addLabelToggleEL("musicControl");
    var grid = new Grid(failingObj,succeedingObj); 
    grid.noOfAttempts--;
    if (checkFirstVisit()) {
        grid.init();
        document.getElementById("grid").gridObj = grid;
        var label = document.getElementById("gameTimerLabel");
        label.innerHTML = grid.time;
        var timer = setInterval(function () {
            if (parseInt(label.innerHTML) <= 0) {
                alert("Times up!");
                failedGame(grid);
                clearInterval(timer);
            }
            else {
                label.innerHTML = parseInt(label.innerHTML) - 1;
            }
        }, 1000);
    }
    else {
        console.info( "This page is reloaded" );
        // not first visit, so alert
        alert('Refreshing is not allowed.');        // cheating!
        var allActions = JSON.parse(localStorage.getItem("allActions"));
        allActions.push(this.failingObj);   // assume fail
        localStorage.setItem("allActions", JSON.stringify(allActions));
        window.location.replace("../main.html");    // redirect back to the game
        return false;
    }
}
function rotatePipe(element) {
    var grid = document.getElementById("grid").gridObj;
    var x = element.dataset.x;
    var y = element.dataset.y;

    grid.getPipe(x,y).rotate();
    grid.checkPipes();
    grid.draw();
}
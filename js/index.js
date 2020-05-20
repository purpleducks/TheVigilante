/*
 *  The main function - checks if its the users first time and if so, shows the info box.
 */
function main() {
    if (document.cookie.indexOf('firstTime') == -1) { // if its the first time... 
        setTimeout(animateElemsIn, 7000);
        localStorage.clear();   // clear previous save if this is the first time.
    }
    else {
        animateElemsIn();
    }
    document.getElementById("startButton").onclick = function () {
        location.href = "./main.html";
    };

    addLabelToggleEL("musicControl");
    addLabelToggleEL("showModal");
    addLabelToggleEL("deleteSave");

    var gameInfo = document.getElementById("gameInfo");
    var closeButton = document.getElementsByClassName("close")[0];

    closeButton.onclick = function() {
      gameInfo.style.display = "none";
      enableStartButton();
    }

    window.onclick = function(event) {
      if (event.target == gameInfo) {
        gameInfo.style.display = "none";
      }
    }
    if (document.cookie.indexOf('firstTime') == -1) { // if its the first time, then show the dialogue box. SOURCE: https://stackoverflow.com/a/40449074
        setTimeout(function() {
            document.getElementById('gameInfo').style.display='block';
            document.cookie = "firstTime=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
            setTimeout(enableStartButton, 2000);
        }, 8000)
    }
    else {  // else just allow them to click on the start button
        enableStartButton();
    }

}

/*
 *  Show the information modal box
 */
function showModal() {
    var gameInfo = document.getElementById("gameInfo");
    var closeButton = document.getElementsByClassName("close")[0];

    closeButton.onclick = function() {
      gameInfo.style.display = "none";
      enableStartButton();
    }

    window.onclick = function(event) {
      if (event.target == gameInfo) {
        gameInfo.style.display = "none";
      }
    } 
    document.getElementById('gameInfo').style.display='block';
}

/*
 *  Enables the start button so the user can click on it and be navigated to the game page
 */
function enableStartButton() {
    var startButton = document.getElementById("startButton");

    startButton.disabled = false;
    startButton.style.borderColor = 'rgba(246, 80, 15, 0.5)';
    startButton.style.backgroundColor = 'rgba(246, 80, 15, 0.3)';

    startButton.addEventListener('mouseenter', e => {
        startButton.style.backgroundColor = 'rgba(246, 80, 15, 1)';
        startButton.style.borderColor = '#f6500f';
        startButton.style.color = 'white';
        startButton.style.opacity = 1.0;
        event.stopPropagation();
    });

    startButton.addEventListener('mouseleave', e => {
      startButton.style.backgroundColor = 'rgba(246, 80, 15, 0.3)';
      event.stopPropagation();
    });
}

/*
 *  Animates the start button into the screen view.
 */
function animateElemsIn() {
	var button = document.getElementById("startButton");
    // var nadineImg = document.getElementById("nadineImg");
    var pos = 0;
    var id = setInterval(frame, 50);

    function frame() {
        if (pos == 20) {
            clearInterval(id);
        } else {
            pos++;
            button.style.left = pos + 'vw';
        }
    }
}

/*
 *  Checks for a saved game and if there is one, then asks the player if they want to delete their saved game.
 */
function deleteSave() {
    if (localStorage.getItem("allActions") == null) {
        alert("No save game detected!");
    }
    else if (confirm("Are you sure you want to delete your saved game?")) {
        localStorage.clear();
        alert("Save game deleted!");
    }
}

/*
 *  Handles toggling the music
 */
function playPauseMusic() {
    var musicPlayer = document.getElementById("musicPlayer");
    console.log(musicPlayer);
    console.log(musicPlayer.paused);
    if (musicPlayer.paused) {
        musicPlayer.play();
    }
    else {
        musicPlayer.pause();
    }
}

/*
 *  Add the labels to the on screen elements.
 */
function addLabelToggleEL(labelId) {
    var musicControl = document.getElementById(labelId);
    musicControl.addEventListener('mouseenter', function(){
        var labelId = this.id + "Label";
        var label = document.getElementById(labelId);
        label.style.visibility = "visible";
        event.stopPropagation();
    });
    musicControl.addEventListener('mouseleave', function(){
        var labelId = this.id + "Label";
        var label = document.getElementById(labelId);
        label.style.visibility = "hidden";
        event.stopPropagation();
    });
}

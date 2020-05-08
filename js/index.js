function main() {
    if (document.cookie.indexOf('firstTime') == -1) { // if its the first time... 
        setTimeout(animateElemsIn, 7000);
    }
    else {
        animateElemsIn();
    }
    document.getElementById("startButton").onclick = function () {
        location.href = "../page1.html";
    };

    addLabelToggleEL("musicControl");
    addLabelToggleEL("showModal");

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

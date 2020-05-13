function loadWords() {
	addLabelToggleEL("musicControl");
	if (checkFirstVisit()) {	// if this is their first visit then ....
		var client = new XMLHttpRequest();
		client.open('GET', 'assets/common-passwords.txt');
		client.onloadend = function() {
			document.getElementById("minigameLayer").words = client.responseText.split('\n');
			runGame();
		}
		client.send();
	}

}

function runGame() {
	var minigameLayer = document.getElementById("minigameLayer");
	minigameLayer.spentWords = 0;
	minigameLayer.shownWords = [];
	minigameLayer.score = 0;
	minigameLayer.gameEnded = false;
	setInterval(function() {
		var minigameLayer = document.getElementById("minigameLayer");
		console.log("SPENT WORDS: " + minigameLayer.spentWords);
		if (minigameLayer.spentWords < 70) {
			addNewWord();
			document.getElementById("minigameLayer").addEventListener('stopMakingWords', function() {
				clearInterval();
			});
		}
		else { clearInterval(); }
	}, 1000);
}

function addNewWord() {
	var minigameLayer = document.getElementById("minigameLayer");
	if (!minigameLayer.gameEnded) {
		var wordIndex = getRandomInt(0, minigameLayer.words.length);
		minigameLayer.shownWords = [];
		var tempShownWords = document.getElementsByClassName("word");
		for (var i = 0; i < tempShownWords.length; i++) {
			minigameLayer.shownWords.push(tempShownWords[i].textContent);
		}
		console.log(minigameLayer.shownWords);
		var newWordCheck = minigameLayer.shownWords.indexOf(minigameLayer.words[wordIndex]);
		// console.log(newWordCheck);
		while(newWordCheck != -1) {
			var tempShownWords = document.getElementsByClassName("word");
			minigameLayer.shownWords = [];
			for (var i = 0; i < tempShownWords.length; i++) {
				minigameLayer.shownWords.push(tempShownWords[i].textContent);
			}
			// console.log(minigameLayer.shownWords);
			wordIndex = getRandomInt(0, minigameLayer.words.length);
			newWordCheck = minigameLayer.shownWords.indexOf(minigameLayer.words[wordIndex]);
			// console.log("BLOOP");
		}
		minigameLayer.shownWords.push(minigameLayer.words[wordIndex]);
		// this.onScreenWords.push(this.words[wordIndex]);
		animateWord(wordIndex);
	}
}

/**	https://stackoverflow.com/a/1527820
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function animateWord(wordIndex) {
	var minigameLayer = document.getElementById("minigameLayer");
	var position = 0;
	var word = minigameLayer.words[wordIndex];
	$('#minigameLayer').append("<div class='word' id=word"+wordIndex+"><p>"+word+"</p></div>");
	var elem = document.getElementById("word"+wordIndex);
	var id = setInterval(frame, 50);
	elem.style.left = getRandomInt(2,90) + 'vw';
	function frame() {
		var minigameLayer = document.getElementById("minigameLayer");
		if (minigameLayer.gameEnded) {
			clearInterval();
			var stopMakingWords = new Event('stopMakingWords');
			minigameLayer.dispatchEvent(stopMakingWords);
			return 0;
		}
		if (position >= screen.height || minigameLayer.score >= 42 || minigameLayer.spentWords > 70) {
			if (minigameLayer.score >= 42 && !minigameLayer.gameEnded) {	// if the score threshold is reached / too many words have been shown
				// alert("YOU WON!");
				minigameLayer.gameEnded = true;

				document.getElementById("gameResult").style.visibility = "visible";
				document.getElementById("gameResultSpeech").innerHTML = "YOU'RE IN! 👨‍💻👩‍💻";
				document.getElementById("gameResultSpeech").style.color = "limegreen";
				var musicPlayer = $("#musicPlayer").get(0);
				musicPlayer.pause();
                musicPlayer.setAttribute('src', "./music/success.mp3");
                musicPlayer.load();
                musicPlayer.play();
				var allActions = JSON.parse(localStorage.getItem("allActions"));
				allActions.push("In bloggers profile");
				localStorage.setItem("allActions", JSON.stringify(allActions));

				clearScreen();
				clearInterval();

				setTimeout(function() {
					window.location.replace("./page1.html");
				}, 2000);
				return 0;
			}
			if (minigameLayer.spentWords > 70 && !minigameLayer.gameEnded) { // if the game is over ...
				// alert("YOU LOST!");
				minigameLayer.gameEnded = true;
				document.getElementById("gameResult").style.visibility = "visible";
				document.getElementById("gameResultSpeech").innerHTML = "YOUR HACK FAILED!";
				document.getElementById("gameResultSpeech").style.color = "red";
				var musicPlayer = $("#musicPlayer").get(0);
				musicPlayer.pause();
                musicPlayer.setAttribute('src', "./music/fail.mp3");
                musicPlayer.load();
                musicPlayer.play();
                var allActions = JSON.parse(localStorage.getItem("allActions"));
				allActions.push("Probably a scam");
				localStorage.setItem("allActions", JSON.stringify(allActions));

				clearScreen();
				clearInterval();

				window.location.replace("./page1.html");
				return 0;
			}
			if (!minigameLayer.gameEnded) { // if its not
				clearInterval(id);
				// console.log("BYEEEEE from "+elem.id);
				var wordId = elem.id.slice(4, elem.id.length);
				removeWord(wordId, false);
			}
			else {
				var stopMakingWords = new Event('stopMakingWords');
				minigameLayer.dispatchEvent(stopMakingWords);
				return 0;
			}
		} else if (!minigameLayer.gameEnded) {
			position += getRandomInt(1, 8);
			elem.style.top = position + 'px';
		} else {
			clearInterval();
			var wordId = elem.id.slice(4, elem.id.length);
			removeWord(wordId, false);
		}
	}
}

// SOURCE: https://stackoverflow.com/a/8572030
function checkFirstVisit() {
  if(document.cookie.indexOf('refreshCheck')==-1) {
    // cookie doesn't exist, create it now
    document.cookie = 'refreshCheck=1';
    return true;
  }
  else {
    // not first visit, so alert
    alert('Refreshing is not allowed.');		// cheating!
    var allActions = JSON.parse(localStorage.getItem("allActions"));
		allActions.push("Probably a scam");	// assume fail
		localStorage.setItem("allActions", JSON.stringify(allActions));
		window.location.replace("./page1.html");	// redirect back to the game
    return false;
  }
}

function checkWord() {
	var minigameLayer = document.getElementById("minigameLayer");
	var guessingValue = document.getElementById("passwordGuess").value;
	minigameLayer.shownWords = [];
	var tempShownWords = document.getElementsByClassName("word");
	for (var i = 0; i < tempShownWords.length; i++) {
		minigameLayer.shownWords.push(tempShownWords[i].textContent);
	}
	console.log(minigameLayer.shownWords);
	var correctWord = minigameLayer.shownWords.indexOf(guessingValue);
	if (correctWord != -1) {	// if the user typed in a word correctly ...
		document.getElementById("passwordGuess").value = '';
		minigameLayer.score += 2;
		document.getElementById("scoreboard").innerHTML = "SCORE: "+minigameLayer.score;
		var correctWordIndex = minigameLayer.words.indexOf(guessingValue);
		removeWord(correctWordIndex, true);
		if (minigameLayer.score == 42) {
			clearScreen();
			clearInterval();
		}
	}
}

function removeWord(id, correctAnswer) {
	var minigameLayer = document.getElementById("minigameLayer");
	var wordToRemove = minigameLayer.words[id];
	var OSWId = minigameLayer.shownWords.indexOf(wordToRemove);
	minigameLayer.shownWords.splice(OSWId, 1);	// remove only the element at index
	var elemToRemove = document.getElementById("word"+id);
	if (elemToRemove != null) {
		minigameLayer.spentWords++;
		elemToRemove.remove();
		if (!correctAnswer) {
			var gameOverProgress = document.getElementById("gameOverMeter");
			gameOverProgress.value = Math.round((minigameLayer.spentWords/70)*100);

		}
		// console.log(minigameLayer.shownWords.length);
	}
	else {
		console.log("Null element removal FAIL");
	}
}

function clearScreen() {
	var allWords = document.getElementsByClassName("word");
	while (allWords.length > 0) {
		for (var i = 0; i < allWords.length; i++) {
			allWords[i].remove();
		}
		allWords = document.getElementsByClassName("word");
	}
	console.log("byeeeeeeeeeee");

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
    });
    musicControl.addEventListener('mouseleave', function(){
        var labelId = this.id + "Label";
        var label = document.getElementById(labelId);
        label.style.visibility = "hidden";
    });
}

class DictionaryAttack extends Minigame {

	constructor(name, difficulty, failingObj, succeedingObj, winningScore) {
		super(name, difficulty);	// difficulty is on a scale of 1-3 : 1 being hard, 3 being easy
		this.words = [];
		this.shownWords = [];
		this.score = 0;
		this.spentWords = 0;
		this.failingObj = failingObj;
		this.succeedingObj = succeedingObj;
		this.gameEnded = false;
		this.winningScore = winningScore;
	}

	loadWords() {
		var that = this;
		this.addLabelToggleEL("musicControl");
		if (this.checkFirstVisit()) {	// if this is their first visit then ....
			var client = new XMLHttpRequest();
			client.open('GET', 'assets/common-passwords.txt');
			client.onloadend = function() {
				that.words = client.responseText.split('\n');
				that.runGame();
			}
			client.send();
		}
	}

	runGame() {
		var minigameLayer = document.getElementById("minigameLayer");
		var that = this;
		this.spentWords = 0;
		this.shownWords = [];
		this.score = 0;
		this.gameEnded = false;
		var difficulty = Minigame.prototype.getDifficulty.call(this);
		setInterval(function() {
			var minigameLayer = document.getElementById("minigameLayer");
			console.log("SPENT WORDS: " + this.spentWords);
			if (that.spentWords < 70) {
				that.addNewWord();
				document.getElementById("minigameLayer").addEventListener('stopMakingWords', function() {
					clearInterval();
				});
			}
			else { clearInterval(); }
		}, Math.round(1500/difficulty));
	}

	addNewWord() {
		var minigameLayer = document.getElementById("minigameLayer");
		if (!this.gameEnded) {
			var wordIndex = this.getRandomInt(0, this.words.length);
			this.shownWords = [];
			var tempShownWords = document.getElementsByClassName("word");
			for (var i = 0; i < tempShownWords.length; i++) {
				this.shownWords.push(tempShownWords[i].textContent);
			}
			console.log(this.shownWords);
			var newWordCheck = this.shownWords.indexOf(this.words[wordIndex]);
			// console.log(newWordCheck);
			while(newWordCheck != -1) {
				var tempShownWords = document.getElementsByClassName("word");
				this.shownWords = [];
				for (var i = 0; i < tempShownWords.length; i++) {
					this.shownWords.push(tempShownWords[i].textContent);
				}
				// console.log(this.shownWords);
				wordIndex = this.getRandomInt(0, this.words.length);
				newWordCheck = this.shownWords.indexOf(this.words[wordIndex]);
				// console.log("BLOOP");
			}
			this.shownWords.push(this.words[wordIndex]);
			// this.onScreenWords.push(this.words[wordIndex]);
			this.animateWord(wordIndex);
		}
	}

	/**	https://stackoverflow.com/a/1527820
	 * Returns a random integer between min (inclusive) and max (inclusive).
	 * The value is no lower than min (or the next integer greater than min
	 * if min isn't an integer) and no greater than max (or the next integer
	 * lower than max if max isn't an integer).
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	getRandomInt(min, max) {
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	animateWord(wordIndex) {
		var minigameLayer = document.getElementById("minigameLayer");
		var position = 0;
		var word = this.words[wordIndex];
		var that = this;
		var difficulty = Minigame.prototype.getDifficulty.call(this);
		$('#minigameLayer').append("<div class='word' id=word"+wordIndex+"><p>"+word+"</p></div>");
		var elem = document.getElementById("word"+wordIndex);
		var id = setInterval(frame, 20*difficulty);
		elem.style.left = this.getRandomInt(2,90) + 'vw';
		function frame() {
			var minigameLayer = document.getElementById("minigameLayer");
			if (that.gameEnded) {
				clearInterval();
				var stopMakingWords = new Event('stopMakingWords');
				minigameLayer.dispatchEvent(stopMakingWords);
				return 0;
			}
			if (position >= screen.height || that.score >= that.winningScore || that.spentWords > 70) {
				if (that.score >= that.winningScore && !that.gameEnded) {	// if the score threshold is reached / too many words have been shown
					// alert("YOU WON!");
					that.gameEnded = true;

					document.getElementById("gameResult").style.visibility = "visible";
					document.getElementById("gameResultSpeech").innerHTML = "YOU'RE IN! 👨‍💻👩‍💻";
					document.getElementById("gameResultSpeech").style.color = "limegreen";
					var musicPlayer = $("#musicPlayer").get(0);
					musicPlayer.pause();
	                musicPlayer.setAttribute('src', "./music/success.mp3");
	                musicPlayer.load();
	                musicPlayer.play();
					var allActions = JSON.parse(localStorage.getItem("allActions"));
					allActions.push(that.succeedingObj);
					localStorage.setItem("allActions", JSON.stringify(allActions));

					that.clearScreen();
					clearInterval();

					setTimeout(function() {
						window.location.replace("./main.html");
					}, 2000);
					return 0;
				}
				if (that.spentWords > 70 && !that.gameEnded) { // if the game is over ...
					// alert("YOU LOST!");
					that.gameEnded = true;
					document.getElementById("gameResult").style.visibility = "visible";
					document.getElementById("gameResultSpeech").innerHTML = "YOUR HACK FAILED!";
					document.getElementById("gameResultSpeech").style.color = "red";
					var musicPlayer = $("#musicPlayer").get(0);
					musicPlayer.pause();
	                musicPlayer.setAttribute('src', "./music/fail.mp3");
	                musicPlayer.load();
	                musicPlayer.play();
	                var allActions = JSON.parse(localStorage.getItem("allActions"));
					allActions.push(that.failingObj);
					localStorage.setItem("allActions", JSON.stringify(allActions));

					that.clearScreen();
					clearInterval();

					setTimeout(function() {
						window.location.replace("./main.html");
					}, 2000);
					return 0;
				}
				if (!that.gameEnded) { // if its not
					clearInterval(id);
					// console.log("BYEEEEE from "+elem.id);
					var wordId = elem.id.slice(4, elem.id.length);
					that.removeWord(wordId, false);
				}
				else {
					var stopMakingWords = new Event('stopMakingWords');
					minigameLayer.dispatchEvent(stopMakingWords);
					return 0;
				}
			} else if (!that.gameEnded) {
				position += that.getRandomInt(1, 8);
				elem.style.top = position + 'px';
			} else {
				clearInterval();
				var wordId = elem.id.slice(4, elem.id.length);
				that.removeWord(wordId, false);
			}
		}
	}

	checkFirstVisit() {
	  if(document.cookie.indexOf(this.name)==-1) {
	    // cookie doesn't exist, create it now
	    document.cookie = this.name+'=1';
	    return true;
	  }
	  else {
	    // not first visit, so alert
	    alert('Refreshing is not allowed.');		// cheating!
	    var allActions = JSON.parse(localStorage.getItem("allActions"));
			allActions.push(this.failingObj);	// assume fail
			localStorage.setItem("allActions", JSON.stringify(allActions));
			window.location.replace("./main.html");	// redirect back to the game
	    return false;
	  }
	}

	checkWord() {
		var minigameLayer = document.getElementById("minigameLayer");
		var guessingValue = document.getElementById("passwordGuess").value;
		this.shownWords = [];
		var tempShownWords = document.getElementsByClassName("word");
		for (var i = 0; i < tempShownWords.length; i++) {
			this.shownWords.push(tempShownWords[i].textContent);
		}
		console.log(this.shownWords);
		var correctWord = this.shownWords.indexOf(guessingValue);
		if (correctWord != -1) {	// if the user typed in a word correctly ...
			document.getElementById("passwordGuess").value = '';
			this.score += 2;
			document.getElementById("scoreboard").innerHTML = "SCORE: "+this.score;
			var correctWordIndex = this.words.indexOf(guessingValue);
			this.removeWord(correctWordIndex, true);
			if (this.score == this.winningScore) {
				this.clearScreen();
				clearInterval();
			}
		}
	}

	removeWord(id, correctAnswer) {
		var minigameLayer = document.getElementById("minigameLayer");
		var wordToRemove = this.words[id];
		var OSWId = this.shownWords.indexOf(wordToRemove);
		this.shownWords.splice(OSWId, 1);	// remove only the element at index
		var elemToRemove = document.getElementById("word"+id);
		if (elemToRemove != null) {
			this.spentWords++;
			elemToRemove.remove();
			if (!correctAnswer) {
				var gameOverProgress = document.getElementById("gameOverMeter");
				gameOverProgress.value = Math.round((this.spentWords/70)*100);

			}
			// console.log(this.shownWords.length);
		}
		else {
			console.log("Null element removal FAIL");
		}
	}

	clearScreen() {
		var allWords = document.getElementsByClassName("word");
		while (allWords.length > 0) {
			for (var i = 0; i < allWords.length; i++) {
				allWords[i].remove();
			}
			allWords = document.getElementsByClassName("word");
		}
		console.log("byeeeeeeeeeee");
	}

	playPauseMusic() {
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

	addLabelToggleEL(labelId) {
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
}

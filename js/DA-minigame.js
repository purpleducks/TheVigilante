class DictionaryAttack extends Minigame {

	constructor(name, difficulty) {
		super(name, difficulty);
		this.words = [];
		this.onScreenWords = [];
		this.shownWords = [];
		this.completedWords = 0;
		this.score = 0;
	}

	loadWords() {
		var that = this;
		var client = new XMLHttpRequest();
		client.open('GET', 'assets/common-passwords.txt');
		client.onloadend = function() {
			that.words = client.responseText.split('\n');
			that.runGame();
		}
		client.send();
    }

    runGame() {
    	var that = this;
    	setInterval(function() {
    		that.addNewWord();
    	}, 1000);
    }

	addNewWord() {
		var wordIndex = this.getRandomInt(0, this.words.length);
		var newWordCheck = this.shownWords.indexOf(this.words[wordIndex]);
		console.log(newWordCheck);
		while(newWordCheck != -1) {
			wordIndex = this.getRandomInt(0, this.words.length);
			newWordCheck = this.shownWords.indexOf(this.words[wordIndex]);
		}
		this.onScreenWords.push(this.words[wordIndex]);
		this.animateWord(wordIndex);
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
		var position = 0;
		var word = this.words[wordIndex];
		$('#minigameLayer').append("<div class='word' id=word"+wordIndex+"><p>"+word+"</p></div>");
		var elem = document.getElementById("word"+wordIndex);
		var id = setInterval(frame, 30);
		var that = this;
		elem.style.left = this.getRandomInt(2,90) + 'vw';
		function frame() {
		  if (position >= screen.height) {
		      clearInterval(id);
		      console.log("BYEEEEE from "+elem.id);
		      that.completedWords++;
		      var wordId = elem.id.slice(4, elem.id.length);
		      that.removeWord(wordId);
		    } else {
		      position += that.getRandomInt(1, 5);
		      elem.style.top = position + 'px';
		    }
		}
	}

	checkWord() {
		var guessingValue = document.getElementById("passwordGuess").value;
		var correctWord = this.onScreenWords.indexOf(guessingValue);
		if (correctWord != -1) {	// if the user typed in a word correctly ...
			document.getElementById("passwordGuess").value = '';
			this.score++;
			document.getElementById("scoreboard").innerHTML = "SCORE: "+this.score;
			var correctWordIndex = this.words.indexOf(guessingValue);
			this.removeWord(correctWordIndex);
			if (this.score == 10) { 
				alert("YAY"); 
				this.clearScreen();
				clearInterval(); 
			}
		}
	}

	removeWord(id) {
		var wordToRemove = this.words[id];
		this.shownWords.push(wordToRemove);
		var OSWId = this.onScreenWords.indexOf(wordToRemove);
		this.onScreenWords.splice(OSWId, 1);	// remove only the element at index
		var elemToRemove = document.getElementById("word"+id);
		if (elemToRemove != null) {
			elemToRemove.remove();
			console.log("Removed word"+id);
			if (this.score <= 10) { 
				this.addNewWord();
			}
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
				
	}
}

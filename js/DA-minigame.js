class DictionaryAttack extends Minigame {

	constructor(name, difficulty) {
		super(name, difficulty);
		this.words = [];
		this.completedWords = 0;
	}

	loadWords() {
		var that = this;
		var tempArr = [];
        fetch("assets/common-passwords.txt")
		.then( response => response.text() )
		.then( text => tempArr )
		do {
			if (tempArr.length > 0) {
				this.words = tempArr;
			}
		} while (tempArr.length == 0);
    }

	addNewWord() {
		var wordIndex = this.getRandomInt(0, this.words.length);
		this.completedWords++;
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
		var id = setInterval(frame, 5);

		function frame() {
		  if (position >= screen.height) {
		      clearInterval(id);
		    } else {
		      position++;
		      elem.style.top = position + 'px';
		      if ((this.completedWords % 2) == 0) {
		      	elem.style.left = position + 'px';
		      }
		      else {
		      	elem.style.right = position + 'px';
		      }
		    }
		}
	}

	checkWord() {

	}

	removeWord() {

	}



	runGame() {
		var that = this;
		console.log("YAS");
		/*
		setInterval(function() {
			if (this.completedWords == 4) { clearInterval(); }
			else {
				that.addNewWord();
			}
		}, 500);*/
	}
}

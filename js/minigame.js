class Minigame {
	constructor(name, difficulty) {
		this.name = name;
		this.difficulty = difficulty;
		this.score = 0;
	}


	getDifficulty() {
		return this.difficulty;
	}

	getScore() {
		return this.score;
	}

	setScore(score) {
		this.score = score;
		return true;
	}
}
class PlayerDataManager {
	constructor() {
		this.allActions = [];
        this.playerDecisions = [];
	}

	addToAllActions(spName) {
		this.allActions.push(spName);
		console.log("DATAMANAGER: Pushed " +spName+ " to the player log.");
	}

	addPlayerDecision(spName) {
		this.playerDecisions.push(spName);
		console.log("DATAMANAGER: Pushed " +spName+ " to the PLAYER DECISIONS.");
	}

	getLastDecision() {
		return this.playerDecisions[this.playerDecisions.length - 1];
	}

	checkForDecision(decisionName) {
		return this.playerDecisions.find(speechObj => speechObj === decisionName);
	}

	saveToStorage() {

	}

	loadFromStorage() {
		
	}
}
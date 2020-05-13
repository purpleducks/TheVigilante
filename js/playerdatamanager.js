class PlayerDataManager {
	constructor() {
		this.gameData = [];
		this.currentStage = "";
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

	getLastObject() {
		return this.allActions[this.allActions.length - 1];
	}

	checkForAction(actionName) {
		return this.allActions.find(speechObj => speechObj === actionName);
	}

	saveToStorage() {
		localStorage.setItem('allActions', JSON.stringify(this.allActions));
		localStorage.setItem('playerDecisions', JSON.stringify(this.playerDecisions));
	}

	loadFromStorage() {
		this.allActions = JSON.parse(localStorage.getItem("allActions"));
		this.playerDecisions = JSON.parse(localStorage.getItem("playerDecisions"));
		console.log("PDM - Got data from local storage");
		console.log(this.allActions);
		console.log(this.playerDecisions);
	}

	getData(jsonName) {
        var tempData = [];
        $.ajax({
            url: "assets/"+jsonName+".json",
            dataType: "json",
            data: tempData,
            async: false,
            success: function(json)
            {
                tempData = json;
                console.log("UHUHU");
            }
        });
        this.gameData = tempData[jsonName]["storylines"];
        this.currentStage = jsonName;
    }
}
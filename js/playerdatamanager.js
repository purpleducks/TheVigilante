class PlayerDataManager {
	constructor() {
		this.gameData = [];
		this.currentStage = "";
		this.allActions = [];
        this.playerDecisions = [];
        this.musicCredits = [];
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
		localStorage.setItem('currentStage', this.currentStage);
	}

	loadFromStorage() {
		this.allActions = JSON.parse(localStorage.getItem("allActions"));
		this.playerDecisions = JSON.parse(localStorage.getItem("playerDecisions"));
		this.currentStage = localStorage.getItem("currentStage");
		switch (this.currentStage) {
			case "Introduction":
				this.getData("Introduction","json");
				break;
			case "OSINT":
				this.getData("OSINT","json");
				break;
			case "BreakIn":
				this.getData("BreakIn","json");
				break;
			case "TheHack":
				this.getData("TheHack","json");
				break;
			case "TheEscape":
				this.getData("TheEscape","json");
				break;
		}
		console.log("PDM - Got data from local storage");
		console.log(this.allActions);
		console.log(this.playerDecisions);
	}

	getData(filename, filetype) {
        var tempData = [];
        var tempType = "";
        var that = this;
        
        if (filetype == "text") { tempType = "txt"}
        else if (filetype == "json") { tempType = "json"}
        $.ajax({
            url: "assets/"+filename+"."+tempType,
            dataType: filetype,
            data: tempData,
            async: false,
            success: function(json)
            {
                tempData = json;
                console.log("UHUHU");
                if (filetype == "json") {
                	console.log("PDM: Get next game data!");
		        	that.currentStage = filename;
			        that.gameData = tempData[filename]["storylines"];
		    	}
		    	else if (filename == "music-credits") {
		    		console.log(tempData);
		    		var allSongs = tempData.split(',').toString().split("\r\n");
		    		for (var i = allSongs.length - 1; i >= 0; i--) {
		    			var tempArray = allSongs[i].split(',');
		    			var song = {name:tempArray[0],artist:tempArray[1],link:tempArray[2]};
		    			console.log(song);
		    			that.musicCredits.push(song);
		    		}
		    	}
            }
        });
    }
}
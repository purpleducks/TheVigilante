
function testGameJSON(json) {
	var gameData = json.OSINT.storylines;
	console.log("IN TEST NOW");
	for (var i = 0; i < gameData.length; i++) {
		var speechObject = gameData[i];
		if (speechObject.content.length == 0) {
			console.log("no content - " + speechObject.name);
			return false;
		}
		if (speechObject.link == null || speechObject.link.length == 0 || speechObject.link == undefined) {
			console.log("link object is not defined or is empty at " + speechObject.name);
			return false;
		}
		else {
			var hasAFlag = false;
			if (speechObject.dialogue) {
				hasAFlag = true;
				var charctrsObjs = speechObject.characters;
				if (charctrsObjs == null || charctrsObjs.length == 0) {
					console.log("dialogue - character array empty - " + speechObject.name);
					return false;
				}
				for (var j = 0; j < speechObject.content.length; j++){
					console.log("in dialogue for loop");
					var firstWord = speechObject.content[j].substr(0, speechObject.content[j].indexOf(":"));
					if(charctrsObjs.find(character => character === firstWord)) {
						continue;
					}
					else {
						console.log("dialogue - content error - character name does not exist at - " + speechObject.name + " element " + j);
						console.log("OFFENDING DATA: content - '" + firstWord+ "' characterArray - '" + charctrsObjs + "'");
						return false;
					}
				}
			}
			if (speechObject.decision) {
				hasAFlag = true;
				if (speechObject.link.length <= 1) {
					console.log("decision - link elements missing for decision object at "+ speechObject.name);
					return false;
				} 
			}
			if (speechObject.systemDecision) {
				hasAFlag = true;
				for (var x = 0; x < speechObject.content; x++) {
					var currentObject = speechObject.content[x];
					if (gameMan.find(speechObj => speechObj.name === currentObject) == null) {
						console.log("systemDecision - could not find matching condition object for " + speechObject.name + " at " + x);

						return false;
					}
				}
			}
			if (speechObject.narration || speechObject.cinematic || speechObject.minigame) { 
				hasAFlag = true;
			}
			if (!hasAFlag) {
				console.log("this object is not marked with any flags - " + speechObject.name);
				return false;
			}
		}
	}
	console.log("success!");
	return true;
}

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'assets/OSINT.json', true);
    // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function() {
        if (xobj.readyState === 4 && xobj.status === 200) {
            // Required use of an anonymous callback 
            // as .open() will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function init() {
    loadJSON(function(response) {
        // Parse JSON string into object
        var actual_JSON = JSON.parse(response);
        testGameJSON(actual_JSON);
    });
}

function main() {
	init();
}
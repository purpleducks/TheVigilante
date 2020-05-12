let data;
let playerProgress;

function main() {
	/*loadJSON(function(response) {
	// Parse JSON string into object
    sceneSpeech = JSON.parse(response);
	console.log(sceneSpeech);
	}); */
	getIntro();
	runGame();
}

function getIntro()
{
	$.ajax({
			url: 'assets/Introduction.json',
			dataType: 'json',
	    data: data,
	    async: false,
			success: function(json)
			{
				data = json;
			}
		});
}

/*
	There are several flags in the JSON data, these are:
		- "decision"	- a decision the player has to make (function type)
		- "dialogue"	- dialogue which has to be displayed differently (display type)
		- "narration" - narration which is adding background or talking about actions (display type)
		- "systemDecision" - a decision the system has to make based on your past decisions (function type)
	The characters in the current scene are declared in the "characters". New characters are declared once at the start and leaving characters are declared again in their
	closing event. These names correspond to PNG images in the assets folder.
	The content is in the "content" array
*/
function runGame() {
	console.log(data["Introduction"]["storylines"]);	// debug - test that data has JSON data loaded correctly
	let startObject = data["Introduction"]["storylines"][0];		// get the start object
	startObject = data["Introduction"]["storylines"][0][Object.getOwnPropertyNames(startObject)]; // properly access the object
	console.log(startObject);
	displayTypes=[];
	functionTypes=[];
	if (startObject["decision"]) { functionTypes.push(true); } else { functionTypes.push(false); }			 // functionTypes[0]
	if (startObject["systemDecision"]) { functionTypes.push(true); } else { functionTypes.push(false); } // functionTypes[1]
	if (startObject["narration"]) { displayTypes.push(true); } else { displayTypes.push(false); }	// displayTypes[0]
	if (startObject["dialogue"]) { displayTypes.push(true); } else { displayTypes.push(false); }	// displayTypes[1]

	displaySpeech(startObject["content"], displayTypes, functionTypes);
}

 function displaySpeech(textArr, displayTypes, functionTypes) {
	let characterSwitch=false;
	console.log("WY");
	for (let speechIndex = 0; speechIndex < textArr.length; speechIndex++) {
		console.log("HEY");
		let textTyper = setInterval(typeWriter(textArr[speechIndex], displayTypes), 7500);
		// await typeWriter(textArr[speechIndex], displayTypes);
	}

}

 function typeWriter(txt, displayTypes){
	let speechID;
	let speechElement;
	console.log(displayTypes);
	if (displayTypes[0]) {	// if its narration
		$('#gameContainer').append("<div id='narration'><div class='chatWindowBG'></div><div class='chatWindowFG'><p id='narrSpeech'></p></div></div>");	// insert chat window
		speechID = 'narrSpeech';
		speechElement = 'narration';
	}
	if (displayTypes[1]) {	// if its dialogue
		if (characterSwitch) {
			$('#gameContainer').append("<div id='characterOne'><div class='chatWindowBG'></div><div class='chatWindowFG'><p id='charOneSpeech'></p></div></div>");	// insert chat window
			characterSwitch=true;
			speechID = 'charOneSpeech';
			speechElement = 'characterOne';
		}
		else {
			$('#gameContainer').append("<div id='characterTwo'><div class='chatWindowBG'></div><div class='chatWindowFG'><p id='charTwoSpeech'></p></div></div>");	// insert chat window
			speechID = 'charTwoSpeech';
			speechElement = 'characterTwo';
		}
	}
	console.log(txt.length);
	for (var i = 0; i < txt.length; i++) {
		console.log("yey");
		setTimeout(function() {
			document.getElementById(speechID).innerHTML += txt.charAt(i);
			i++;
		}
		, 1000);
	}
	console.log(speechElement);
	/*
	let currentSpeech = document.getElementById(speechElement);
	currentSpeech.remove();*/
	return;
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function saveGame() {
  // TODO: implement the save game feature - saves the storyline chosen by the player
}

function clearSaveGame() {
  // TODO: clear save game from HTML5 LocalStorage
}

function loadGame() {
  // TODO: implement the load game feature - saved games should be stored in the HTML5 LocalStorage
}

function loadJSON(callback) {	// loads the Intro JSON
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'assets/Introduction.json', true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
 }

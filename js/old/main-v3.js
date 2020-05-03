
function getIntro(introData) {
    $.ajax({
        url: "assets/Introduction.json",
        dataType: "json",
        data: introData,
        async: false,
        success: function(json)
        {
            introData = json;
        }
    });
    return introData;
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
function runGame(introData) {
	console.log(introData["Introduction"]["storylines"]);	// debug - test that introdata has JSON data loaded correctly
	var startObject = introData["Introduction"]["storylines"][0];		// get the start object
	startObject = introData["Introduction"]["storylines"][0][Object.getOwnPropertyNames(startObject)]; // properly access the object
	console.log(startObject["characters"]);
	var displayTypes=[];
	var functionTypes=[];
	if (startObject["decision"]) { functionTypes.push(true); } else { functionTypes.push(false); }			 // functionTypes[0]
	if (startObject["systemDecision"]) { functionTypes.push(true); } else { functionTypes.push(false); } // functionTypes[1]
	if (startObject["narration"]) { displayTypes.push(true); } else { displayTypes.push(false); }	// displayTypes[0]
	if (startObject["dialogue"]) { displayTypes.push(true); } else { displayTypes.push(false); }	// displayTypes[1]

	sortSpeech(startObject, displayTypes, functionTypes);
}
/*
 function sortSpeech(textArr, displayTypes, functionTypes) {

     if (displayTypes[0]) {	// if its narration
         $('#gameContainer').append("<div id='narration'><div class='chatWindowBG'></div><div class='chatWindowFG'><p id='narrSpeech'></p></div></div>");	// insert chat window
         speechID = 'narrSpeech';
         speechElement = 'narration';
     }
     if (displayTypes[1]) {	// if its dialogue
         for (var i =0; i < textArr.length; i++)	// seperate
         {
             
         }
         var characterSwitch=false
         if (characterSwitch) {	// character one
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

     var narrationTypey;
     var charOneTypey;
     var charTwoTypey;
     if (displayTypes[0])
     {
         narrationTypey = new Typewriter('#'+speechID, {
				delay: 65,
				deleteSpeed: 5
			});
     }
     else if (displayTypes[1]) {
         charOneTypey = new Typewriter('#'+speechID, {
				delay: 65,
				deleteSpeed: 5
			});
         charTwoTypey = new Typewriter('#'+speechID, {
             delay: 65,
             deleteSpeed: 5
         });
     }
     for (var textIndex = 0; textIndex < textArr.length;textIndex++)
     {
         if (narrationTypey != undefined)	// if its a narration
         {
             narrationTypey.typeString(textArr[textIndex]).pauseFor(1500).deleteAll().start();
         } else {	// else it must be dialogue
         
         }
     }
     var currentSpeech = document.getElementById(speechElement);
     currentSpeech.remove();

}*/

function typeWriterManager(index, speech, dialogueFlag, firstTW, secondTW) {
    if (dialogueFlag) {
        if (speech[index].character == 0) {   // character 1
        firstTW.typeString(speech[index].dialogue)
            .callFunction(typeWriterManager(i))
            .pauseFor(1500)
            .start()    // print the given text
        }
        else {  // character 2
            secondTW.typeString(speech[index].dialogue)
                .callFunction(typeWriterManager(index)) // send the current location when complete
                .pauseFor(1500)
                .start()    // print the given text
        }
    }
    else {  // narration
        console.log(speech)
        const oneTW = new Typewriter(firstTW, {
            strings: speech,
            loop: false,
            deleteSpeed: 15
        });
        oneTW.callFunction(deleteNarrElement).pauseFor(1000).start()
        console.log(oneTW)
    }
}

function deleteNarrElement() {
    console.log("BYE")
    var currentSpeech = document.getElementById("narration")
    currentSpeech.remove()
}

function twController(textArr, dialogue, callback) {
    if (dialogue) { // if it's dialogue ...
        var charOne = null;
        var charTwo = null;
        if (document.getElementById("characterOne") != null) {
            charOne = new Typewriter('#charOneSpeech', {
                loop: false
            });
        }
        if (document.getElementById("characterOne") != null) {
            charTwo = new Typewriter('#charTwoSpeech', {
                loop: false
            }); 
        }
        callback(0, textArr, true, '#charOneSpeech', '#charTwoSpeech')
    } else {    // if it's narration
        $('#gameContainer').append("<div id='narration'><div class='chatWindowBG'></div><div class='chatWindowFG'><p id='narrSpeech'></p></div></div>");	// insert chat window
        var narration = new Typewriter('#narrSpeech', {
            loop: false
        });
        callback(0, textArr, false, '#narrSpeech', null)
    }
}

function sortSpeech(startObject, displayTypes, functionTypes) {
    var objSpeechArr = startObject["content"]
    var characters = startObject["characters"]
    var newSpeechArr = []
    
    if (displayTypes[1]) {  // if its dialogue, sort the speech between characters
        for (var i = 0; i < objSpeechArr.length; i++) { // for all speech
            var currentString = objSpeechArr[i]
            if(currentString.includes(characters[0])) { // if the string is Character 1 dialogue
                newSpeechArr.push({dialogue:currentString, character:0})
            }
            else {  // else it must be character 2 dialogue
                newSpeechArr.push({dialogue:currentString, character:1})
            }
        }   
        for (var i = 0; i < newSpeechArr.length; i++) {     // for all speech
            if (newSpeechArr[0].character == 0 && document.getElementById("characterOne") == null) {   // if the speech is character 1 and the element doesn't already exist 
                $('#gameContainer').append("<div id='characterOne'><div class='chatWindowBG'></div><div class='chatWindowFG'><p id='charOneSpeech'></p></div></div>");  // insert character 1 speech window 
            }
            if (newSpeechArr[0].character == 1 && document.getElementById("characterTwo") == null) {
                $('#gameContainer').append("<div id='characterTwo'><div class='chatWindowBG'></div><div class='chatWindowFG'><p id='charTwoSpeech'></p></div></div>");	// insert character 2 speech window
            }
            twController(newSpeechArr[i], true, typeWriterManager)
        }
        
        twController(newSpeechArr, true, typeWriterManager)
        var charOneSpeech = document.getElementById("characterOne")
        charOneSpeech.remove()
        var charTwoSpeech = document.getElementById("characterTwo")
        charTwoSpeech.remove()
        
    } else {    // if its narration, continue as normal...
        twController(objSpeechArr, false, typeWriterManager)
    }
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

function main() {
	/*loadJSON(function(response) {
	// Parse JSON string into object
    sceneSpeech = JSON.parse(response);
	console.log(sceneSpeech);
	}); */
    var introData={};
    var playerData={};
    gameContainer.style.backgroundImage="url(assets/office-bg.png)"
	introData = getIntro(introData);
	runGame(introData);
    
}
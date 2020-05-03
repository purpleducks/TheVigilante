function main() {
	
}

async function displaySpeech(textArr, displayTypes, functionTypes) {
	let characterSwitch=false;
	console.log("WY");
	let speechIndex = 0;
	while (speechIndex < textArr.length) {
		console.log("HEY");
		await typeWriter(textArr[speechIndex], displayTypes);
		speechIndex++;
	}

}

async function typeWriter(txt, displayTypes){
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

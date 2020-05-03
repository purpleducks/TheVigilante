class GameManager {    // singleton class?
    
    constructor() {
        this.introData = []
        this.playerData = [];
    }
    
    loadGame() {
        // load the player's game from the HTML5 LocalStorage    
    }
    
    saveGame() {
        // save the player's game into the HTML5 LocalStorage
    }
    
    getIntro() {
        var tempData = [];
        $.ajax({
            url: "assets/Introduction.json",
            dataType: "json",
            data: tempData,
            async: false,
            success: function(json)
            {
                tempData = json;
            }
        });
        this.introData = tempData;
    }
    
    
    
    sortSpeech(currentObject, displayTypes, cfIndex) {
        var objSpeechArr = currentObject["content"];
        var characters = currentObject["characters"];
        var charctrsObjs = [];
        var conversationFlow = [];  // keeps track on who is speaking when 
        
        if (currentObject.cinematic) {
            var cinematicObj = new Character("cinematic","","");
            cinematicObj.speech = objSpeechArr;
            cinematicObj.img = currentObject["images"]; // save the images array in this object's field 
            console.log(cinematicObj.startCinematic(0));
        }
        else {
            if (displayTypes[0]) {  // user decision

            } else if (displayTypes[1]) {   // system decision


            } else if (displayTypes[2]) {    // if its narration, continue as normal...
                var narrationObj = new Character("narrator", null, 'T') // position is set to the top
                narrationObj.speech = objSpeechArr;
                var spIndex = 1;
                narrationObj.talk(this, currentObject, displayTypes, cfIndex); 

            } else if (displayTypes[3]) {  // if its dialogue, sort the speech between characters

                if (cfIndex == 0) { // IF ITS THE FIRST RUN -----
                    // sort characters and assets
                    for (var i = 0; i < characters.length; i++) {   
                        var side = '';
                        if (i == 0) { side = 'L'; }
                        else { side = 'R'; }
                        charctrsObjs.push(new Character(characters[i], "images/"+characters[i]+".png", side));  // makes a new character object and saves it in an array
                    }

                    // ---- sorts the speech between characters ---------

                    for (var j = 0; j < objSpeechArr.length; j++) { 
                        var currentString = objSpeechArr[j]
                        if(currentString.includes(charctrsObjs[0].name)) { // if the string is Character 1 dialogue
                            charctrsObjs[0].loadSpeech(objSpeechArr[j]);   // add the bit of dialogue to the character's array and store it's place in the flow of the conversation
                            conversationFlow.push(0);   
                        }
                        else {  // else it must be character 2 dialogue
                            charctrsObjs[1].loadSpeech(objSpeechArr[j]); // likewise as previous
                            conversationFlow.push(1);   
                        } 
                    }
                    currentObject.charctrsObjs = charctrsObjs;
                    currentObject.conversationFlow = conversationFlow;
                }
                

                //if ((cfIndex == 0) || (conversationFlow[cfIndex-1] == 0 && charctrsObjs[0].typer.is('completed')) || (conversationFlow[cfIndex-1] == 1 && charctrsObjs[1].typer.is('completed'))) {
                    if (currentObject.conversationFlow[cfIndex] == 0) {
                        currentObject.charctrsObjs[0].talk(this, currentObject, displayTypes, cfIndex);

                    }
                    if (currentObject.conversationFlow[cfIndex] == 1) {
                        currentObject.charctrsObjs[1].talk(this, currentObject, displayTypes, cfIndex);
                    } 
                //}
                /*
                while (cfIndex < conversationFlow.length) { // for displaying each character's speech
                    if ((cfIndex == 0) || (conversationFlow[cfIndex-1] == 0 && charctrsObjs[0].typer.is('completed')) || (conversationFlow[cfIndex-1] == 1 && charctrsObjs[1].typer.is('completed'))) {
                        // if the last character's speech is finished then continue with the next character - special case for the first run 
                        if (conversationFlow[cfIndex] == 0) {
                            charctrsObjs[0].talk();
                        }
                        else if (conversationFlow[cfIndex] == 1) {
                            charctrsObjs[1].talk();
                        }
                        cfIndex++;
                    }
                    else {
                        continue;
                    }
                }*/
            } 
        }
    }
}
class GameManager {    // singleton class?
    
    constructor() {
        this.introData = []
        this.allActions = [];
        this.playerDecisions = [];
        this.dataManager = new PlayerDataManager();
        this.soIndex = 0;
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
                console.log("UHUHU");
            }
        });
        this.introData = tempData;
    }
    
    incrementSOIndex() {
        this.soIndex++;
        return 0;
    }

    processSpeech(currentObject) {
        if (currentObject.content.length == 0) {
            var gameContainer = document.getElementById("gameContainer");
            gameContainer.currObj = currentObject;
            gameContainer.gameMan = this;
            var event = new Event("nextObject");
            gameContainer.dispatchEvent(event);
        }
        else {
            console.log("GAME: Current object being PROCESSED: " + currentObject.name);
            if (currentObject.dialogue) {
                if (currentObject.conversationFlow[this.soIndex] == 0) {
                    currentObject.charctrsObjs[0].talk(this.soIndex);
                }
                if (currentObject.conversationFlow[this.soIndex] == 1) {
                    currentObject.charctrsObjs[1].talk(this.soIndex);
                }
            }
            /*if (currentObject.narration) {
                currentObject.charctrsObjs[0].talk(this.soIndex); 
            }*/
            if (currentObject.narration) {
                currentObject.charctrsObjs[0].startNarration(this.soIndex);
            }
            if (currentObject.systemDecision) {
                if (this.checkSDCondition()) {
                    this.dataManager.addPlayerDecision(currentObject.link[0]);
                }
                else {
                    this.dataManager.addPlayerDecision(currentObject.link[1]);
                }
                // currentObject.content.shift();
                var gameContainer = document.getElementById("gameContainer");
                var event = new Event("getDecisionObj");
                gameContainer.dispatchEvent(event);
            }
        }
    }
    
    sortSpeech(currentObject) {
        var objSpeechArr = currentObject["content"];
        var characters = currentObject["characters"];
        var charctrsObjs = [];
        var conversationFlow = [];  // keeps track on who is speaking when 
        
        this.musicCheck();
        this.soIndex = 0;

        console.log("GAME: Current object being SORTED: " + currentObject.name);
        if (currentObject.narration) {
            charctrsObjs.push(new Narration("narration","",""));
            currentObject.charctrsObjs = charctrsObjs;
            currentObject.charctrsObjs[0].speech = objSpeechArr;
            currentObject.charctrsObjs[0].img = currentObject["images"]; // save the images array in this object's field 
            currentObject.charctrsObjs[0].startNarration();
        }
        else {
            if (currentObject["decision"]) {  // user decision
                console.log("User needs to make a decision.");
                charctrsObjs.push(new Character("decision", null, 'D'));
                currentObject.charctrsObjs = charctrsObjs;
                currentObject.charctrsObjs[0].speech = objSpeechArr;
                currentObject.charctrsObjs[0].talk();

            } else if (currentObject["systemDecision"]) {   // system decision TODO
                console.log("System needs to make a decision.");
                var sdCondition = this.checkSDCondition();
                console.log("GAME: SDCondition value is: "+sdCondition);
                if (sdCondition) {
                    this.dataManager.addPlayerDecision(currentObject.link[0]);
                }
                else {
                    this.dataManager.addPlayerDecision(currentObject.link[1]);
                }
                var gameContainer = document.getElementById("gameContainer");
                var event = new Event("getDecisionObj");
                gameContainer.dispatchEvent(event);

            }
            else if (currentObject["dialogue"]) {  // if its dialogue, sort the speech between characters

                if (this.soIndex == 0) { // IF ITS THE FIRST RUN -----
                    // sort characters and assets
                    var whereIsMain = 'L';
                    var altCharacter = 'R';
                    /*
                    if (currentObject.texting) { 
                        whereIsMain = 'R'; 
                        altCharacter = 'L'; 
                    }*/
                    for (var i = 0; i < characters.length; i++) {   
                        var side = '';
                        if (i == 0) { side = whereIsMain; }
                        else { side = altCharacter; }
                        /*
                        if (currentObject["texting"]) { charctrsObjs.push(new Texting(characters[i], "images/"+characters[i]+".png", side)); }  // makes a new character object and saves it in an array
                        else { charctrsObjs.push(new Character(characters[i], "images/"+characters[i]+".png", side)); }     TODO: fix texting / remove it at some point
                        */   
                        charctrsObjs.push(new Character(characters[i], "images/"+characters[i]+".png", side));
                    }

                    // ---- sorts the speech between characters ---------

                    for (var j = 0; j < objSpeechArr.length; j++) { 
                        var currentString = objSpeechArr[j];
                        var firstWord = currentString.substr(0, currentString.indexOf(" "));
                        if(firstWord === (charctrsObjs[0].name+":")) { // if the string is Character 1 dialogue
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

                this.processSpeech(currentObject); // start displaying the speech on screen

            } else if (currentObject["minigame"]) {  // TODO
                // -------- Minigames --------
                console.log("GAME: Loading the minigame.");
            }
        }
    }

    checkSDCondition() {
        var currentObject = document.getElementById("gameContainer").currObj;
        if (currentObject.systemDecision) {
            for (var i = 0; i < currentObject.content.length; i++) {
                if (this.dataManager.checkForDecision(currentObject.content[i]) === undefined) {    // if the condition does not exist, then return false
                    return false;
                }
            }   
            return true;    // else return true
        }
        return false;
    }

    /**
     *  @TODO: Fix the audio fade in and out!
     */
    musicCheck() {
        var currentObject = document.getElementById("gameContainer").currObj;
        var musicPlayer = $("#musicPlayer").get(0);
        var gettingSongTitle = musicPlayer.currentSrc.split("/");
        var currentSong = gettingSongTitle[gettingSongTitle.length - 1];
        if (currentObject.music != currentSong) {     // if the music string isn't set, continue playing the current track!
            console.log("GAME: Changing the track to " + currentObject.music + "!");
            /*
            setInterval(function() {
                musicPlayer.volume -= 0.1;
                if (musicPlayer.volume == 0) {  
                    clearInterval();
                    setTimeout(function() {
                        musicPlayer.pause();
                        musicPlayer.setAttribute('src', "./music/" + currentObject.music);
                        musicPlayer.load();
                        musicPlayer.volume = 1;
                        musicPlayer.play();
                    }, 2000);
                }
            }, 50)*/
            // musicPlayer.animate({volume: 0}, 3000);
            // setTimeout(function() {
                musicPlayer.pause();
                musicPlayer.setAttribute('src', "./music/" + currentObject.music);
                musicPlayer.load();
                // musicPlayer.volume = 1;
                musicPlayer.play();
            // }, 3500);
            
        }
        else {
            console.log("GAME: Continuing playing this track: " +currentSong+ "!");
        }
    }
}
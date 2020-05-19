class Character {   // factory class
    constructor(name, img, side) {
        this.name = name;
        this.img = img;
        this.side = side;
        this.speech = [];
        this.typer = null;
    }

    talk() {
        var gameMan = document.getElementById("gameContainer").gameMan;
        var currentObject = document.getElementById("gameContainer").currObj;
        var charElem = document.getElementById(this.name);
        var currentString;
        var justTheSpeech;
        var that = this;
        var maxTime;
        var idealSpeed;

        if (charElem != null) {   // if the element exists, then delete it and make a new one
            charElem.remove();
        }
        
        this.backgroundImgCheck(currentObject);
        // if (cfIndex == 0) { this.musicCheck(currentObject); }   // only run the first time
        this.enterScene(); // draw the character and their speech box

        document.getElementById(this.name).addEventListener("remove", function(event){  // event 'remove' declaration
            //$(this).remove();
            document.getElementById("gameContainer").gameMan.incrementSOIndex();
            var currObj = document.getElementById("gameContainer").currObj;
            gameMan.processSpeech(currObj);

            // Stop the event from bubbling up the DOM tree.
            event.stopPropagation();
        });
        
        if (currentObject.decision) { 
            this.makeDecisionButtons(gameMan); 
        }
        if (currentObject.decision || currentObject.persistent) {
            currentString = currentObject.content[0];
        }
        else {
            currentString = currentObject.content.shift();
        }

        if (currentObject.dialogue || currentObject.narration) {
            justTheSpeech = currentString.split(this.name+": '")[1];
            justTheSpeech = justTheSpeech.slice(0, (justTheSpeech.length - 1));
        }
        else {
            justTheSpeech = currentString;
        }

        if (!currentObject.minigame) {  // we want the player to read the minigame notes before playing!
            if (justTheSpeech.length <= 50) { maxTime = 1500; }     // variable typing speed based on the length of the speech string
            else if (justTheSpeech.length <= 100) { maxTime = 3500; }
            else if (justTheSpeech.length <= 150) { maxTime = 7500; }
            else if (justTheSpeech.length <= 200) { maxTime = 8500; }
            else { maxTime = 9500; }
            idealSpeed = Math.round(maxTime / justTheSpeech.length);
        }
        else {
            idealSpeed = 70;

        }
        console.log("Character: current string length is "+currentString.length+" ideal speed is "+ idealSpeed);

        console.log("CHARACTER: Sending this to screen: " +justTheSpeech);
        this.typer = new TypeIt("#"+this.name+"Speech", {
            strings: justTheSpeech,
            speed: idealSpeed,
            breakLines: false,
            lifeLike: true,
            nextStringDelay: [4000,500],
            afterComplete: async (step, instance) => {
                console.log("CHARACTER: Finished typing! Leaving the scene..."); 
                if (currentObject.decision) { this.showDecisionButtons(); }
                else if (currentObject.minigame) { 
                    this.typer.destroy(); 
                    localStorage.setItem("currentObject", JSON.stringify(currentObject));
                    setTimeout(window.location.replace("./minigames/"+currentObject["minigame-link"]), 2000);
                }
                else { // decisions and minigames don't need to get the next speech
                    console.log("CHARACTER: Let's get the next thing.");
                    this.typer.destroy();
                    that.getNextSpeech();  // once the character has stopped talking, leave the scene.
                }
            }
        })
        .go();
        
    }

    backgroundImgCheck(currentObject) {
        var soIndex = document.getElementById("gameContainer").gameMan.soIndex;
        if (currentObject.narration || currentObject.decision || currentObject.minigame) {
            var bgURL = "url('./images/"+currentObject.images[soIndex]+"')";
            document.getElementById("gameContainer").style.backgroundImage = bgURL; // change the background image
        }
    }

    /*

    This subroutine calls an event called remove which removes the element and calls the game manager sort speech function again

    */
    getNextSpeech() {
        // make your character leave the scene
        var tempName = "textingContainer";
        var textingView = document.getElementById(tempName);
        var delay = 3000;   // for dialogue and narration

        if (textingView == null) {   // if the texting view doesn't exist then, set the name to the character name
            tempName = this.name;
        }
        if (this.name == "narration") { delay = 750; }
        setTimeout(function() {
            var currentSpeech = document.getElementById(tempName);
            console.log("CHARACTER: Removing "+currentSpeech.id+" element.");
            var event = new Event('remove');
            currentSpeech.dispatchEvent(event)
        }, delay, tempName);
        
    }
    
    enterScene() {
        //make your character image on screen
        if (this.side == "L") {
            $('#gameContainer').append("<div id='"+this.name+"' class='characterSpeech midLeft'><div class='chatWindowBG'></div><div class='chatWindowFG'><p id='"+ this.name+"Speech'></p></div></div>");    // insert chat window
            if (!this.checkForCharacterImg()) { $('#gameContainer').append("<img src="+this.img+" class='bottomLeft characterImg'>"); }
        } else if (this.side == "R") {
            $('#gameContainer').append("<div id='"+this.name+"' class='characterSpeech topRight'><div class='chatWindowBG'></div><div class='chatWindowFG'><p id='"+ this.name+"Speech'></p></div></div>");    // insert chat window
            if (!this.checkForCharacterImg()) { $('#gameContainer').append("<img src="+this.img+" class='bottomRight characterImg'>"); }
        } else {
            $('#gameContainer').append("<div id='"+this.name+"' class='misc'><div class='chatWindowBG'></div><div class='chatWindowFG'><p id='"+ this.name+"Speech'></p></div></div>");    // insert chat window
        }
    }

    checkForCharacterImg() {
        var characterImgs = document.getElementsByClassName("characterImg");

        for (var i = 0; i < characterImgs.length; i++) {
            var tempImgArray = characterImgs[i].src.split("/");
            var currentCharacterImg = tempImgArray[tempImgArray.length - 1];
            if (currentCharacterImg == this.img) {
                return true;    
            }
        }
        if (characterImgs.length == 0) {    // no images so it doesnt exist
            console.log("CHARACTER: No images to look through, so go make your image bucko!");
            return false;
        }
        return false;   // doesn't exist among the ones that are there
    }
    
    /**
     * A setter for this.speech property
     * 
     */
    loadSpeech(currentSpeech) {
        // load the speech into the character object
        this.speech.push(currentSpeech);
    }
    
    showDecisionButtons() {
        console.log("CHARACTER: Showing the decision buttons.");
        document.getElementById("buttonContainer").style.visibility = "visible";
    }

    makeDecisionButtons() {
        var gameMan = document.getElementById("gameContainer").gameMan;
        var noOfDecisions = this.speech.length;
        $('#gameContainer').append("<div id='buttonContainer' class='row'>");
        $("#buttonContainer").append("<div id='rowOne' class='col-sm-12'>");
        var firstRow = true;
        for (var i = 1; i < noOfDecisions; i++) {
            var elemId = "";
            if (firstRow) { elemId = "#rowOne"; } 
            else { elemId = "#rowTwo"; }
            if ((i-1)%2 == 1) {
                $(elemId).append("<div><button id='"+(i-1)+"' class='btn btn-primary'>"+this.speech[i]+"</button></div>");
                $("#buttonContainer").append("<div id='rowTwo' class='col-sm-12'>"); // open the next row of buttons
                firstRow = false;
            }
            else {
                $(elemId).append("<div class='pull-left'><button id='"+(i-1)+"' class='btn btn-primary'>"+this.speech[i]+"</button></div>");
            }

            document.getElementById((i-1)).addEventListener('click', this.processDecision, true);
        }
        $('#gameContainer').append("</div>"); // closing DIV tag for all of the buttons
    }

    processDecision(evt) {
        var gameContainer = document.getElementById("gameContainer");
        var gameMan = gameContainer.gameMan;
        var currObjIndex = gameMan.dataManager.gameData.findIndex(speechObj => speechObj.name === gameContainer.currObj.name);
        var linkObjIndex = evt.currentTarget.id;
        var linkObjName = gameMan.dataManager.gameData[currObjIndex].link[linkObjIndex];
        // gameMan.playerDecisions.push(linkObjName);
        gameMan.dataManager.addPlayerDecision(linkObjName);

        var gameContainer = document.getElementById("gameContainer");
        var event = new Event("getDecisionObj");
        gameContainer.dispatchEvent(event);
    }
}

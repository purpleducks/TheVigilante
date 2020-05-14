
/**
 * the Game Loop: Runs the game for the first time and sets the two key Event Listeners
 * @param {GameManager} gameMan the Game Manager object used to access the different UI elements.
 */
function runGame(stageChange) {
    var gameMan = document.getElementById("gameContainer").gameMan;
	console.log(gameMan.dataManager.gameData);	// debug - test that data has JSON data loaded correctly
    if (gameMan.dataManager.currentStage == "Introduction") {
        
        document.getElementById("gameContainer").addEventListener("getDecisionObj", getDecisionObj, true);

        document.getElementById("gameContainer").addEventListener("nextObject", processNextObj, true);

        // document.getElementById("gameContainer").addEventListener("startTexting", startProcessing, true);    TODO: fix texting / remove it at some point        
    }

    if (stageChange) { saveToStorage(); }

    // gameMan.dataManager.gameData = gameMan.dataManager.gameData["Introduction"]["storylines"];
    if (localStorage.allActions != null && localStorage.playerDecisions != null && !stageChange) {
        console.log("MAIN: Loading from LocalStorage, getting last Speech Object from AllActions array");
        gameMan.dataManager.loadFromStorage();
        var lastObjName = gameMan.dataManager.getLastObject();
        var lastObject = gameMan.dataManager.gameData.find(speechObj => speechObj.name === lastObjName);
        console.log(lastObject);
        document.getElementById("gameContainer").currObj = lastObject;
        gameMan.sortSpeech(lastObject);
    }
    else {
        var firstObject = gameMan.dataManager.gameData[0];       // get the start object
        console.log(firstObject);
        // gameMan.allActions.push(firstObject.name);
        gameMan.dataManager.addToAllActions(firstObject.name);
        document.getElementById("gameContainer").currObj = firstObject;
        gameMan.sortSpeech(firstObject);   // only for the first time
    }
}

/**
 * Gets the next linking object from the current object and sends it off to be delivered on screen.
 * @param {Event} evt allows us to access the game manager and current object
 */
function processNextObj(evt) {    
    console.log("MAIN: Getting the next object.");
    var gameMan = evt.currentTarget.gameMan;
    var currObj = evt.currentTarget.currObj;
    removeAllElements();
    var nextObject = gameMan.dataManager.gameData.find(speechObj => speechObj.name === currObj.link[0]);
    console.log("MAIN: The next object is: " +nextObject.name);
    // checkForTextingView(nextObject);     TODO: fix texting / remove it at some point
    startProcessing(gameMan, nextObject);
    if (evt instanceof Event) { evt.stopPropagation(); }
}

/**
 * Processes the decision made by the player and delivers it on screen.
 * @param {Event} evt allows us to access the game manager and current object
 */
function getDecisionObj(evt) {
    console.log("MAIN: Getting the next Decision object!");
    var gameMan = evt.currentTarget.gameMan;
    var linkObjName = gameMan.dataManager.getLastDecision();
    var linkObj = gameMan.dataManager.gameData.find(speechObj => speechObj.name === linkObjName);
    console.log("MAIN: Player chose: " +linkObjName);
    removeAllElements();
    // checkForTextingView(linkObj);        TODO: fix texting / remove it at some point
    startProcessing(gameMan, linkObj);
    if (evt instanceof Event) { evt.stopPropagation(); }
}


function startProcessing(evt, nextObject) {
    var gameMan;
    var currObj;
    if (evt instanceof Event) { // sent from the showTextView subroutine
        gameMan = evt.currentTarget.gameMan;
        var lastObj = evt.currentTarget.currObj;
        currObj = gameMan.dataManager.gameData.find(speechObj => speechObj.name === lastObj.link[0]);
    }
    else {  // sent from the two main event handlers
        gameMan = evt;
        currObj = nextObject;
    }
    // var nextObject = gameMan.dataManager.gameData.find(speechObj => speechObj.name === currObj.link[0]);
    if (currObj.name != "FINISH") {
         document.getElementById("gameContainer").currObj = currObj;
        // evt.currentTarget.currObj = nextObject;
        // gameMan.allActions.push(nextObject.name);
        console.log("MAIN: We processing the object called: "+ currObj.name);
        gameMan.dataManager.addToAllActions(currObj.name);
        gameMan.sortSpeech(currObj, 0);
    }
    else {
        if (gameMan.dataManager.currentStage == "Introduction") {
            gameMan.dataManager.getData("OSINT","json");
        }
        else if (gameMan.dataManager.currentStage == "OSINT") {
            gameMan.dataManager.getData("BreakIn","json");
        }
        else if (gameMan.dataManager.currentStage == "BreakIn") {
            gameMan.dataManager.getData("TheHack","json");
        }
        else if (gameMan.dataManager.currentStage == "TheHack") {
            gameMan.dataManager.getData("TheEscape","json");
        }
        else {
            alert("GAME OVER!");
        }
        if (!(gameMan.dataManager.currentStage === undefined)) {
            removeAllElements();
            runGame(true);
        }
    }
   
    if (evt instanceof Event) { evt.stopPropagation(); }
}

/**
 * Checks if the next object is part of a texting dialogue, if it is and the texting view isn't visible already 
 * then it will create it, otherwise, it will remove it if the next object is not a texting dialogue.
 * In addition to this, it processes other speech and redirects it to the startProcessing function
 * @param {Object} nextObject the next speech object to be processed
 */
function checkForTextingView(nextObject) {
    var gameMan = document.getElementById("gameContainer").gameMan;
    var textingView = document.getElementById("texting-view");

    if (nextObject.texting) {        // if we are texting ... 
        if (textingView == null) {   // if this is the first texting object ... 
            console.log($("#gameContainer").append("<div id='textingContainer'></div>"));
            showTextView();  // create the texting area and alter some Game elements for better visibility
        }
        else {  // else if we're texting and the texting window exists, start texting!
            startProcessing(gameMan, nextObject); 
        }
    }
    else {  // NOT a texting conversation
        if (textingView != null) {  // else if the texting conversation is over
            removeTextingView();    // remove the texting view
        }
        startProcessing(gameMan, nextObject);
    }
}

/**
 * Removes all game UI elements on screen
 */
function removeAllElements() {
    var checkCharacters = document.getElementsByClassName("characterSpeech");
    var checkCharImgs = document.getElementsByClassName("characterImg");
    var otherElems = document.getElementsByClassName("misc");
    var buttons = document.getElementById("buttonContainer");
    var charElemLen = checkCharacters.length;
    var charElemImgLen = checkCharImgs.length;
    var otherElemLen = otherElems.length;

    if (buttons !=null) { buttons.remove(); }
    for (var i = 0; i < charElemLen; i++) {
        checkCharacters[0].remove();
    }
    for (var i = 0; i < charElemImgLen; i++) {
        checkCharImgs[0].remove();
    }
    for (var i = 0; i < otherElemLen; i++) {
        otherElems[0].remove();
    }
}


function skipScreen() {
    
}

function addLabelToggleEL(labelId) {
    var elemWithLabel = document.getElementById(labelId);
    elemWithLabel.addEventListener('mouseenter', function(){
        var labelId = this.id + "Label";
        var label = document.getElementById(labelId);
        label.style.visibility = "visible";
    });
    elemWithLabel.addEventListener('mouseleave', function(){
        var labelId = this.id + "Label";
        var label = document.getElementById(labelId);
        label.style.visibility = "hidden";
    });
}

function playPauseMusic() {
    var musicPlayer = document.getElementById("musicPlayer");
    console.log(musicPlayer);
    console.log(musicPlayer.paused);
    if (musicPlayer.paused) {
        musicPlayer.play();
    }
    else {
        musicPlayer.pause();
    }
}
/*
// SOURCE: https://stackoverflow.com/a/52349344
async function fetchHtmlAsText(url) {
    return await (await fetch(url)).text();
}
// SOURCE: https://stackoverflow.com/a/52349344
async function showTextingView() {
    const contentDiv = document.getElementById("textingContainer");
    contentDiv.innerHTML = await fetchHtmlAsText("texting.html");
}*/

function showTextView() {
    $("#textingContainer").load("texting.html", function(){
        console.log("MAIN: Texting container has loaded successfully!");
        var mpLabel = document.getElementById("musicControlLabel");
        var mpSymbol = document.getElementById("musicControl");
        var skipSymbol = document.getElementById("skipScreen");
        var skipLabel = document.getElementById("skipScreenLabel");

        mpLabel.style.color = "black";
        mpSymbol.style.filter = "brightness(0%)";
        skipSymbol.style.filter = "brightness(0%)";
        skipLabel.style.color = "black";
        var gameContainer = document.getElementById("gameContainer");
        var event = new Event('startTexting');
        gameContainer.dispatchEvent(event);
    });
}

function removeTextingView() {
    var textingView = document.getElementById("texting-view");
    textingView.remove();

    var mpLabel = document.getElementById("musicControlLabel");
    var mpSymbol = document.getElementById("musicControl");
    var skipSymbol = document.getElementById("skipScreen");
    var skipLabel = document.getElementById("skipScreenLabel");

    mpLabel.style.color = "white";
    mpSymbol.style.filter = "brightness(100%)";
    skipSymbol.style.filter = "brightness(100%)";
    skipLabel.style.color = "white";
}

function main() {
    addLabelToggleEL("musicControl");
    addLabelToggleEL("skipScreen");
    var gameMan = new GameManager();
    var gameContainer = document.getElementById("gameContainer")
    // gameContainer.style.backgroundImage = "url(images/texting.jpg)"
    gameMan.dataManager.getData("Introduction","json");
    gameMan.dataManager.getData("music-credits","text");
    gameContainer.gameMan = gameMan;
    runGame(false);
}
class Narration extends Character {


	startNarration() {
        var gameMan = document.getElementById("gameContainer").gameMan;
        var currentObject = document.getElementById("gameContainer").currObj;
        var that = this; 
        var currentString = currentObject.content.shift();
        var maxTime;

        switch(gameMan.soIndex % 4) {   // decides where the narration is gonna be
            case 0: // top left
                $('#gameContainer').append("<div id='narration' class='topLeft'><div class='chatWindowBG'></div><div class='chatWindowFG'><p id='narrationContent'></p></div></div>");
            break;

            case 1: // bottom right
                $('#gameContainer').append("<div id='narration' class='topRight'><div class='chatWindowBG'></div><div class='chatWindowFG'><p id='narrationContent'></p></div></div>");
            break;

            case 2: // bottom left
                $('#gameContainer').append("<div id='narration' class='bottomLeft'><div class='chatWindowBG'></div><div class='chatWindowFG'><p id='narrationContent'></p></div></div>");
            break;

            case 3: // top right
                $('#gameContainer').append("<div id='narration' class='bottomRight'><div class='chatWindowBG'></div><div class='chatWindowFG'><p id='narrationContent'></p></div></div>");
            break;
        }
           
        document.getElementById("narration").addEventListener("remove", function(event){  // event 'remove' declaration
            //$(this).remove();
            var speechBox = document.getElementById("narration");
            speechBox.remove();
            document.getElementById("gameContainer").gameMan.incrementSOIndex();
            var currObj = document.getElementById("gameContainer").currObj;
            gameMan.processSpeech(currObj);

            // Stop the event from bubbling up the DOM tree.
            event.stopPropagation();
        });

        this.backgroundImgCheck(currentObject); 
        if (currentString.length <= 50) { maxTime = 1500; }  // variable typing speed based on the length of the speech string
        else if (currentString.length <= 100) { maxTime = 3500; }
        else if (currentString.length <= 150) { maxTime = 6000; }
        else if (currentString.length <= 200) { maxTime = 7000; }
        else { maxTime = 9000; }

        var idealSpeed = Math.round(maxTime / currentString.length);
        console.log("Character: current string length is "+currentString.length+" ideal speed is "+ idealSpeed);
        var tempTyper = null;
        setTimeout(function() { // wait for image to load
            tempTyper = new TypeIt("#narrationContent", {
            strings: currentString,
            speed: idealSpeed,
            breakLines: false,
            lifeLike: true,
            nextStringDelay: [5000,500],
            afterComplete: async (step, instance) => {
                console.log("Finished loading the image!");
                
                setTimeout(function() { // wait for user to read the message then animate out
                    that.animateSpeech("narration", true); // animate speech box out before removing it
                    setTimeout(function() {
                        var gameMan = document.getElementById("gameContainer").gameMan;
                        console.log("We're at image number "+gameMan.soIndex+" out of "+(that.speech.length+gameMan.soIndex));
                        tempTyper.reset();
                        that.name = "narration";
                        that.getNextSpeech();
                        
                    }, 500)
                    
                }, 2000);
                
            }
        })
        .go();
        that.typer = tempTyper;
        }, 500);

    }

    animateSpeech(elemId, leavingFlag) {
        var elem = document.getElementById(elemId);
        var pos = 0;
        var id = setInterval(frame, 10);
        var vertAD = "";        // vertical animation direction
        var horizAD = "";       // horizontal animation direction

        if (leavingFlag) { pos = 4; }

        switch (elem.className) {
        case "topLeft":
            horizAD = "left";
            vertAD = "top";
            break;
        case "topRight":
            horizAD = "right";
            vertAD = "top";
            break;
        case "bottomLeft":
            horizAD = "left";
            vertAD = "bottom";
            break;
        case "bottomRight":
            horizAD = "right";
            vertAD = "bottom";
            break;
        }
        function frame() {
            if (leavingFlag) {
                if (pos == -50) {
                    clearInterval(id);
                } else {
                    pos--;
                    //if (vertAD == "top") { elem.style.top = pos + '%'; }
                    //else { elem.style.bottom = pos + '%'; }
                    if (horizAD == "left") { elem.style.left = pos + '%'; }
                    else { elem.style.right = pos + '%';}
                }
            }
            else {
                if (pos == 4) {
                    clearInterval(id);
                } else {
                    pos++;
                    //if (vertAD == "top") { elem.style.top = pos + '%'; }
                    //else { elem.style.bottom = pos + '%'; }
                    if (horizAD == "left") { elem.style.left = pos + '%'; }
                    else { elem.style.right = pos + '%';}
                }
            }
        }
    } 

}
class Cinematic extends Character {


	startCinematic() {
        var gameMan = document.getElementById("gameContainer").gameMan;
        var currentObject = document.getElementById("gameContainer").currObj;
        var that = this; 
        var currentString = currentObject.content.shift();

        switch(gameMan.soIndex % 4) {   // decides where the narration is gonna be
            case 0: // top left
                $('#gameContainer').append("<div id='cinematic' class='topLeft'><div class='chatWindowBG'></div><div class='chatWindowFG'><p id='cinematicContent'></p></div></div>");
            break;

            case 1: // bottom right
                $('#gameContainer').append("<div id='cinematic' class='bottomRight'><div class='chatWindowBG'></div><div class='chatWindowFG'><p id='cinematicContent'></p></div></div>");
            break;

            case 2: // bottom left
                $('#gameContainer').append("<div id='cinematic' class='bottomLeft'><div class='chatWindowBG'></div><div class='chatWindowFG'><p id='cinematicContent'></p></div></div>");
            break;

            case 3: // top right
                $('#gameContainer').append("<div id='cinematic' class='topRight'><div class='chatWindowBG'></div><div class='chatWindowFG'><p id='cinematicContent'></p></div></div>");
            break;
        }
           
        document.getElementById("cinematic").addEventListener("remove", function(event){  // event 'remove' declaration
            //$(this).remove();
            var speechBox = document.getElementById("cinematic");
            speechBox.remove();
            document.getElementById("gameContainer").gameMan.incrementSOIndex();
            var currObj = document.getElementById("gameContainer").currObj;
            gameMan.processSpeech(currObj);

            // Stop the event from bubbling up the DOM tree.
            event.stopPropagation();
        });

        this.backgroundImgCheck(currentObject);
        

        setTimeout(function() { // wait for image to load
            let temp = new TypeIt("#cinematicContent", {
            strings: currentString,
            speed: 70,
            breakLines: false,
            lifeLike: true,
            nextStringDelay: [5000,500],
            afterComplete: async (step, instance) => {
                console.log("Finished loading the image!");
                
                setTimeout(function() { // wait for user to read the message then animate out
                    that.animateSpeech("cinematic", true); // animate speech box out before removing it
                    setTimeout(function() {
                        var gameMan = document.getElementById("gameContainer");
                        console.log("We're at image number "+gameMan.soIndex+" out of "+(that.speech.length+gameMan.soIndex));
                        temp.reset();
                        that.name = "cinematic";
                        that.leaveScene();
                        
                    }, 500)
                    
                }, 2000);
                
            }
        })
        .go();
        }, 1500);
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
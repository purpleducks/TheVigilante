class Texting extends Character {
    
    talk() {
        // display their speech
        var charElem = document.getElementById(this.name);
        var gameMan = document.getElementById("gameContainer").gameMan;
        var currentObject = document.getElementById("gameContainer").currObj;
        var currentString;
        var justTheSpeech;
        var txtContainer = document.getElementById("textingContainer");
        var hasBeenSent = false;
        var that = this;

        
        if (charElem != null) {   // if the element exists, then delete it and make a new one
            charElem.remove();
        }
        this.backgroundImgCheck(currentObject);
        if (currentObject.decision) { 
            this.makeDecisionButtons(gameMan); 
        }
        currentString = currentObject.content.shift();
        console.log("TEXTING: Currently displaying: " +currentString+ " and the current object content array's length is: " +currentObject.content.length);
        if (!currentObject.decision) {
            justTheSpeech = currentString.split(this.name+": '")[1];
            justTheSpeech = justTheSpeech.slice(0, (justTheSpeech.length - 1));
        }
        else {
            justTheSpeech = currentString;
        }
        console.log("TEXTING: Sending this to screen: " +justTheSpeech);
        document.getElementById('textingContainer').addEventListener("remove", function(event){  // event 'remove' declaration
            //$(this).remove();
            document.getElementById("gameContainer").gameMan.incrementSOIndex();
            var currObj = document.getElementById("gameContainer").currObj;
            console.log("TEXTING: Leaving TEXTING, moving on!")
            gameMan.processSpeech(currObj);

            // Stop the event from bubbling up the DOM tree.
            event.stopPropagation();
        });
        
        if (document.getElementsByClassName("chat").length == 0) { // if the texting container doesn't exist then create it
            this.refreshChat();
        }

        this.pushChat('.chat', this.side, justTheSpeech);

        setTimeout(function() {
            console.log("TEXTING: Waited 3 seconds for the user to read message.");  

            if (currentObject.decision) { that.showDecisionButtons(); }
            else {  // decisions don't need this
                console.log("TEXTING: Let's get the next thing.");
                that.getNextSpeech();  // once the character has stopped talking, leave the scene.
            }
        }, 3000);
    }

    // ADOPTED SOURCE: https://codepen.io/adobewordpress/pen/wGGMaV
    createChatWindow(element) {   
        $(element).html('<form class="chat"><span></span><div class="messages"></div></form>');

        function showLatestMessage() {
            $(element).find('.messages').scrollTop($(element).find('.messages').height());
        }
        showLatestMessage();
    }


    pushChat(element, side, message) {
        var originClass;
        if (side == 'R') {
            originClass = 'myMessage';
        } else {
            originClass = 'fromThem';
        }
        // console.log("Adding a message!");
        var newMsg = '<div class="message"><div class="' + originClass + '"><p>' + message + '</p></div></div>';
        console.log("TEXTING: Appending this to texting view: "+newMsg);
        $(element + ' .messages').append(newMsg)

    }

    refreshChat(){
        /* Activating chatbox on element */
        this.createChatWindow('#texting-view');
        /* Let's push some dummy data 
        pushChat('.chat', 'Kate', 'me', 'It looks beautiful!');
        pushChat('.chat', 'John Doe', 'you', 'It looks like the iPhone message box.');
        pushChat('.chat', 'Kate', 'me', 'Yep, is this design responsive?');
        pushChat('.chat', 'Kate', 'me', 'By the way when I hover on my message it shows date.');
        pushChat('.chat', 'John Doe', 'you', 'Yes, this is completely responsive.');*/
    
    }
}

function test() {
    var test = new Texting();
    test.refreshChat();
    var testTwo = new Texting();
    test.pushChat(".chat", 'R', "POOP");
    test.pushChat(".chat", 'L', "wowie oh my oof SKSKSKS");
    test.pushChat(".chat", 'R', "HEY SKSKSKSKSKS");
    testTwo.pushChat(".chat", 'R', "wowie oh my WOWOWOWOSKSKSKS");
}

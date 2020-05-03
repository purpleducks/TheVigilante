class Decision extends Character {
	constructor(nOD, decisionNames) {
		super("Decision", null, 'D')
		this.noOfDecisions = nOD;
		this.decisionNames = decisionNames;
	}

	showDecisionButtons() {
		$('#gameContainer').append("<div class='row'>");
		$('#gameContainer').append("<div class='col-sm-12'>");
		for (var i = 0; i < this.noOfDecisions; i++) {
			if (i%2 == 1) {
				$('#gameContainer').append("<div><button class='btn btn-primary'>"+this.decisionNames[i]+"</button></div>");
				$('#gameContainer').append("</div>");	//closing DIV tag for the first row of buttons
			}
			else {
				$('#gameContainer').append("<div class='pull-left'><button class='btn btn-primary'>"+this.decisionNames[i]+"</button></div>");
			}
		}
		$('#gameContainer').append("</div>"); // closing DIV tag for all of the buttons
	}

}
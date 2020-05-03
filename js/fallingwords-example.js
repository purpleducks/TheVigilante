
// Since we want both correct and wrong answers to be on the same y-coordinate, we can use the same variable.
var correct_or_wrong_y = 0;

// We will also want the same spacing between answers, regardless of if they are correct or wrong answers.
const STARTING_X_FOR_FALLING_WORDS = 200;
var correct_or_wrong_x = STARTING_X_FOR_FALLING_WORDS;

var random_num;
var class_counter = 0;

//added variables for wrong answers


//variables for original vocab word - to display static in corner of screen screen
var original_vocab_x = 20;
var original_vocab_y = 20;

var vocab_words = {
  1:{
    vocab_word: 'platella',
    wrong_possibilities: ['arm', 'head', 'shoulder'],
    correct_answer: 'knee'
  },
  2:{
    vocab_word: 'tibia',
    wrong_possibilities: ['foot', 'eye', 'nose'],
    correct_answer: 'leg'
  
  },
  3:{
    vocab_word: 'humerus',
    wrong_possibilities: ['foot', 'eye', 'arm'],
    correct_answer: 'arm'
    
  },
  4:  {
    vocab_word: 'temporal bone',
    wrong_possibilities: ['head', 'eye', 'arm'],
    correct_answer: 'head'
    
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background('lightblue');
  pickRandomVocabWord();
  //code to display original vocab word goes below
  
  //slows down speed of falling words 
  frameRate(5);
  displayVocabWord();
}

function draw() {
  wrong_x = STARTING_X_FOR_FALLING_WORDS;
  if(correct_or_wrong_y < height - 100){
    var correct_answer_element = createDiv(vocab_words[random_num].correct_answer).class('answers correct_answers').id('correct_answer' + class_counter).mouseClicked(clickOnCorrectAnswer).position(correct_or_wrong_x, correct_or_wrong_y);
    correct_or_wrong_x += 70;
    
    if(class_counter > 0){
      select('#correct_answer' + (class_counter-1)).remove();
    }
    
     //duplicating Bryan's correct_answers class code for wrong answers
     for(var i = 0; i < vocab_words[random_num].wrong_possibilities.length; i++){
      var wrong_answer_element = createDiv(vocab_words[random_num].wrong_possibilities[i]).class('answers wrong_possibilities' + class_counter).mouseClicked(clickOnWrongPossibilities).position(correct_or_wrong_x, correct_or_wrong_y);
      correct_or_wrong_x += 70;
     }
     
    if (class_counter > 0){
      var wrong_possibilities = selectAll('.wrong_possibilities' + (class_counter-1));
      for(var j = 0; j < wrong_possibilities.length; j++){
        wrong_possibilities[j].remove();
      }
    }
     
    correct_or_wrong_y += 10;  
  }
  correct_or_wrong_x = STARTING_X_FOR_FALLING_WORDS;
  class_counter++;
}
  
function clickOnCorrectAnswer(){
  var answers = selectAll('.answers');
  for(var i = 0; i < answers.length; i++){
    answers[i].remove();
  }
  correct_or_wrong_y = 0;
  class_counter = 0;
  select('#vocab_word').remove();
  pickRandomVocabWord();
  displayVocabWord();
}
  
function clickOnWrongPossibilities(){
  // Here you might want to make a giant red X appear or something like that, and let them try again?
}

function displayVocabWord(){
  var div = createDiv("vocabWord").id('vocab_word');
  // You need to use position() for it to show on top of the canvas (to make its CSS position "absolute", or else it will be drawn below the canvas by default.
  div.position(original_vocab_x, original_vocab_y);
  div.html(vocab_words[random_num].vocab_word);
}


function pickRandomVocabWord(){
  // We didn't learn this in class:  Object.keys(vocab_words).length   but what this is doing is
  // counting the number of keys in the vocab_words object (there are 2 at this point, and they are literally the numbers 1 and 2 in the object defined above).
  // As you continue to add vocab words to that object, it will continue to find how many vocab words there are.
  
  // We did not learn the ceil() function either.  This is simply rounding the random number up, so we get whole numbers like 1 or 2 instead of a 0 or 1 with decimals.
  random_num = ceil(random(Object.keys(vocab_words).length));
}



function startGame() {
  myGameArea.start();
  loadBG(myGameArea);
}

var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  }
}
/*
function loadBG(myGameArea)
{
  var drawOnCanvas = myGameArea.canvas.getContext("2d");
  var BGimg = new Image();

  drawOnCanvas.imageSmoothingEnabled = true;
  drawOnCanvas.imageSmoothingQuality = "high";

  BGimg.onload = function() {
    // get the scale
    var scale = Math.min(myGameArea.canvas.width / BGimg.width, myGameArea.canvas.height / BGimg.height);
    // get the top left position of the image
    var x = (myGameArea.canvas.width / 2) - (BGimg.width / 2) * scale;
    var y = (myGameArea.canvas.height / 2) - (BGimg.height / 2) * scale;
    drawOnCanvas.drawImage(BGimg, x, y, BGimg.width * scale, BGimg.height * scale);
    alert('the image is drawn');
  }
  BGimg.src = "assets/office-bg.png";
}*/

function loadBG(myGameArea) {
  var drawOnCanvas = myGameArea.canvas.getContext("2d");
  var imageObj = new Image();
  drawOnCanvas.imageSmoothingEnabled = true;
  drawOnCanvas.imageSmoothingQuality = "high";

  imageObj.onload = function() {
    var imgWidth = imageObj.naturalWidth;
    var screenWidth  = myGameArea.canvas.width;
    var scaleX = 1;
    if (imgWidth > screenWidth)
        scaleX = screenWidth/imgWidth;
    var imgHeight = imageObj.naturalHeight;
    var screenHeight = myGameArea.canvas.height;
    var scaleY = 1;
    if (imgHeight > screenHeight)
        scaleY = screenHeight/imgHeight;
    var scale = scaleY;
    if(scaleX < scaleY)
        scale = scaleX;
    if(scale < 1){
        imgHeight = imgHeight*scale;
        imgWidth = imgWidth*scale;
    }

    myGameArea.canvas.height = imgHeight;
    myGameArea.canvas.width = imgWidth;

    drawOnCanvas.drawImage(imageObj, 0, 0, imageObj.naturalWidth, imageObj.naturalHeight, 0,0, imgWidth, imgHeight);
  }
  imageObj.src = "assets/office-bg.png";
}

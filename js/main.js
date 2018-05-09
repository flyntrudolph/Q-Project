function localStorageFunc (key, value) {
  localStorage.setItem(key, value)
  return value
}
function getStorage(item) {
  return localStorage.getItem(item)
}



//Declaring some run time globals.
var imgUrl = ''
var imgPreRedirect = 'https://source.unsplash.com/random?sig='
var lastImgClick = ''
var lastDiffClick = ''
var imgArray = []
var currentCallNum = 0
var clear;

const PUZZLE_DIFFICULTY = getStorage('diff');
const PUZZLE_HOVER_TINT = '#009900';
var _canvas;
var _stage;

var _img;
var _pieces;
var _puzzleWidth;
var _puzzleHeight;
var _pieceWidth;
var _pieceHeight;
var _currentPiece;
var _currentDropPiece;

var _mouse;


// Waiting for dom to load
$('Document').ready(function (){
  //Does a for loop of the urls to try and get each img src after 302 redirect.
  function getRandom() {
    //setting up xhr as a XMLHttpRequest class object.
    var xhr = new XMLHttpRequest()
    //Does https GET request to url plus i so its a different random .
    //(sig gets removed server side and does nothing other that make them send a new request post).
    xhr.open('GET', imgPreRedirect+currentCallNum, true)
    //waits to xhr is done loading and calls an anon function that pushes response url to an array.
    xhr.onload = function () {
      currentCallNum++
      imgArray.push(xhr.responseURL)
      //Sends response of response as null.
    }
    // xhr.send(null)
    // if(currentCallNum >= 6){
    //    changeImages()
    //    clearInterval(clear)
    // }
  }

  function diffButtonListener () {
    var diffButtonsEasy = $('.diffButtonEasy')
    diffButtonsEasy.click(function (e) {
      if(lastDiffClick !== '')  {
        lastDiffClick.style.border = '1px solid orange'
        lastDiffClick.style.color = 'orange'
        lastDiffClick.style.opacity = '1'
        this.style.border = '3px solid #29b6f6'
        this.style.color = '#29b6f6'
        this.style.opacity = '0.5'
      }
      lastDiffClick = this
      this.style.opacity = '1'
      this.style.border = '10px solid #29b6f6'
      this.style.color = '#29b6f6'
    })

    var diffButtonsMedium = $('.diffButtonMedium')
    diffButtonsMedium.click(function (e) {
      if(lastDiffClick !== '')  {
        lastDiffClick.style.border = '1px solid orange'
        lastDiffClick.style.color = 'orange'
        lastDiffClick.style.opacity = '1'
        this.style.border = '3px solid #29b6f6'
        this.style.color = '#29b6f6'
        this.style.opacity = '0.5'
      }
      lastDiffClick = this
      this.style.opacity = '1'
      this.style.border = '10px solid #29b6f6'
      this.style.color = '#29b6f6'
    })

    var diffButtonsHard = $('.diffButtonHard')
    diffButtonsHard.click(function (e) {
      if(lastDiffClick !== '')  {
        lastDiffClick.style.border = '1px solid orange'
        lastDiffClick.style.color = 'orange'
        lastDiffClick.style.opacity = '1'
        this.style.border = '3px solid #29b6f6'
        this.style.color = '#29b6f6'
        this.style.opacity = '0.5'
      }
      lastDiffClick = this
      this.style.opacity = '1'
      this.style.border = '10px solid #29b6f6'
      this.style.color = '#29b6f6'
    })
  }


  function imageListener () {
    var images = $('.rightBar img')
    images.click(function (e) {
      if(lastImgClick !== '')  {
        lastImgClick.style.border = 'none'
        lastImgClick.style.opacity = '1'
        this.style.border = '1px solid orange'
        this.style.opacity = '0.5'
      }
      lastImgClick = this
      this.style.opacity = '0.5'
      this.style.border = '10px solid orange'
    })
  }




  function callRandom(callback) {
    clear = setInterval(callback, 900)
  }
  // function changeImages() {
  //   var count = 0
  //   for(var i =6; i < 20; i=i+2) {
  //     $('.rightBar')[0].children[i].src = imgArray[count]
  //     count++
  //   }
  // }

  $('#previewImg').attr("src", getStorage('img'))
  console.log($('#previewImg'))

  function imageListener () {
    var images = $('.rightBar img')
    images.click(function (e) {
      if(lastImgClick !== '')  {
        lastImgClick.style.border = 'none'
        lastImgClick.style.opacity = '1'
        this.style.border = '1px solid orange'
        this.style.opacity = '0.5'
      }
      lastImgClick = this
      this.style.opacity = '0.5'
      this.style.border = '1px solid orange'
    })
  }

  function playButtonListener() {
    var buttons = $('.playButton')
    buttons.click(function (e) {
      if(lastDiffClick == '') {
        lastDiffClick=3
        localStorageFunc('diff', lastDiffClick)
      } else {
        localStorageFunc('diff', lastDiffClick.id)
      }
      if(lastImgClick == '') {
        lastImgClick='https://source.unsplash.com/random?sig=1'
        localStorageFunc('img', lastImgClick)
      } else {
        localStorageFunc('img', lastImgClick.src)
      }
      window.location.href='playPage.html'
    })
  }
  function homeButtonListener() {
    var imgButton = $('.logo')
    imgButton.click(function (e) {
      window.location.href='index.html'
    })
  }

  diffButtonListener()
  homeButtonListener()
  playButtonListener()
  imageListener()
  callRandom(getRandom)
})


// *******************************************
//THIS IS THE CODE BELOW FOR THE IMAGE GAME IT SELF
  function onImage(e){
      _pieceWidth = Math.floor(650 / PUZZLE_DIFFICULTY);
      _pieceHeight = Math.floor(650 / PUZZLE_DIFFICULTY);
      _puzzleWidth = _pieceWidth * PUZZLE_DIFFICULTY;
      _puzzleHeight = _pieceHeight * PUZZLE_DIFFICULTY;
      setCanvas();
      initPuzzle();
  }
  function setCanvas(){
    _canvas = document.getElementById('canvas');
    _stage = _canvas.getContext('2d');
    _canvas.width = _puzzleWidth;
    _canvas.height = _puzzleHeight;
    _canvas.style.border = "1px solid black";
  }
  function initPuzzle(){
    _pieces = [];
    _mouse = {x:0,y:0};
    _currentPiece = null;
    _currentDropPiece = null;
    _stage.drawImage(_img, 0, 0, 650, 650, 0, 0, 650, 650);
    createTitle("Click to Start Puzzle");
    buildPieces();
  }
  function createTitle(msg){
    _stage.fillStyle = "#000000";
    _stage.globalAlpha = .4;
    _stage.fillRect(100,_puzzleHeight - 40,_puzzleWidth - 200,40);
    _stage.fillStyle = "#FFFFFF";
    _stage.globalAlpha = 1;
    _stage.textAlign = "center";
    _stage.textBaseline = "middle";
    _stage.font = "20px Arial";
    _stage.fillText(msg,_puzzleWidth / 2,_puzzleHeight - 20);
  }
  function buildPieces(){
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    for(i = 0;i < PUZZLE_DIFFICULTY * PUZZLE_DIFFICULTY;i++){
        piece = {};
        piece.sx = xPos;
        piece.sy = yPos;
        _pieces.push(piece);
        xPos += _pieceWidth;
        if(xPos >= _puzzleWidth){
            xPos = 0;
            yPos += _pieceHeight;
        }
    }
    document.onmousedown = shufflePuzzle;
  }
  function shufflePuzzle(){
    _pieces = shuffleArray(_pieces);
    _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    for(i = 0;i < _pieces.length;i++){
        piece = _pieces[i];
        piece.xPos = xPos;
        piece.yPos = yPos;
        _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, xPos, yPos, _pieceWidth, _pieceHeight);
        _stage.strokeRect(xPos, yPos, _pieceWidth,_pieceHeight);
        xPos += _pieceWidth;
        if(xPos >= _puzzleWidth){
            xPos = 0;
            yPos += _pieceHeight;
        }
    }
    document.onmousedown = onPuzzleClick;
  }
  function shuffleArray(o){
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }
  function onPuzzleClick(e){
    if(e.layerX || e.layerX == 0){
        _mouse.x = e.layerX - _canvas.offsetLeft;
        _mouse.y = e.layerY - _canvas.offsetTop;
    }
    else if(e.offsetX || e.offsetX == 0){
        _mouse.x = e.offsetX - _canvas.offsetLeft;
        _mouse.y = e.offsetY - _canvas.offsetTop;
    }
    _currentPiece = checkPieceClicked();
    if(_currentPiece != null){
        _stage.clearRect(_currentPiece.xPos,_currentPiece.yPos,_pieceWidth,_pieceHeight);
        _stage.save();
        _stage.globalAlpha = .9;
        _stage.drawImage(_img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
        _stage.restore();
        document.onmousemove = updatePuzzle;
        document.onmouseup = pieceDropped;
    }
  }
  function checkPieceClicked(){
    var i;
    var piece;
    for(i = 0;i < _pieces.length;i++){
        piece = _pieces[i];
        if(_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)){
            //PIECE NOT HIT
        }
        else{
            return piece;
        }
    }
    return null;
  }
  function updatePuzzle(e){
    _currentDropPiece = null;
    if(e.layerX || e.layerX == 0){
        _mouse.x = e.layerX - _canvas.offsetLeft;
        _mouse.y = e.layerY - _canvas.offsetTop;
    }
    else if(e.offsetX || e.offsetX == 0){
        _mouse.x = e.offsetX - _canvas.offsetLeft;
        _mouse.y = e.offsetY - _canvas.offsetTop;
    }
    _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
    var i;
    var piece;
    for(i = 0;i < _pieces.length;i++){
        piece = _pieces[i];
        if(piece == _currentPiece){
            continue;
        }
        _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
        _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth,_pieceHeight);
        if(_currentDropPiece == null){
            if(_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)){
                //NOT OVER
            }
            else{
                _currentDropPiece = piece;
                _stage.save();
                _stage.globalAlpha = .4;
                _stage.fillStyle = PUZZLE_HOVER_TINT;
                _stage.fillRect(_currentDropPiece.xPos,_currentDropPiece.yPos,_pieceWidth, _pieceHeight);
                _stage.restore();
            }
        }
    }
    _stage.save();
    _stage.globalAlpha = .6;
    _stage.drawImage(_img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
    _stage.restore();
    _stage.strokeRect( _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth,_pieceHeight);
  }
  function pieceDropped(e){
    document.onmousemove = null;
    document.onmouseup = null;
    if(_currentDropPiece != null){
        var tmp = {xPos:_currentPiece.xPos,yPos:_currentPiece.yPos};
        _currentPiece.xPos = _currentDropPiece.xPos;
        _currentPiece.yPos = _currentDropPiece.yPos;
        _currentDropPiece.xPos = tmp.xPos;
        _currentDropPiece.yPos = tmp.yPos;
    }
    resetPuzzleAndCheckWin();
  }
  function resetPuzzleAndCheckWin(){
    _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
    var gameWin = true;
    var i;
    var piece;
    for(i = 0;i < _pieces.length;i++){
        piece = _pieces[i];
        _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
        _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth,_pieceHeight);
        if(piece.xPos != piece.sx || piece.yPos != piece.sy){
            gameWin = false;
        }
    }
    if(gameWin){
        setTimeout(gameOver,500);
    }
  }
  function gameOver(){
    document.onmousedown = null;
    document.onmousemove = null;
    document.onmouseup = null;
    initPuzzle();
  }
  function init() {
    _img = new Image();
    _img.src = getStorage('img')
    _img.className = "canvasImg"
    _img.style.height = '600px'
    _img.style.width = '600px'

    _img.addEventListener('load',onImage,false);
  }

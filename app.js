
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app  = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

//Jquery
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

app.get("/", function(req, res){
  res.render("home");
})


app.listen(3000, function(){
  console.log("Server connected to port 3000");
})






var colors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickPattern = [];
var gameStarted = false;
let level = 0;

function playSound(color) {
  var audio = new Audio("sounds/" + color + ".mp3");
  audio.play();
}

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function() {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

function nextSequence() {
  var randomNumber = Math.floor(Math.random() * 4);
  var chosenColor = colors[randomNumber];
  gamePattern.push(chosenColor);
  playSound(chosenColor);
  $("#" + chosenColor).fadeIn(100).fadeOut(100).fadeIn(100);
  level++;
  $("#level-title").text("Level " + level);
}

function gameover(){
  let audio = new Audio("sounds/wrong.mp3") ;
  audio.play();
  $("body").addClass("game-over");
  setTimeout(function(){
    $("body").removeClass("game-over");
  },200);
  $("h1").html("Game Over.<br> Press A to Restart.");
}

function startover(){
  gamePattern = [];
  userClickPattern = [];
  level = 0;
  gameStarted = false;
}

$(document).on("keydown", function(event) {
  if (!gameStarted) {
    if (event.key === 'A') {
      setTimeout(nextSequence, 500);
      gameStarted = true;
    }
  }
});


$(".btn").on("click", function(event) {
  var userChosenColor = event.currentTarget.getAttribute("id");
  if(gameStarted){
    userClickPattern.push(userChosenColor);
    checkAnswer(userClickPattern.length - 1);
  }
  playSound(userChosenColor);
  animatePress(userChosenColor);
});

function checkAnswer(currentClickLevel) {
  if (userClickPattern[currentClickLevel] === gamePattern[currentClickLevel]) {
    console.log("success");
    if(userClickPattern.length === gamePattern.length){
      userClickPattern = [];
      setTimeout(nextSequence, 1000);
    }
  } else {
      gameover();
      startover();
  }
}

/*jslint node: true, sloppy: true, white: true, vars: true */

//Might as well do all the custom date prototype work here
Date.prototype.getMonthName = function() {
  var months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return months[this.getMonth()];
};

Date.prototype.toFormattedString = function() {
  return "[" + currentDate.getMonthName() + " " + currentDate.getFullYear() + "]";
};

var util = require('util');

var currentDate, currentPosition, gameMap, coords = {}, headlines = {}, decisionMenu;

//make the decision menu with defaults for every new turn
function DecisionMenu() {}

DecisionMenu.prototype.items = {
  "Intelligence": false,
  "Policing": false,
  "Military": false,
  "Iran": false
};

//fill-in for function to increment turns (start a new turn)
function setCurrentDate(turn) {
  //months are zero based
  startDate = new Date(2007, 0, 1);
  //eventually, we will use the endDate condition to determine the end of the game
  endDate = new Date(2011, 0, 1);
  currentDate = new Date(startDate.getFullYear(), turn, startDate.getDate());
  decisionMenu = new DecisionMenu();
}

/* Game Map
0 1 2
Home Screen, Intel 1, Intel 2
*/

//this will eventually be part of a gameMap object
function wordList(coords) {
  var wordMap = {};
  console.log("frm word list: " + util.inspect(coords));
  if(coords.x === 0 && coords.y === 0) {
    wordMap = {
      intelligence:{ x: 0, y: 1},
      policing:{ x: 1, y: 0},
      next: { x: 0, y: 0}
    };
  }
  if(coords.x === 0 && coords.y ===1) {
    wordMap = {
      "increase wiretaps": { x: 0, y: 2},
      "decrease wiretaps": { x: 0, y: 2},
      "do nothing": { x: 0, y: 2}
    };
  }
  if(coords.x === 0 && coords.y === 2) {
    wordMap = {
      "favor hard": { x: 0, y: 0},
      "favor soft": { x: 0, y: 0},
      "do nothing": { x: 0, y: 0}
    };
  }
  return wordMap;
}


exports.move = function(cleanData) {
  //should see which coords we are at
  //then compare to a list of words
  //then move the coords based on the valid word
  //TODO: refactor here
  var validWordList = Object.keys(wordList(this.coords));
  var wordMap = wordList(this.coords);
  //now make an array of smallest unique starts
  //match against regex
  //TODO: also refactor here
  var matches = [], re;
  if(cleanData.split(" ").length > 1)
    re = new RegExp("\\b" + cleanData.split(" ")[0] + "\\w*\\W*\\b" + cleanData.split(" ")[1], "gi");
  else
    re = new RegExp("^" + cleanData, "gi");
  console.log("custom re: " + re);

  console.log(util.inspect(this.coords));
  console.log("Word list: " + util.inspect(wordMap));
  validWordList.forEach(function(word) {
    if(word.match(re) !== null)
      matches.push(word);
  });
  console.log("Matches " + matches);

  if(matches.length === 1) {
    console.log("Matches:" + matches.length);
    this.coords = wordMap[matches[0]];
    console.log("Coords updated: " + this.coords);
  }else{
    //now we have an array of matches, but if it is bigger then one, we have a double match and need more input
    return false;
  }
};

exports.getCoords = function() {
  console.log('coords are: ' + util.inspect(this.coords));
  return this.coords;
};

exports.setCoords = function(coords) {
  this.coords = coords;
  console.log('coords set: ' + this.coords);
};

exports.getHeadlineDate = function() {
  return currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1);
};

exports.getCurrentDate = function() {
  return currentDate;
};

exports.setTurn = function(turn) {
  this.turn = turn;
  setCurrentDate(this.turn);
};

exports.nextTurn = function() {
  this.turn = this.turn + 1;
  console.log("nexted :" + this.turn);
  setCurrentDate(this.turn);
};

exports.getTurn = function() {
  return this.turn;
};

exports.getDecisionMenu = function() {
  //return current state of decision menu
  return decisionMenu.items;
};

exports.setDecisionMenu = function(key, value) {
  //set true or false on a decision menu key
  decisionMenu.items[key] = value;
};

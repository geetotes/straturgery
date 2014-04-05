/*jslint node: true, sloppy: true, white: true, vars: true */

//Might as well do all the custom date prototype work here
Date.prototype.getMonthName = function() {
  var months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return months[this.getMonth()];
};

Date.prototype.toFormattedString = function() {
  return "[" + currentDate.getMonthName() + " " + currentDate.getFullYear() + "]";
};


var currentDate;

function setCurrentDate(turn) {
  //months are zero based
  startDate = new Date(2007, 0, 1);
  //eventually, we will use the endDate condition to determine the end of the game
  endDate = new Date(2011, 0, 1);
  currentDate = new Date(startDate.getFullYear(), turn, startDate.getDate());
}

exports.getHeadlineDate = function() {
  return currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1);
};

exports.getCurrentDate = function() {
  return currentDate;
};

exports.setTurn = function(turn) {
  setCurrentDate(turn);
};

exports.getTurn = function() {
  return turn;
};

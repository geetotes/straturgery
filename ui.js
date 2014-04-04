/*jslint node: true, sloppy: true, white: true, vars: true */

function UI() {}
UI.prototype.headline = function(text) {
  var wrappedText = "\x1B[0m\x1B[42m\x1B[37m" + text + "\x1B[0m";
  return wrappedText; 
};

UI.prototype.redBG = function(text) {
  var wrappedText = "\x1B[41m" + text + "\x1B[0m";
  return wrappedText;
};

UI.prototype.greenOnWhite = function(text) {
  var wrappedText = "\x1B[47m\x1B[32m" + text + "\x1B[0m";
  return wrappedText;
};

UI.prototype.blackBG = function(text) {
  var wrappedText = "\x1B[40m\x1B[32m" + text + "\x1B[0m";
  return wrappedText;
};

module.exports = new UI();

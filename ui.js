/*jslint node: true, sloppy: true, white: true, vars: true */

//DESIGN NOTE: there should be no newlines or color strings in main function


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

UI.prototype.drawBreak = function(cols, symbol) {
  var breaker = "";
  for(var i = 1; i < cols; i++) {
    breaker += symbol;
  }
  return breaker += "\n";
};

UI.prototype.centerText = function(cols, symbol, text) {
  var padding = "";
  var upperLimit = Math.round((cols - text.length)/2);
  for(var i = 1; i < upperLimit; i++) {
    padding += symbol;
  }
  return padding += text + "\n";
};

UI.prototype.drawIraqiFlag = function(cols, barHeight) {
  var redBar = "", greenBar = "", blackBar = "", starsBar = "";
  var redBarFinal = "", blackBarFinal = "", greenBarFinal = "";

  var starsBar2 = this.centerText(cols, " ", "* * *");
  console.log(starsBar);
  starsBar = starsBar2.replace(/\n|\r/g, "");
  console.log(starsBar);

  for(var i = 1; i < cols; i++) {
    redBar += " ";
    greenBar += " ";
    blackBar += " ";
  }

  for(i = 0; i< barHeight; i++) {
    redBarFinal += this.redBG(redBar) + "\n"; 
    blackBarFinal += this.blackBG(blackBar) + "\n"; 
    if(barHeight % i === 0) {
      //don't forget to fill in
      var spacer = "";
      var remainingLength = cols  - starsBar.length;
      for(var j = 1; j < remainingLength; j++)
        spacer += " ";
      greenBarFinal += this.greenOnWhite(starsBar + spacer) + "\n";
    } else {
      greenBarFinal += this.greenOnWhite(greenBar) + "\n";
    }
  }

  return redBarFinal + greenBarFinal + blackBarFinal;


};

module.exports = new UI();

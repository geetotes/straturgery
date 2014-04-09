/*jslint node: true, sloppy: true, white: true, vars: true */

//DESIGN NOTE: there should be no newlines or color strings in main function


//takes bg and fg as ints
function UI() {}
UI.prototype.headlineHeader = function(text, gameState, bg, fg) {
  var endPadding = "";
  var currentDate = gameState.getCurrentDate();
  var textLength = text.length + currentDate.toFormattedString().length;
  for(var i = 0; i < (80 - textLength); i++)
    endPadding += " ";
  var wrappedText = "\x1B[0m\x1B[" + bg + "m\x1B["+ fg +"m" + text + endPadding + currentDate.toFormattedString() + "\x1B[0m";
  return wrappedText; 
};

UI.prototype.makeBold = function(text) {
  //eventually, need to use indexOf to detect the underlined text and wrap it
  return "\x1B[1m" + text + "\x1B[0m";
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

UI.prototype.drawDecisionMenu = function(gameState) {
  var decisionMenu = "";
  //remove "policy" from this for final game copy
  //maybe work on combining colors... or make a ui color highlighting function
  decisionMenu += this.makeBold("\x1B[4mIn\x1B[0mtelligence policy\n");
  decisionMenu += "\x1B[4mP\x1B[0molicing policy\n";
  decisionMenu += "\x1B[4mM\x1B[0military policy\n";
  decisionMenu += "\x1B[4mIr\x1B[0man policy\n";
  return decisionMenu;
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
  var spacer = "";

  var starsBar2 = this.centerText(cols, " ", "* * *");
  starsBar = starsBar2.replace(/\n|\r/g, "");

  for(var i = 1; i < cols; i++) {
    redBar += " ";
    greenBar += " ";
    blackBar += " ";
  }

  //assume 80 col width here
  for(i = 0; i < ((80-cols)/2); i++) {
    spacer += " ";
  }
  for(i = 0; i< barHeight; i++) {
    redBarFinal += spacer + this.redBG(redBar) + "\n"; 
    blackBarFinal += spacer + this.blackBG(blackBar) + "\n"; 
    if(barHeight % i === 0) {
      //don't forget to fill in
      var barsSpacer = "";
      var remainingLength = cols  - starsBar.length;
      for(var j = 1; j < remainingLength; j++)
        barsSpacer += " ";
      greenBarFinal += spacer + this.greenOnWhite(starsBar + barsSpacer) + "\n";
    } else {
      greenBarFinal += spacer + this.greenOnWhite(greenBar) + "\n";
    }
  }
  return redBarFinal + greenBarFinal + blackBarFinal;
};

/*
 * STUFF FOR THE INTEL ROOM
 */

UI.prototype.statusWrapper = function(label, description, character) {
  var string = character + " " + label + " " + character + " " + description + " " + character;
  var border = this.drawBreak((string.length + 1), character);
  return border + string + "\n" + border;
};

module.exports = new UI();

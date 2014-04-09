/*jslint node: true, sloppy: true, white: true, vars: true */

//DESIGN NOTE: there should be no newlines or color strings in main function

var util = require('util');

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
  //function should probably go through the menu options and handle the highlighting automagically
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

UI.prototype.alignText = function(width, text, align) {
  var difference = width - text.length, spacer = "";
  //TODO: make this function accomidating of center and right aligns
  for(var i = 0; i < difference; i ++) {
    spacer += " ";
  }
  text = "|" + text + spacer + "|";
  return text;
};

//takes two array of arrays
UI.prototype.table = function(headers, data) {
  var t = headers.slice(0), table = "";
  console.log(headers);
  t.sort(function(a, b){
    return b.length - a.length;
  });
  var widest = t[0].length;
  console.log(t);
  console.log(headers);
  for(var i = 0; i < headers.length; i ++){
    table += this.alignText(widest, headers[i], "left");
  }
  console.log(table);
  return table + "\n";

};

UI.prototype.drawPolicingStats = function() {

  var headers = ["Type", "Casualties", "Trend"];
  var data = [["Attacks on Civilians", "(4020)(482)(19K)", "Up/Down"],["IED Attacks", "(2821)(4391)(19K)", "Up/Down"]];
  return this.table(headers, data);


};

UI.prototype.drawDecisionMenu = function(items) {
  var decisionMenu = "";
  /*
   * string.indexOf(i) is the key here!!!!!!
   *
   *
  var itemArray = Object.keys(items), highlightArray = {};
  itemArray.forEach(function(item) {
    var highlightAmount;
    for(var i = 0; i < item.length; i ++){
      var letter = item[i];
      for(var j = 0; j < itemArray.length; j++) {
        if(itemArray[j] !== item && itemArray[j][i] == item[i]){
          console.log("comparing " + itemArray[j] + " to " + item);
          console.log(itemArray[j][i] + " matches " + item[i]);
          highlightAmount = i;
          return;
        }
      }
    }
    console.log(item);
    highlightArray[item] = highlightAmount;
  });

  console.log(util.inspect(highlightArray));
*/
  for(var prop in items) {
    if(items[prop] === false){
      decisionMenu += this.makeBold(prop) + "\n"; //look up prop to get int for how many characters to make the underline
    } else {
      decisionMenu += prop + "\n";
    }
  }
  /*
  decisionMenu += this.makeBold("\x1B[4mIn\x1B[0mtelligence policy\n");
  decisionMenu += "\x1B[4mP\x1B[0molicing policy\n";
  decisionMenu += "\x1B[4mM\x1B[0military policy\n";
  decisionMenu += "\x1B[4mIr\x1B[0man policy\n";
  */
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

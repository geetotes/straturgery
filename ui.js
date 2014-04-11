/*jslint node: true, sloppy: true, white: true, vars: true */

//DESIGN NOTE: there should be no newlines or color strings in main function

var util = require('util');

String.prototype.printedLength = function() {
  var i = this.length, re, temp = "", match = "";
  if ( i === 0 ) return this;
  while ( --i) {
    if(this.charCodeAt(i) !== 27)
      temp += this[i];
  }
  //this is now a crazy regular expression problem
  re = /(m\w*)\[|(m\w*;\w*;\w*)\[/gi;
  match = temp.replace(re, "");
  return match.length;
};

function UI() {}

//takes bg and fg as ints
UI.prototype.headlineHeader = function(text, gameState, bg, fg) {
  var endPadding = "";
  var currentDate = gameState.getCurrentDate();
  var textLength = text.length + currentDate.toFormattedString().length;
  for(var i = 0; i < (80 - textLength); i++){
    endPadding += " ";
  }
  return "\x1B[0m\x1B[" + bg + "m\x1B["+ fg +"m" + text + endPadding + currentDate.toFormattedString() + "\x1B[0m";

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
  text = "[" + text + spacer + "]";
  return text;
};

//takes two array of arrays
UI.prototype.table = function(headers, data) {
  var t = headers.slice(0), table = "";
  console.log(data.length);
  t.sort(function(a, b){
    return b.length - a.length;
  });
  var widest = t[0].length;
  //now draw the data
  data.forEach(function(datum) {
    var tt = datum.slice(0);
    tt.sort(function(a, b){
      return b.length - a.length;
    });
    if(tt[0].length > widest) {
      widest = tt[0].length;
    }
  });

  for(var i = 0; i < headers.length; i ++){
    table += this.alignText(widest, headers[i], "left");
  }
  var headerWidth = table.length + 1;
  table += "\n" + this.drawBreak(headerWidth, "\u203E");
  for(i = 0; i < data.length; i++){
    for(var j = 0; j < data[i].length; j++) {
      table += this.alignText(widest, data[i][j], "left");
    }
    table += "\n";
  }

  return table + "\n";

};

UI.prototype.drawPolicingStats = function() {

  var headers = ["Type", "Casualties (US)(IR)(Civ)", "Trend"];
  var data = [
    ["Attacks on Civilians", "(4020)(482)(19K)", "Up/Down"],
    ["IED Attacks", "(2821)(4391)(19K)", "Up/Down"],
    ["Small Arms Attacks", "(123)(456)(32)", "Up/Down"],
    ["Mortar/Rocket", "(123)(456)(789)", "Up/Down"]
      ];
  //TODO: Finish up this function
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

UI.prototype.intelHeadline = function(text, gameState) {
  var endGradient = "", startBlock = "", wrappedText = "", titleText = "", currentDate = gameState.getCurrentDate();
  for(i = 5; i > 0 ; i--) {
    var x = (i * 36) + 16;
    endGradient += "\x1B[48;5;" + x + "m \x1B[0m";
  }

  endGradient += "\x1b[97m" + currentDate.toFormattedString() + "\x1b[0m";
  console.log(endGradient.printedLength());

  titleText = "\x1B[48;5;196m\x1B[97m" + text + "\x1B[0m";

  //assuming 80 chars wide here again
  for(i = 0; i < (80 - (titleText.printedLength() + endGradient.printedLength() + 1)); i ++){
    startBlock += "\x1B[48;5;196m \x1B[0m";
  }

  wrappedText += this.drawBreak(80, "\x1B[38;5;237;4m \x1B[0m");


  wrappedText += titleText + startBlock + endGradient;
  wrappedText += "\n";
  wrappedText += this.drawBreak(80, "\x1B[38;5;237m\u203E\x1B[0m");
  

  return wrappedText; 
};

UI.prototype.statusWrapper = function(label, description, character) {
  var string = character + " " + label + " " + character + " " + description + " " + character;
  var border = this.drawBreak((string.length + 1), character);
  return border + string + "\n" + border;
};

UI.prototype.clearScreen = "\x1B[2J";

module.exports = new UI();

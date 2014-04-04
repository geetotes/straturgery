/*jslint node: true, sloppy: true, white: true, vars: true */

var net = require('net');
var sockets = [];

var gameState = require('./gameState');
//var ui = require('UI');

//TODO: Refactor all this stuff into a UI helper class

function Color() {}
Color.prototype.headline = function(text) {
  var wrappedText = "\x1B[0m\x1B[42m\x1B[37m" + text + "\x1B[0m";
  return wrappedText; 
};

Color.prototype.redBG = function(text) {
  var wrappedText = "\x1B[41m" + text + "\x1B[0m";
  return wrappedText;
};

Color.prototype.greenOnWhite = function(text) {
  var wrappedText = "\x1B[47m\x1B[32m" + text + "\x1B[0m";
  return wrappedText;
};

Color.prototype.blackBG = function(text) {
  var wrappedText = "\x1B[40m\x1B[32m" + text + "\x1B[0m";
  return wrappedText;
};


function drawIraqFlag(cols, barHeight) {
  var redBar = "", greenBar = "", blackBar = "";
  var colorer = new Color();

  for(var i = 1; i < cols; i++) {
    redBar += " ";
    greenBar += " ";
    blackBar += " ";
  }

  redBar = colorer.redBG(redBar) + "\n" + colorer.redBG(redBar) + "\n" + colorer.redBG(redBar) + "\n";
  greenBar = colorer.greenOnWhite(greenBar) + "\n" + colorer.greenOnWhite(centerText(cols, " ", "* * *")) + "\n" + colorer.greenOnWhite(greenBar) + "\n";
  blackBar = colorer.blackBG(blackBar) + "\n" + colorer.blackBG(blackBar) + "\n" + colorer.blackBG(blackBar) + "\n";

  var finalFlag = redBar + greenBar + blackBar;
  return finalFlag;
}


//UI HELPER METHODS GO HERE
function drawBreak(cols, symbol) {
  var breaker = "";
  for(var i = 1; i < cols; i++) {
    breaker += symbol;
  }
  return breaker += "\n";
}

function centerText(cols, symbol, text) {
  var padding = "";
  var upperLimit = Math.round((cols - text.length)/2);
  for(var i = 1; i < upperLimit; i++) {
    padding += symbol;
  }
  return padding += text + "\n";
}

function cleanInput(data) {
  return data.toString().replace(/(\r\n|\n|\r)/gm,"");
}

function drawWelcome(){
  var welcome = "\x1B[31m";
  welcome += drawBreak(80, "-");
  welcome += centerText(80, " ", "Welcome to");
  welcome += centerText(80, " ", "STRATURGERY");
  welcome += drawBreak(80, "-");
  welcome += "\x1B[39m";
  welcome += centerText(80, " ", "The Game of Pulling Out");
  welcome += drawIraqFlag(40, 2);
  //welcome += "\x1B[3m\x1B[37m\x1B[39m\x1B[23m\n";

  return welcome;
}

//TODO: Refactor this please
function oldFetchHeadlines(currentDate) {
  var fs = require('fs');
  var file = __dirname + '/headlines.json';
  var data;

  fs.readFile(file, 'utf8', function(err, data) {
    if(err) {
      console.log('Error: ' + err);
      return;
    }
    data = JSON.parse(data);
    //pop 3 random headlines from data[currentDate]
    var lookup = currentDate.getFullYear() + "-" + currentDate.getMonth();
    if(data[lookup] === undefined) {
      headlines.push("No headlines available for this month");
      console.log('No headlines available for: ' + currentDate.getFullYear() + "-" + currentDate.getMonth());
    } else {
      //grab 3 random headlines
      var minimum = 0;
      var dataHeadlines = data[lookup];
      var maximum = dataHeadlines.length - 1;
      for(var i = 0; i < 1; i++) {
        var randomnumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
        headlines.push(dataHeadlines[randomnumber]);
        console.log("in loop: " + headlines);
        return headlines;
      }
    }
  });
  console.log ("returning headlines: " + headlines.length);
  return headlines;
}

//orig looking at
//from SO: http://stackoverflow.com/questions/10058814/get-data-from-fs-readfile
//but then decided that async didn't really work here, since i need to return the headlines so far up the call stack
//now looking at: http://stackoverflow.com/questions/10011011/using-node-js-how-do-i-read-a-json-object-into-server-memory
//SO links for future refrence
function fetchHeadlines() {
  var fs = require('fs');
  var file = __dirname + '/headlines.json';
  var data = JSON.parse(fs.readFileSync(file, 'utf8'));
  var headlines;
  /*
  fs.readFile(file, 'utf8', function(err, data) {
    if(err) {
      console.log('Error: ' + err);
      return callback(err);
    }
    callback(null, data);
  });
  */
  headlines = data['2007-1'];
  return headlines;
}


function drawNewsRoom(){
  var newsRoom = "";
  var colorer = new Color();
  //taking out the headline selection for now
  //var headlines = fetchHeadlines(currentDate);
  newsRoom += colorer.headline("TODAYS HEADLINES") + "\n";
  newsRoom += drawBreak(80, "-");
  var headlines = fetchHeadlines();
  headlines.forEach(function(headline) {
    newsRoom += headline + "\n";
    console.log(headline);
  });


  newsRoom += "WASHINGTON DC: Aliens elected president\n";
  newsRoom += "NEW YORK CITY: Bloomberg re-elected\n";

  return newsRoom;
}

//this will eventually take some type of decision menu object that will help out with highlighting
function drawDecisionMenu(){
  var decisionMenu = "";
  decisionMenu += "1. Intelligence policy\n";
  decisionMenu += "2. Policing policy\n";
  decisionMenu += "3. Military policy\n";
  decisionMenu += "4. Iran policy\n";

  return decisionMenu;

}

function recieveData(socket, data, turn) {
  //increment time
  //output time
  var currentDate = gameState.getCurrentDate().toFormattedString();
  socket.write(currentDate +" \n");

  //need to find a better way to catch the quit command
  var cleanData = cleanInput(data);
  if (cleanData == "@quit") {
    socket.end('\x1B[44mGoodbye!\x1B[49m\n');
  }
  else {
    for (var i = 0; i<sockets.length; i++){
      if (sockets[i] !== socket) {
        sockets[i].write(data);
      }
      if (sockets[i] == socket) {
        //sockets[i].write("You said: " + data);
      }
    }
  }
}

function closeSocket(socket) {
  var i = sockets.indexOf(socket);
  if (i != -1) {
    sockets.splice(i, 1);
  }
}

function newSocket(socket) {
  var turn = 0;
  sockets.push(socket);
  socket.write(drawWelcome());
  //should figure out to start a new game or continue an old one somewhere here
  socket.on('data', function(data) {
    gameState.setTurn(turn);
    socket.write(drawNewsRoom());
    socket.write(drawDecisionMenu());
    recieveData(socket, data, turn);
    //should prob not increment every time input goes in
    turn += 1;
  });
  socket.on('end', function() {
    closeSocket(socket);
  });
}

var server = net.createServer(newSocket);


server.listen(1337);

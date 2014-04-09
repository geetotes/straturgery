/*jslint node: true, sloppy: true, white: true, vars: true */

var net = require('net');
var util = require('util');
var sockets = [];

var gameState = require('./gameState');
var ui = require('./ui');

//From SO: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array/18650169#18650169
Array.prototype.shuffle = function() {
  var i = this.length, j, temp;
  if ( i === 0 ) return this;
  while ( --i ) {
    j = Math.floor( Math.random() * ( i + 1 ) );
    temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }
  return this;
};

function cleanInput(data) {
  return data.toString().replace(/(\r\n|\n|\r)/gm,"");
}

function drawWelcome(){
  //remove these codes
  var welcome = "\x1B[31m";
  welcome += ui.drawBreak(80, "-");
  welcome += ui.centerText(80, " ", "Welcome to");
  welcome += ui.centerText(80, " ", "STRATURGERY");
  welcome += ui.drawBreak(80, "-");
  welcome += "\x1B[39m";
  welcome += ui.drawIraqiFlag(30, 3);
  welcome += ui.centerText(80, " ", "The Game of Pulling Out");

  return welcome;
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
  headlines = data[gameState.getHeadlineDate()];
  return headlines;
}


function drawNewsRoom(){
  var room = "";
  room += ui.headlineHeader("TODAYS HEADLINES", gameState, 42, 37) + "\n";
  room += ui.drawBreak(80, "-");
  var headlines = fetchHeadlines().shuffle();
  //let's just show 3 for now
  var i = 0;
  headlines.forEach(function(headline) {
    if(i < 3) {
      room += headline + "\n";
      i += 1;
    }
  });
  room += ui.drawBreak(80, "-");
  room += ui.drawBreak(80, " ");
  room += ui.drawBreak(80, " ");
  return room;
}

function drawSigIntRoom(){
  var room = "";

  room += ui.headlineHeader("INTELLIGENCE (1 of 2)", gameState, 41, 37) + "\n";
  room += ui.drawBreak(80, "\u25A9");
  //maybe give updates on what's happening with sigint
  room += ui.drawBreak(80, " ");
  room += ui.drawBreak(80, " ");
  room += ui.statusWrapper("SIGINT", "\u25B3 wiretaps \u25BD drones", "\u2593");
  room += ui.drawBreak(80, " ");
  room += "Current status report:\n";
  room += "\t* Est. 85% of electronic commuincations are being monitored\n";
  room += "\t* Drone fleet is running at 50%";
  room += ui.drawBreak(80, " ");
  room += "OPTIONS:\n";
  //these should have state
  room += "Increase/Decrease Wiretaps\n";
  room += "Increase/Decrease Predator\n";
  room += "Do Nothing\n";
  //if you run the drones too much, they will break down
  //the more inteligence you collect, the more false positives you get

  return room;
}

function drawHumIntRoom(){
  var room = "";
  room += ui.headlineHeader("INTELLIGENCE (2 of 2)", gameState, 41, 37) + "\n";
  room += ui.drawBreak(80, "\u25A9");
  room += ui.drawBreak(80, " ");
  room += ui.drawBreak(80, " ");
  room += ui.statusWrapper("HUMINT", "hard tactics", "\u2593");
  room += ui.drawBreak(80, " ");
  room += "OPTIONS:\n";
  room += "Favor Hard Tatics\n";
  room += "Favor Soft Tactics\n";
  room += "Do Nothing\n";

  return room;

}

//this will eventually take some type of decision menu object that will help out with highlighting
function drawDecisionMenu(){
  var decisionMenu = "";
  decisionMenu += "WHICH WOULD YOU LIKE TO ADDRESS?\n";
  decisionMenu += ui.drawBreak(80, " ");
  decisionMenu += ui.drawDecisionMenu(gameState);

  return decisionMenu;

}

function recieveData(socket, data, turn) {

  //need to find a better way to catch the quit command
  var cleanData = cleanInput(data);
  if (cleanData == "@quit") {
    socket.end('\x1B[44mGoodbye!\x1B[49m\n');
  }
  else {
    //should simply update coordinates
    gameState.move(cleanData);
    for (var i = 0; i<sockets.length; i++){
      if (sockets[i] !== socket) {
        //sockets[i].write(data);
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
  //starting variables
  var turn = 0, coords = {};
  coords.x = 0;
  coords.y = 0;
  //set the initial turn # and position in the "map"
  gameState.setCoords(coords);
  gameState.setTurn(turn);

  sockets.push(socket);

  socket.write(drawWelcome());
  //should figure out to start a new game or continue an old one somewhere here
  socket.on('data', function(data) {
    //analyze game state and see if new turn is ready?
    socket.write(drawNewsRoom());
    recieveData(socket, data, turn);
    var coords = gameState.getCoords();
    console.log("Reading coords: " + util.inspect(gameState));
    if(coords.x === 0 && coords.y === 0){
      socket.write(drawDecisionMenu());
    }
    if(coords.x === 0 && coords.y === 1)
      socket.write(drawSigIntRoom());
    if(coords.x === 0 && coords.y === 2)
      socket.write(drawHumIntRoom());
    //should prob not increment every time input goes in, fix e.g.:
    //if data = option 5, then:
    turn += 1;
  });
  socket.on('end', function() {
    closeSocket(socket);
  });
}

var server = net.createServer(newSocket);


server.listen(1337);



//OLD CODE ZONE:
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

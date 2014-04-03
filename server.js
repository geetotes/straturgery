/*jslint node: true, sloppy: true, white: true, vars: true */

var net = require('net');
var colors = require('colors');
var sockets = [];

Date.prototype.getMonthName = function() {
  var months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return months[this.getMonth()];
};

//turn is an int
//time should go from a start date
function incrementTime(turn) {
  //months are zero based
  startDate = new Date(2007, 0, 1);
  //eventually, we will use the endDate condition to determine the end of the game
  endDate = new Date(2011, 0, 1);
  currentDate = new Date(startDate.getFullYear(), turn, startDate.getDate());
  return currentDate;
}

function drawBreak(cols, symbol) {
  var breaker = "";
  for(var i = 1; i < cols; i++) {
    breaker += symbol;
  }
  return breaker += "\n";
}

function cleanInput(data) {
  return data.toString().replace(/(\r\n|\n|\r)/gm,"");
}

function drawWelcome(){
  var welcome = "\x1B[31m";
  welcome += drawBreak(80, "-");
  welcome += "             Welcome to\n";
  welcome += "             STRATURGERY\n";
  welcome += drawBreak(80, "-");
  welcome += "\x1B[39m";
  welcome += "\x1B[3m\x1B[37m         The Game of Pulling Out\x1B[39m\x1B[23m\n";

  return welcome;
}

function drawNewsRoom(){
  var newsRoom = "";
  newsRoom += "TODAYS HEADLINES\n";
  newsRoom += drawBreak(80, "-");
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
  var currentDate = incrementTime(turn);
  socket.write("Today's Date: [" + currentDate.getMonthName() + " " + currentDate.getFullYear() +"]\n".zebra);



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

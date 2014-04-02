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

function cleanInput(data) {
  return data.toString().replace(/(\r\n|\n|\r)/gm,"");
}

function drawWelcome(){
  var welcome = "\x1B[31m";
  welcome += "-----------------------------------------\n";
  welcome += "             Welcome to\n";
  welcome += "             STRATURGERY\n";
  welcome += "-----------------------------------------\n";
  welcome += "\x1B[39m";
  welcome += "\x1B[3m\x1B[37m         The Game of Pulling Out\x1B[39m\x1B[23m";

  return welcome;
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
  socket.write(drawWelcome() + '\n');
  socket.on('data', function(data) {
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

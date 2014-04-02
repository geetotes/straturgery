/*jslint node: true, sloppy: true, white: true, vars: true */

var net = require('net');
var sockets = [];

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

function recieveData(socket, data, turn) {
  var cleanData = cleanInput(data);
  if (cleanData == "@quit") {
    socket.end('Goodbye!\n');
  }
  else {
    for (var i = 0; i<sockets.length; i++){
      if (sockets[i] !== socket) {
        sockets[i].write(data);
      }
      if (sockets[i] == socket) {
        sockets[i].write("You said: " + data);
      }
    }
  }
  //increment time
  //output time
  currentDate = incrementTime(turn);
  socket.write("\tDate: " + currentDate.toDateString());
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
  socket.write('Welcome!\n');
  socket.on('data', function(data) {
    recieveData(socket, data, turn);
    turn += 1;
  });
  socket.on('end', function() {
    closeSocket(socket);
  });
}

var server = net.createServer(newSocket);


server.listen(1337);

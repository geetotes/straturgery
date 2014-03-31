/*jslint node: true, sloppy: true, white: true, vars: true */

var net = require('net');
var sockets = [];


function cleanInput(data) {
  return data.toString().replace(/(\r\n|\n|\r)/gm,"");
}

function recieveData(socket, data) {
  var cleanData = cleanInput(data);
  console.log(data);
  console.log(cleanData);
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
}

function closeSocket(socket) {
  var i = sockets.indexOf(socket);
  if (i != -1) {
    sockets.splice(i, 1);
  }
}

function newSocket(socket) {
  sockets.push(socket);
  socket.write('Welcome!\n');
  socket.on('data', function(data) {
    recieveData(socket, data);
  });
  socket.on('end', function() {
    closeSocket(socket);
  });
}

var server = net.createServer(newSocket);


server.listen(1337);

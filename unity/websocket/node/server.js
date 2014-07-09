var ws = require('websocket.io');
var server = ws.listen(8000,function () {
    console.log("Websocket Server start");
  }
);

var connections = [];

server.on("connection",function(socket) {
   // console.log("message " + ":(" +socket.remoteAddress +' : '+ socket.remotePort+")");
    connections.push(socket);
    socket.on("message",function(data) {
        console.log("message " + data);
        broadcast(data);
      }
    );
  }
);

function broadcast(message,socket) {
    connections.forEach(function (con, i) {
        if (con != socket) {
            con.send(message);
        }
    });
};
var io = require('socket.io').listen(8000);

io.sockets.on("connection",function(socket) {
    socket.on("message",function(data) {
                console.log("message " + data);
                socket.emit(data);
            }
        );
      }
);
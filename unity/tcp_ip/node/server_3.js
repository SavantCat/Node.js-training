net = require('net');

var clinets = [];

var server = net.createServer(function (socket) {
  socket.write("Connect");
  
  clinets.push(socket);
  
  socket.on('data', function (data) {    
    console.log(data+"");
    socket.write(data);
  });
  
  socket.on('close', function () {
    console.log("Close");
    socket.write("end");
    socket.close();
  });
  socket.on('error', function (e) {
    console.log("error: "+e);
    socket.write("end");
  });
  socket.on('end', function () {
    console.log("end");
  });
}).listen(3000);

console.log("Chat server running at port 3000\n");
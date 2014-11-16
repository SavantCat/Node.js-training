var fs = require('fs');
var write;
var socketIO = require('socket.io');
var io = socketIO.listen(80);

console.log("Start server");

var name;
var buf = [];
io.sockets.on('connection', function(socket) {
    var address = socket.handshake.address;
    console.log("New connection from " + socket.id);
  // メッセージを受けたときの処理
  
  socket.on('start', function(data) {
    console.log(data);
    name = "out_"+data ;
    write = fs.createWriteStream('./'+name);
  });
  
  socket.on('message', function(data) {
    buf.push(data);
    fs.appendFileSync(name, data);
  });
  
  socket.on('message2', function(data) {
    console.log(">"+data+","+data.toString());
  });
  
  socket.on('end', function(data) {
    write.end();
    console.log(data);
    console.log(buf);
  }); 

  // クライアントが切断したときの処理
  socket.on('disconnect', function(){
    console.log("disconnect");
  });
});
var net = require('net');
 
var server = net.createServer(function(conn){
  console.log('server-> tcp server created');
 
  conn.on('data', function(data){
    console.log('server-> ' + data + ' from ' + conn.remoteAddress + ':' + conn.remotePort);
    conn.write('server -> Repeating: ' + data);
  });
  conn.on('close', function(){
    console.log('server-> client closed connection');
    server.close();
    server.end();
  });
  conn.on('end', function(){
    console.log('server-> server end');
    server.close();
    server.end();
  });
}).listen(3000);
 
console.log('listening on port 3000');
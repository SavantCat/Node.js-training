var net = require('net');

var str = "";
var c = 0;

var server = net.createServer(function(conn){
  console.log('server-> tcp server created');
 
  conn.on('data', function(data){
    console.log('server-> ' + data + ' from ' + conn.remoteAddress + ':' + conn.remotePort);
    conn.write(data);
    str = data+"";
   // console.log(str);
    
  });
  conn.on('close', function(){
    console.log('server-> client closed connection');
  });
  conn.on('end', function(){
    console.log('server-> server end');
    net.close();
    net.end();
  });
   
   setTimeout(function(){
	console.log(str);
        conn.write(str);
  },1000);
}).listen(3000);

server.on('end', function(){
 console.log('server-> server end');
 server.close();
 server.end();
});
console.log('listening on port 3000');
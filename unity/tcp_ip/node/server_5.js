net = require('net');

var port = 3000;
var host = '192.168.1.5';

var clients = [];
var number = 0;
var contact = null;

console.log('Start Node Server !!');
var server = net.createServer(function (socket) {
    socket.setEncoding("utf8");

    clients.push([number++,socket]);
    console.log("Connected "+"No. " + clients.length +" : (" +socket.remoteAddress +' : '+ socket.remotePort+")");
    socket.write(socket.remotePort+"");
        
    socket.on('data',function(message){//クライアントからの読み込み
        try{
            contact = JSON.parse(message);       
            console.log("name : "+contact.name);
            broadcast(message,socket);
        }catch(e){
            if (message == "close") {
                console.log('CLOSED: ' + socket.remoteAddress +' '+ socket.remotePort);
                server.close();
            }  
        }
    });
    
    socket.on('end', function() {
        console.log('CLOSED: ' + socket.remoteAddress +' '+ socket.remotePort);
        socket.end();
    });
    
    // Send a message to all clients
    function broadcast(message, sender) {
      for(var i in clients) {
        // Don't want to send it to sender
        if (clients[i][1] === sender)break;
        clients[i][1].write(message);
      }
      // Log it to the server output too
      console.log(clients[i][1].remoteAddress+" : "+message)
    }
    
}).listen(port,host);



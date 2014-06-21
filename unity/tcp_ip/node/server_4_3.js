net = require('net');

var port = 3000;
var host = '192.168.1.5';

var clients = [];
var number = 0;

console.log('Start Node Server !!');
var server = net.createServer(function (socket) {
    socket.setEncoding("utf8");

    clients.push([number++,socket]);
    console.log("Connected "+"No. " + clients.length +" : (" +socket.remoteAddress +' : '+ socket.remotePort+")");
    
    
    socket.write(socket.remotePort+"");
    
    socket.on('data',function(message){//クライアントからの読み込み
        //console.log(socket.remotePort+" -> "+message);
        var contact = JSON.parse(message);
        if (contact != null) {
            console.log("name : "+contact.name);
        }
       
        if (message == "close") {
            console.log('CLOSED: ' + socket.remoteAddress +' '+ socket.remotePort);
            socket.end();
        }else{
            if (clients.length > 0){
                if (clients[0][1] == socket) {
                    clients[1][1].write(message);
                    //console.log(clients[i].remotePort+" -> "+message);
                }
            }
        }
    });
    
    socket.on('end', function() {
        console.log('CLOSED: ' + socket.remoteAddress +' '+ socket.remotePort);
        socket.end();
    });
    
}).listen(port,host);
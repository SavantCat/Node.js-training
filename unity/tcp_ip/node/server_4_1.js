net = require('net');

var port = 3000;
var host = '127.0.0.1';

var clients = [];

console.log('Start Node Server !!');
var server = net.createServer(function (socket) {
    socket.setEncoding("utf8");

    server.on('connection',function(){//初期接続時のみコールバック
        var n = 0;
        if (n == 0) {
            clients.push(socket);
            console.log('CONNECT: ' + socket.remoteAddress +' '+ socket.remotePort);
            socket.write("CONECTED NODE.JS");
            n++;
        }else{
            clients.push(socket);
           // console.log('CONNECT: ' + socket.remoteAddress +' '+ socket.remotePort);
            socket.write("CONECTED NODE.JS");
            n++;
            for(var i in clients){
                if (clients[i] == socket) {
                    console.log('Destroy: ' +  clients[i].remoteAddress +' '+  clients[i].remotePort);
                    clients[i].destroy();
                    n--;
                }
            }  
        }
    });
    
    socket.on('data',function(message){//クライアントからの読み込み
        if (message == "close") {
            console.log('CLOSED: ' + socket.remoteAddress +' '+ socket.remotePort);
            socket.end();
        }else{
            socket.write(message);
            console.log("message -> "+message);
        }
    });
    
    socket.on('end', function() {
        console.log('CLOSED: ' + socket.remoteAddress +' '+ socket.remotePort);
        socket.end();
    });
    
}).listen(port,host);
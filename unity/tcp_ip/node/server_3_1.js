net = require('net');

var port = 3000;
var host = '127.0.0.1';

var clients = [];

console.log('Start Node Server !!');
var server = net.createServer(function (socket) {
    socket.setEncoding("utf8");

    server.on('connection',function(){//初期接続時のみコールバック
        clients.push(socket);
        socket.write("CONECTED NODE.JS");
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
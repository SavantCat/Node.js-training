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
            if (clients.length > 0){
                if (clients[0][1] == socket) {
                    clients[1][1].write(message);
                    console.log(clients[0][1].remotePort+" -> "+message);
                }
            }
        }catch(e){
            if (message == "close") {
                console.log('CLOSED: ' + socket.remoteAddress +' '+ socket.remotePort);
                socket.end();
            }  
        }
    });
    
    socket.on('end', function() {
        console.log('CLOSED: ' + socket.remoteAddress +' '+ socket.remotePort);
        socket.end();
    });
    
}).listen(port,host);
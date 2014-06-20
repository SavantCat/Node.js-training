net = require('net');

var port = 3000;
var host = '192.168.1.5';

var clients = [];

console.log('Start Node Server !!');
var server = net.createServer(function (socket) {
    socket.setEncoding("utf8");

    clients.push(socket);
    console.log("CONNECT "+"No. " + clients.length +" : (" +socket.remoteAddress +' : '+ socket.remotePort+")");
    
    /*
    console.log("---------------------------------");
    for(var i in clients){
        console.log("CONNET: " +"No. "+i+" " + clients[i].remoteAddress +" "+ clients[i].remotePort);
    }
    console.log("---------------------------------");
    */
    
    socket.write("CONECTED : "+port+"<-"+socket.remotePort);
    /*
    server.on('connection',function(){//接続コールバック
        clients.push(socket);
        console.log("CONNECT"+"No. " + clients.length +" : (" +socket.remoteAddress +' : '+ socket.remotePort+")");
        socket.write("CONECTED : "+port+"<-"+socket.remotePort);
    });
    */
    socket.on('data',function(message){//クライアントからの読み込み
        //console.log("SEND");
        if (message == "close") {
            console.log('CLOSED: ' + socket.remoteAddress +' '+ socket.remotePort);
            socket.end();
        }else{
            if (clients.length > 0){
                for(var i in clients){
                    if (clients[i] != socket) {
                        break;
                    }
                    clients[i].write(message);
                    console.log(clients[i].remotePort+" -> "+message);
                }
            }
        }
    });
    
    socket.on('end', function() {
        console.log('CLOSED: ' + socket.remoteAddress +' '+ socket.remotePort);
        socket.end();
    });
    
}).listen(port,host);
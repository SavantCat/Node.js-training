net = require('net');

var port = 3000;
var host = '';

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
    server.on('connection',function(){//�ڑ��R�[���o�b�N
        clients.push(socket);
        console.log("CONNECT"+"No. " + clients.length +" : (" +socket.remoteAddress +' : '+ socket.remotePort+")");
        socket.write("CONECTED : "+port+"<-"+socket.remotePort);
    });
    */
    socket.on('data',function(message){//�N���C�A���g�����̓ǂݍ���
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

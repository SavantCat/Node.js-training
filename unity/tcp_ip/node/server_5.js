net = require('net');

var port = 3000;
var host = '192.168.1.5';

var clients = null;
var number = 0;
var contact = null;

console.log('Start Node Server !!');
var server = net.createServer(function (socket) {
    socket.setEncoding("utf8");
        
    socket.on('data',function(message){//クライアントからの読み込み
        

        
        try{
            contact = JSON.parse(message);       
           // console.log("name : "+contact.name);
            if (contact.type == "setup") {
                console.log("C");
                if (clients == null) {
                    console.log("A");
                    clients = [[contact.name,socket]];
                }else{
                    console.log("B");
                    for(var i in clients){
                        if (contact.name == clients[i][0] && socket != clients[i][1]) {
                            clients[i].push(socket);
                            console.log("add");
                        }else{
                            clients.push([contact.name,socket]);
                            socket.write(socket.remotePort+"");
                            console.log("Connected "+"No. " + clients.length +" : (" +socket.remoteAddress +' : '+ socket.remotePort+")");
                        }
                    }
                }
            }else if (contact.type == "send") {
                broadcast(clients[contact.name],message,socket);
            }
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
    function broadcast(clinets_data,message, sender) {
      for(var i=1 in clinets_data) {
        // Don't want to send it to sender
        if (clinets_data[i] != sender){;
            clinets_data[i].write(message)
        };
      }
      // Log it to the server output too
      console.log(clients[i][1].remoteAddress+" : "+message)
    }
    
}).listen(port,host);



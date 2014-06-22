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
            if (contact.type == "setup") {
                console.log("A");
                if (clients == null) {
                    //console.log("B");
                    clients = [[contact.name,socket]];
                    //socket.write(socket.remotePort);
                   // console.log("Connected "+"No. " + contact.name +" : (" +socket.remoteAddress +' : '+ socket.remotePort+")");
                }else{
                    console.log("C");
                    var f = 0;
                    for(var i in clients){
                        if (contact.name == clients[i][0] && socket != clients[i][1]) {
                            clients[i].push(socket);
                           // console.log("D");
                            socket.write(socket.remotePort+"");
                            //console.log("Connected "+"No. " + contact.name +" : (" +socket.remoteAddress +' : '+ socket.remotePort+")");
                            f = 1;
                            break;
                        }
                    }
                    if (f === 0) {
                        clients.push([contact.name,socket]);
                        socket.write(socket.remotePort+"");
                        //console.log("Connected "+"No. " + contact.name +" : (" +socket.remoteAddress +' : '+ socket.remotePort+")");
                    }
                }
                console.log("Connected "+"No. " + contact.name +" : (" +socket.remoteAddress +' : '+ socket.remotePort+")");
            }
            if(contact.type == "send") {
                //console.log("SEND: "+clients[contact.name][0]+" "+clients[contact.name][1].remotePort+" "+clients[contact.name][2].remotePort);
                broadcast(clients[contact.name],message,socket);
            }
        }catch(e){
            console.log("message -> "+e);
        }
    });
    
    socket.on('end', function() {
        for(var i in clients){
            for(var j=1;j<clients[i].length;j++){
                clients[i][j].close();
            }
        }
        console.log("Exit server!!");
        process.exit();
    });
    
    // Send a message to all clients
    function broadcast(clinets_data, message, sender) {
      for(var i = 1; i < clinets_data.length;i++) {
        
        // Don't want to send it to sender
       console.log("A:"+i);
        if (clinets_data[i] != sender){
            console.log("B:"+clinets_data[i].remotePort);
            clinets_data[i].write(message);
        }
      }
      // Log it to the server output too
      console.log(clients[i][1].remoteAddress+" : "+message)
    }
    
}).listen(port,host);
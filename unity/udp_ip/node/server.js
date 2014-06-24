var port = 3000;
var host = '192.168.24.239';

var clients = null;
var number = 0;
var contact = null;

console.log('Start Node Server !!');
var dgram = require("dgram");
var server = dgram.createSocket("udp4");

server.on("listening", function () {
  var address = server.address();
  console.log("server listening " +
      address.address + ":" + address.port);
});

server.on('data',function(message,socket){
        try{
            contact = JSON.parse(message);
            if (contact.type == "setup") {
                if (clients == null) {
                    clients = [[contact.name,socket]];
                }else{
                    var f = 0;
                    for(var i in clients){
                        if (contact.name == clients[i][0] .address().port&& socketr.address().port != clients[i][1].port) {
                            clients[i].push(socket);
                            f = 1;
                            break;
                        }
                    }
                    if (f === 0) {
                   clients.push([contact.name,socket]);
                    }
                }
                show_port();
            }
            if(contact.type == "send") {               broadcast(contact.name,clients[contact.name],message,socket);
            }
        }catch(e){
            console.log("message -> "+e);
        }
    });
    
    server.on('end', function() {
        server.close();
        console.log("Exit server!!");
        process.exit();
    });
    
    // Send a message to all clients
    function broadcast(id, clinets_data, message, sender) {
      for(var i = 1; i < clinets_data.length;i++) {
        if (clinets_data[i][1].address().port != sender.address().port){
            server.write(message,0,message.length,clients_data[i][1].address().port);
        }
      }
    }
    
    function show_port() {
        console.log("----------------------");
        for(var i in clients){
            console.log("*********");
            var show = "["+clients[i][0].address().port",";
            for(var j=1;j<clients[i].length;j++){
                show += clients[i][j].address().port",";
            }
            show = show.slice(0, -1);
            show += "]";
            console.log(show);
            console.log("*********");
        }
        console.log("----------------------");
    }
    
server.bind(port,host);



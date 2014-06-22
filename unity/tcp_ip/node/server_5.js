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
                //console.log("A");
                if (clients == null) {
                    //console.log("B");
                    clients = [[contact.name,socket]];
                    //socket.write(socket.remotePort);
                    //console.log("Connected "+"No. " + contact.name +" : (" +socket.remoteAddress +' : '+ socket.remotePort+")");
                }else{
                    //console.log("C");
                    var f = 0;
                    for(var i in clients){
                        console.log(i+":"+contact.name+" "+clients[i][0]+" "+socket.remotePort+" "+clients[i][1].remotePort);
                        if (contact.name == clients[i][0] && socket.remotePort != clients[i][1].remotePort) {
                            clients[i].push(socket);
                            console.log("D");
                            //socket.write(socket.remotePort+"");
                            //console.log("Connected "+"No. " + contact.name +" : (" +socket.remoteAddress +' : '+ socket.remotePort+")");
                            f = 1;
                            break;
                        }
                    }
                    
                    if (f === 0) {
                        clients.push([contact.name,socket]);
                        //socket.write(socket.remotePort+"");
                        //console.log("Connected "+"No. " + contact.name +" : (" +socket.remoteAddress +' : '+ socket.remotePort+")");
                    }
                }
               // console.log("Connected "+"No. " + contact.name +" : (" +socket.remoteAddress +' : '+ socket.remotePort+")");
                show_port();
            }
            if(contact.type == "send") {
                //console.log("SEND: "+contact.name)
                broadcast(contact.name,clients[contact.name],message,socket);
            }
        }catch(e){
            console.log("message -> "+e);
        }
    });
    
    socket.on('drain', function() {
        console.log("complete");
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
    function broadcast(id, clinets_data, message, sender) {
    //console.log("broadcast");
      for(var i = 1; i < clinets_data.length;i++) {
        
        // Don't want to send it to sender
       //console.log("A:"+i);
        if (clinets_data[i] != sender){
            //console.log("B:"+clinets_data[i].remotePort);
            clinets_data[i].write(message);
            console.log("ObjctID: " + id +", Port: "+ sender.remotePort + " -> " + clients[i][1].remotePort+" : "+message);
        }
      }
      // Log it to the server output too
      //console.log(clients[i][1].remoteAddress+" : "+message)
    }
    
    function show_port() {
        console.log("----------------------");
        for(var i in clients){
            console.log("*********");
            var show = "["+clients[i][0]+",";
            for(var j=1;j<clients[i].length;j++){
                show += clients[i][j].remotePort+",";
            }
            show = show.slice(0, -1);
            show += "]";
            console.log(show);
            console.log("*********");
        }
        console.log("----------------------");
    }
    
}).listen(port,host);



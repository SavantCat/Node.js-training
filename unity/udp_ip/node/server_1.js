var port = 3000;
var host = '192.168.1.5';

var clients = null;
var number = 0;
var contact = null;

console.log('Start Node Server !!');
var dgram = require("dgram");

var server = dgram.createSocket("udp4");

server.on("listening", function () {
  var address = server.address();
  console.log("server listening " + address.address + ":" + address.port);
});

server.on("message", function (msg, rinfo) {
  //console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
  try{
      contact = JSON.parse(msg);
      if (contact.type == "setup") {
          if (clients == null) {
              clients = [[contact.ID,[rinfo.address,rinfo.port]]];
          }else{
              var f = 0;
              for(var i in clients){
                if (contact.ID == clients[i][0]){
                  f = 1;
                  for(var j = 1 in clients[i]){
                    if(rinfo.port == clients[i][j][1]) {
                      f = 2;
                      break;
                    }
                  }
                }
                break;
              }
              
              if (f == 0) {
                clients.push([contact.ID,[rinfo.address,rinfo.port]]);
              }else if (f == 1){
                clients[i].push([rinfo.address,rinfo.port]);
              }
          }
          //console.log(clients);
          //show_port();
      }
      if(contact.type == "send") {
        broadcast(contact.ID,msg,rinfo.port);
      }
  }catch(e){
      console.log("message -> "+e);
  }
  
});

server.on("error", function (err) {
  console.log("server error:\n" + err.stack);
  server.close();
});

function broadcast(id, message, sender_port) {
  var f = 0;
  for(var i = 0; i<clients.length; i++){
    if(id == clients[i][0]){
      for(var j = 1; j<clients[i].length; j++){
        //console.log(sender_port + " : " + clients[i][j][1]);
        if(sender_port != clients[i][j][1]) {
          server.send(message,0,message.length,clients[i][j][1],clients[i][j][0]);
          //console.log("server send: " + message + " to " + clients[i][j][0] + ":" + clients[i][j][1]);
        }
      }
    }
  }
}

function show_port() {
    console.log("----------------------");
    for(var i in clients){
        console.log("*********");
        var show = "["+clients[i][0].address().port+",";
        for(var j=1;j<clients[i].length;j++){
            show += clients[i][j].address().port+",";
        }
        show = show.slice(0, -1);
        show += "]";
        console.log(show);
        console.log("*********");
    }
    console.log("----------------------");
}

server.bind(port,host);
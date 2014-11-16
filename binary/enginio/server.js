var fs = require('fs');
var write = fs.createWriteStream('./writetest');

var engine = require('engine.io');
var server = engine.listen(80);

console.log("Start server");
server.on('connection', function(socket){
    console.log("conected:"+socket.adress);
    socket.send('connect');    
    socket.on('message',function(data){
        //console.log(data);
        if (data) {
            //code
        }
        fs.appendFile('writetest', data , function (err) {
            //console.log(err);
        });
    });
    socket.on('close', function(){
         console.log("disconnected");
    });
});
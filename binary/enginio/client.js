
 
 
 var socket = require('engine.io-client')('ws://localhost:80');
 socket.on('open', function(){
    socket.on('message', function(data){
         console.log(data);
    });
    socket.on('close', function(){
         console.log("disconnected");       
    });
 });
 
var path = require('path')
var fs   = require('fs')




 
process.stdin.resume();
process.stdin.setEncoding('utf8');

// 標準入力がくると発生するイベント
process.stdin.on('data', function (chunk) {
    chunk.trim().split('\n').forEach(function(line) {
        // 1行ずつ表示
        var filePath = path.join(__dirname, line);
        var readStream = fs.createReadStream(filePath);
        readStream.on('data', function(data){
            //console.log(data);
            socket.send(data);
        });
        readStream.on('end', function(){
            console.log('end');
           
        });
        readStream.on('error', function(err){
            console.log('An error occurred');
            console.log(err);
        });
        
    });
});
// EOFがくると発生するイベント
process.stdin.on('end', function (data) {
    
});
var path = require('path')
var fs   = require('fs')
var io = require('socket.io-client');
var socket = io.connect('http://localhost:80');

console.log("Start cilent");

socket.on('connect', function(){
    
});
socket.on('message', function(data){
    console.log(data);
});
socket.on('disconnect', function(){
    
});

process.stdin.resume();
process.stdin.setEncoding('utf8');



// 標準入力がくると発生するイベント
process.stdin.on('data', function (chunk) {
    chunk.trim().split('\n').forEach(function(line) {
        // 1行ずつ表示
        var filePath = path.join(__dirname, line);
        var readStream = fs.createReadStream(filePath);
        socket.emit('start',line);
        
        readStream.on('data', function(data){
            //console.log(data);
            socket.emit('message',data);
        });
        readStream.on('end', function(){
            socket.emit('end',"end");
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
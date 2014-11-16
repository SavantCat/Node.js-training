var io = require('socket.io-client');
var socket = io.connect('http://localhost:80');

console.log("Start cilent2");

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
        var buf = new Buffer(line);
        console.log(">"+line);
        console.log(">"+buf);
        socket.emit('message2',buf);
    });
});
// EOFがくると発生するイベント
process.stdin.on('end', function (data) {
    
});
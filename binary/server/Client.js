process.stdin.resume();
process.stdin.setEncoding('utf8');

var ws = require('websocket.io')
 var soket = ws.Socket('ws://localhost:3000/');

     soket.on('message', function (data) {
        console.log(data);
    });
  
    soket.on('close', function () {
        console.log('Disconnected');   
    });

// 標準入力がくると発生するイベント
process.stdin.on('data', function (chunk) {
    chunk.trim().split('\n').forEach(function(line) {
        // 1行ずつ表示
        console.log('>' + line);
        ws.send(line);
    });
});
// EOFがくると発生するイベント
process.stdin.on('end', function (data) {
    
});

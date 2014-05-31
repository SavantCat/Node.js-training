// UDP を利用した Echo サーバプログラム
var dgram = require('dgram');
var socket = dgram.createSocket('udp4');
var readline = require('readline');

var host = 'localhost';
var port = 30922;

// bind関数が呼び出されたときに実行されるイベント
socket.on('listening' , function() {
  var addr = socket.address();
  console.log('UDP socket listening on ' + addr.address + ':' + addr.port);
});

// メッセージ受信時のイベント処理
socket.on('message', function(msg, rinfo) {
  console.log(rinfo.size + ' bytes received from ' + rinfo.address + ':' + rinfo.port);
  console.log(msg.toString());
  // メッセージをクライアントに送り返す
  socket.send(msg, 0, msg.length, rinfo.port, rinfo.address);
});

// サーバソケットクローズ時のイベント
socket.on('close', function() {
  console.log('UDP socket closed.');
});

// listen ソケットを30922 ポートにアサイン
socket.bind(port, host);

// Control-c でサーバソケットをクローズします
var rl = readline.createInterface(process.stdin, process.stdout);
rl.on('SIGINT', function() {
  socket.close();
  rl.close();
});

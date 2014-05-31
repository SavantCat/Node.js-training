// UDPによるエコーサーバーの実装
var dgram = require('dgram');
var socket = dgram.createSocket('udp4');
var readline = require('readline');

var host = 'localhost';
var port = 30922;
var interval = 1000; // 1秒間隔でデータ送信

// Echo 受信用イベントハンドラ
socket.on('message', function(msg, rinfo) {
  console.log(rinfo.size + ' bytes received from ' + rinfo.address + ':' + rinfo.port);
  console.log(msg.toString());
});

// サーバソケットクローズ時のイベント
socket.on('close', function() {
  console.log('UDP socket closed.');
});

// 1秒ごとに'Hello World'をサーバに送信
var tmout = setInterval(function() {
  var buf = new Buffer('Hello World');
  socket.send(buf, 0, buf.length, port, host, function() {
    // 送信終了時のコールバック
  });
}, interval);

// Control-c でサーバソケットをクローズします
var rl = readline.createInterface(process.stdin, process.stdout);
rl.on('SIGINT', function() {
  clearTimeout(tmout);
  socket.close();
  rl.close();
});

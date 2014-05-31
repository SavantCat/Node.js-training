// TCPによるエコーサーバーの実装(ランダムにデータ送信を止める版)
var net = require('net');
var readline = require('readline');

var server = net.createServer();
server.maxConnections = 3;

// クライアントコンストラクタ
function Client(socket) {
  this.counter = 0;
  this.socket = socket;
  this.t_queue = {};
  // socketのpause/resumeを実行するタイマーオブジェクトを保管
  this.tmout = null;
}

Client.prototype.writeData = function(d, id) {
  var socket = this.socket;
  var t_queue = this.t_queue;
  if (socket.writable) {
    var key = socket.remoteAddress + ':' + socket.remotePort;
    socket.write('[R] ' + d, function() {
      delete t_queue[id];
    });
    process.stdout.write(key + ' ' + socket.bytesWritten + ' bytes Written\n');
  }
};

var clients = {};

// クライアント接続時のイベント (1)
// 接続開始のログ
server.on('connection', function(socket) {
  var status = server.connections + '/' + server.maxConnections;
  var key = socket.remoteAddress + ':' + socket.remotePort;
  console.log('Connection Start(' + status + ') - ' + key);
  clients[key] = new Client(socket);
  // 10msec秒後からソケットを停止・再開をランダムに繰り返す
  controlSocket(clients[key], 'pause', 10);
});

// ソケットの停止・再開を制御を行う関数
// delay後にランダムな時間間隔でsocketのpause/resumeを繰り返す
// pause時間:最大3秒間, resume時間:最大10秒間
function controlSocket(client, action, delay) {
  var socket = client.socket;
  var key = socket.remoteAddress + ':' + socket.remotePort;
  if (action === 'pause') {
    socket.pause();
    console.log(key + ' socket paused');
    client.tmout = setTimeout(function() {
      controlSocket(client, 'resume', Math.random() * 3 * 1000);
    }, delay);
  } else if (action === 'resume') {
    socket.resume();
    console.log(key + ' socket resumed');
    client.tmout = setTimeout(function() {
      controlSocket(client, 'pause', Math.random() * 10 * 1000);
    }, delay);
  }
}

server.on('connection', function(socket) {
  var data = '';
  var newline = /\r\n|\n/;
  socket.on('data', function(chunk) {
    data += chunk.toString();
    var key = socket.remoteAddress + ':' + socket.remotePort;
    if (newline.test(data)) {
      clients[key].writeData(data);
      process.stdout.write(key + ' ' + socket.bytesRead + ' bytes Read\n');
      data = '';
    }
  });
});

server.on('connection', function(socket) {
  var key = socket.remoteAddress + ':' + socket.remotePort;
  socket.on('end', function() {
    var status = server.connections + '/' + server.maxConnections;
    console.log('Connection End(' + status + ') - ' + key);
    // socketのpause/resumeするタイマーオブジェクトをクリアする
    if (clients[key].tmout) {
      clearTimeout(clients[key].tmout);
    }
    delete clients[key];
  });
});

server.on('close', function() {
  console.log('Server Closed');
});

server.listen(11111, function() {
  var addr = server.address();
  console.log('Listening Start on Server - ' +
              addr.address + ':' + addr.port);
});

var rl = readline.createInterface(process.stdin, process.stdout);

rl.on('SIGINT', function() {
  for (var i in clients) {
    if (clients[i].tmout) {
      clearTimeout(clients[i].tmout);
    }
    var socket = clients[i].socket;
    var t_queue = clients[i].t_queue;
    socket.end();
    for (var id in t_queue) {
      clearTimeout(t_queue[id]);
    }
  }
  server.close();
  rl.close();
});

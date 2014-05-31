// SSL/TLS によるエコーサーバーの実装
var tls = require('tls');
var fs = require('fs');
var readline = require('readline');

// TLS証明書関連のオプション指定が必須
var server = tls.createServer({
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem')
});
server.maxConnections = 3;

function Client(cleartextStream) {
  this.cleartextStream = cleartextStream;
}

Client.prototype.writeData = function(d) {
  var cleartextStream = this.cleartextStream;
  if (cleartextStream.writable) {
    var key = cleartextStream.remoteAddress + ':' + cleartextStream.remotePort;
    console.log('[' + key + '] - ' + d.toString());
    cleartextStream.write(d);
  }
};

var clients = {};

// tcpサーバと異なり secureConnection イベントで受ける
server.on('secureConnection', function(cleartextStream) {
  var status = server.connections + '/' + server.maxConnections;
  var key = cleartextStream.remoteAddress + ':' + cleartextStream.remotePort;
  // 使用している暗号種別を取得する
  var cipher = cleartextStream.getCipher();
  var cipher_info = cipher.name + ' ' + cipher.version;
  console.log('Start TLS Connection(' + status + ') - ' + key + ' ' + cipher_info);
  clients[key] = new Client(cleartextStream);
  cleartextStream.on('error', function(e) {
    console.log(e.message);
  });
});

server.on('secureConnection', function(cleartextStream) {
  cleartextStream.on('data', function(chunk) {
    var key = cleartextStream.remoteAddress + ':' + cleartextStream.remotePort;
    clients[key].writeData(chunk);
  });
});

server.on('secureConnection', function(cleartextStream) {
  var key = cleartextStream.remoteAddress + ':' + cleartextStream.remotePort;
  cleartextStream.on('end', function() {
    var status = server.connections + '/' + server.maxConnections;
    console.log('TLS Connection End(' + status + ') - ' + key);
    delete clients[key];
  });
});

server.listen(3333, function() {
  var addr = server.address();
  console.log('Listening Start on TLS Server - ' +
              addr.address + ':' + addr.port);
});

server.on('close', function() {
  console.log('TLS Server Closed');
});

var rl = readline.createInterface(process.stdin, process.stdout);
rl.on('SIGINT', function() {
  for (var i in clients) {
    var cleartextStream = clients[i].cleartextStream;
    cleartextStream.end();
  }
  server.close();
  rl.close();
});

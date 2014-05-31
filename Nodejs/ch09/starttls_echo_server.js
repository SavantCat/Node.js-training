// SSL/TLS によるエコーサーバーの実装 (STARTTLS対応版)
var net = require('net');
var tls = require('tls');
var crypto = require('crypto');
var fs = require('fs');
var readline = require('readline');

var server = net.createServer();
server.maxConnections = 3;
var clients = {};

function Client(socket) {
  this.secured = false; // TLS接続の有無を示すフラグ
  this.socket = socket; // 通信で扱うソケット
  this.handle = socket; // 通信データを担うハンドル
}

Client.prototype.setHandle = function(handle) {
  this.handle = handle;
};

// handleに対してデータの書き込みを行う。
Client.prototype.writeData = function(d) {
  var handle = this.handle;
  if (handle.writable) {
    var key = handle.remoteAddress + ':' + handle.remotePort;
    var status = this.secured ? 'Encrypted' : 'Plain';
    process.stdout.write('[' + key + ' ' + status + '] - ' + d.toString());
    handle.write(d);
  }
};

server.on('connection', function(socket) {
  var status = server.connections + '/' + server.maxConnections;
  var key = socket.remoteAddress + ':' + socket.remotePort;
  console.log('Start TCP Connection(' + status + ') - ' + key);

  // クライアントから接続毎にクライアントオブジェクトを生成
  var client = new Client(socket);
  clients[key] = client;

  // TCP接続時の受信データ取得と送信データの書き込み処理
  socket.on('data', function listener(chunk) {
    // STARTTLS文字コマンドをトリガーにしてTLS接続に移行
    if (chunk.toString() === 'STARTTLS\r\n') {
      client.writeData(chunk);
      socket.removeListener('data', listener);
      socket.emit('starttls', client);
    } else {
      client.writeData(chunk);
    }
  });
  
  socket.on('end', function() {
    var status = server.connections + '/' + server.maxConnections;
    console.log('Connection End(' + status + ') - ' + key);
    delete clients[key];
  });
  // TLS処理の開始
  socket.on('starttls', function(client) {
    console.log('[' + key + ' STARTTLS]');

    // securePairを生成
    var sslcontext = crypto.createCredentials({
      key: fs.readFileSync('server-key.pem'),
      cert: fs.readFileSync('server-cert.pem')
    });
    var pair = tls.createSecurePair(sslcontext, true);

    // socketとsecurePairを pipe でつなげる
    var cleartext = pipe(pair, socket);

    // データ通信を扱うハンドルをcleartextに変更する
    client.setHandle(cleartext);

    // TLS接続完了時の処理
    pair.on('secure', function() {
      console.log('TLS Established');
      client.secured = true;
      // TLS署名検証結果の確認
      var verifyError = pair.ssl.verifyError();
      if (verifyError) {
        cleartext.authorized = false;
        cleartext.authorizationError = verifyError;
      } else {
        cleartext.authorized = true;
      }
      cleartext._controlReleased = true;
    });
    pair.on('error', function(e) {
      process.stderr.write(e);
      pair.destory();
    });

    // TLS接続時の受信データ取得と送信データの書き込み処理
    cleartext.on('data', function(chunk) {
      client.writeData(chunk);
    });
    cleartext.on('error', function(e) {
      process.stderr.write(e);
      cleartext.destory();
    });
  });
});

server.listen(3333, function() {
  var addr = server.address();
  console.log('Listening Start on TCP Server - ' +
              addr.address + ':' + addr.port);
});

server.on('close', function() {
  console.log('Server Closed');
});

var rl = readline.createInterface(process.stdin, process.stdout);
rl.on('SIGINT', function() {
  for (var i in clients) {
    var socket = clients[i].socket;
    socket.end();
  }
  server.close();
  rl.close();
});

// Nodeのソース中lib/tls.jsから流用したコード
function pipe(pair, socket) {
// pairとsocketをつなげる処理
  pair.encrypted.pipe(socket);
  socket.pipe(pair.encrypted);
  pair.fd = socket.fd;
  var cleartext = pair.cleartext;
  cleartext.socket = socket;
  cleartext.encrypted = pair.encrypted;
  cleartext.authorized = false;

// error,timeout,closeイベントハンドラの登録削除
  function onerror(e) {
    if (cleartext._controlReleased) {
      cleartext.emit('error', e);
    }
  }

  function onclose() {
    socket.removeListener('error', onerror);
    socket.removeListener('end', onclose);
    socket.removeListener('timeout', ontimeout);
  }

  function ontimeout() {
    cleartext.emit('timeout');
  }

  socket.on('error', onerror);
  socket.on('close', onclose);
  socket.on('timeout', ontimeout);

  return cleartext;
}

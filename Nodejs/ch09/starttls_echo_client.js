// SSL/TLS によるエコークライアントの実装 (STARTTLS対応版)
var net = require('net');
var tls = require('tls');
var crypto = require('crypto');
var fs = require('fs');
var readline = require('readline');

var options = {};
options.host = process.argv[2];
options.port = process.argv[3];

function Client(socket) {
  this.secured = false; // TLS接続の有無を示すフラグ
  this.handle = socket; // 通信データを担うハンドル
}

Client.prototype.setHandle = function(handle) {
  this.handle = handle;
};

// handleに対してデータの書き込みを行う。
Client.prototype.writeData = function(d) {
  var handle = this.handle;
  if (handle.writable) {
    var status = this.secured ? 'Encrypted' : 'Plain';
    process.stdout.write('[' + status + ' S] ' + d);
    handle.write(d);
  }
};

var socket = net.connect(options);
var client = new Client(socket);

socket.on('error', function(err) {
  console.error('Connection Failed - ' + options.host + ':' + options.port);
  console.error(err);
});

socket.on('connect', function() {
  console.log('Connected - ' + options.host + ':' + options.port);
  // 3.5秒後にSTARTTLS文字コマンドを送信
  setTimeout(function() {
    client.writeData('STARTTLS\r\n');
  }, 3500);
});

var rl = readline.createInterface(process.stdin, process.stdout);
rl.on('SIGINT', function() {
  console.log('Closing - ' + options.host + ':' + options.port);
  socket.end();
  rl.close();
});

// 1秒ごとにtimeoutするように設定して
// 'Hello World' をサーバに送信
var i = 0;  // 送信順番
socket.setTimeout(1000);

socket.on('timeout', function() {
  var str = i + ': Hello World\n';
  client.writeData(str);
  i = i + 1;
});

socket.on('data', function listener(chunk) {
  process.stdout.write('[Plain R] ' + chunk);
  // STARTTLS文字コマンドをトリガーにしてTLS接続に移行
  if (chunk.toString() === 'STARTTLS\r\n') {
    socket.removeListener('data', listener);
    socket.emit('starttls', client);
  }
});

// TLS処理の開始
socket.on('starttls', function(client) {
  console.log('STARTTLS');
  
  // securePairを生成
  var sslcontext = crypto.createCredentials({
    ca: fs.readFileSync('server-cert.pem')
  });
  var pair = tls.createSecurePair(sslcontext, false);
  
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
    console.log('TLS Established. authorized:' + cleartext.authorized);
  });

  // TLS接続時の受信データ取得と送信データの書き込み処理
  cleartext.on('data', function(chunk) {
    process.stdout.write('[Encrypted R] ' + chunk);
  });
});

socket.on('end', function(had_error) {
  socket.setTimeout(0);
  console.log('Connection End - ' + options.host + ':' + options.port);
});

socket.on('close', function() {
  console.log('Socket Closed');
  rl.close();
});

// Nodeのソース中lib/tls.jsから流用したコード
function pipe(pair, socket) {
  pair.encrypted.pipe(socket);
  socket.pipe(pair.encrypted);

  pair.fd = socket.fd;
  var cleartext = pair.cleartext;
  cleartext.socket = socket;
  cleartext.encrypted = pair.encrypted;
  cleartext.authorized = false;

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

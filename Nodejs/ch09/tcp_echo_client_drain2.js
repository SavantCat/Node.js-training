// TCPによるエコークライアントの実装(drain対応版)
var net = require('net');
var readline = require('readline');

var options = {};
options.host = process.argv[2];
options.port = process.argv[3];

var client = net.createConnection(options);

client.on('error', function(e) {
  console.error('Connnection Failed - ' + options.host + ':' + options.port);
  console.error(e.message);
});

client.on('connect', function() {
  console.log('Connected - ' + options.host + ':' + options.port);
});

var rl = readline.createInterface(process.stdin, process.stdout);
rl.on('SIGINT', function() {
  console.log('Connection Closed - ' + options.host + ':' + options.port);
  client.end();
  rl.close();
});

client.setTimeout(1000);
client.on('timeout', function() {
  var str = '';
  for (var i = 0; i < 20000; i++) {
    str += 'Hello World,';
  }
  str += '\n';
  var ret = client.write(str);
  // データの送信が滞った場合タイマーをクリアして書き込みを停止する
  if (!ret) {
    client.setTimeout(0);
  }
  process.stdout.write('write:' + ret + ', ' +
                       client.bytesWritten + 'bytesWritten, bufferSize:' +
                       client.bufferSize + 'byte\n');
});

client.on('drain', function() {
  console.log('drain emitted');
  // データの溜りが解消したら再度1秒毎にデータを送信する
  client.setTimeout(1000);
});

// クライアントソケット終了時のイベント
client.on('end', function(had_error) {
  client.setTimeout(0);
  console.log('Connection End - ' + options.host + ':' + options.port);
});

client.on('close', function() {
  console.log('Client Closed');
  rl.close();
});

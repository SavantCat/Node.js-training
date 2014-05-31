// TCPによるエコークライアントの実装(大量データ送信版)
var net = require('net');
var readline = require('readline');

var options = {};
options.host = process.argv[2];
options.port = process.argv[3];

var client = net.connect(options);

client.on('error', function(e) {
  console.error('Connection Failed - ' + options.host + ':' + options.port);
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
  // 小さいデータではOSでバッファされるため、2万個の
  // 文字列を連結して送信データ量を大きくする
  for (var i = 0; i < 20000; i++) {
    str += 'Hello World,';
  }
  str += '\n';
  var ret = client.write(str);
  // 返り値、書き込みバイト数、バッファサイズを出力する
  process.stdout.write('write:' + ret + ', ' +
                       client.bytesWritten + 'bytesWritten, bufferSize:' +
                       client.bufferSize + 'byte\n');
});

// 溜まっている送信データが捌けた際にdrainイベントが発生する
client.on('drain', function() {
  console.log('drain emitted');
});

client.on('end', function(had_error) {
  client.setTimeout(0);
  console.log('Connection End - ' + options.host + ':' + options.port);
});

client.on('close', function() {
  console.log('Client Closed');
  rl.close();
});

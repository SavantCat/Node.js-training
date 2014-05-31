var http = require('http');
var child = require('child_process').fork(__dirname + '/socket-worker.js');

// サーバを定義
var server = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  console.log('\033[32m' + 'Master' + '\033[39m');
  res.end('Hello Master\n');
});

// 3000 をリッスン
server.listen(3000, function() {
  // ハンドラを子プロセスに渡す。
  child.send('serverHandle', server._handle);
});

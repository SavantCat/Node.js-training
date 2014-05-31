var http = require('http');
// 親プロセスからのメッセージを受信
process.on('message', function(message, serverHandle) {
  if (serverHandle) {
    // サーバを定義
    var server = http.createServer(function(req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      console.log('\033[34m' + 'Worker' + '\033[39m');
      res.end('Hello Worker\n');
    });
     // 渡されたハンドラを用いてサーバをリッスン
    server.listen(serverHandle);
  }
});

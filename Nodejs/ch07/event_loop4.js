var http = require('http');
var server = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World');
});
server.listen(1337, function() {
  // メッセージは表示されない
  console.log('server listening');
});
while (true); // イベントループを止める処理

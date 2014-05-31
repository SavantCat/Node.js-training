var http = require('http');
var server = http.createServer(function() {});
server.listen(1337, function() {
  console.log('server listening');
  server.close(); // ここでハンドルが削除され、イベントループが終了する
});

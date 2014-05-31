var http = require('http');
var server = http.createServer(function() {});
server.listen(1337, function() {
  console.log('server listening');
}); // ここでハンドルが登録され、イベントーループが維持される

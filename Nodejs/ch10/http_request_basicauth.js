// ベーシック認証に対応したHTTPクライアント
var http = require('http');
options = { host: 'localhost',
            port: 1337,
            auth: 'alice:alicepass'}; // 認証情報
var req = http.request(options, function(res) {
  var data = '';
  res.on('data', function(chunk) {
    data += chunk;
  });
  // HTTPレスポンスデータの出力
  res.on('end', function() {
    console.log('===== Response Data =====');
    console.log(data);
  });
});
req.end();
// ソケットの生データを出力
req.on('socket', function(socket) {
  console.log('===== Socket Data =====');
  socket.on('data', function(chunk) {
    console.log(chunk.toString());
  });
});

var http = require('http')
  , port = process.argv[2] // 引数でポート番号を取得
  ;

// サーバを定義
var server = http.createServer(function(req, res) {
  var msg = 'access to pid = ' + process.pid;
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  console.log(msg);
  res.end(msg);
});

module.exports = server;

if (require.main === module) {
  // 単体で実行された場合はポートをリッスン
  server.listen(port);
}

var express = require('express')
  , app = module.exports = express.createServer()
  , port = process.argv[2] // 引数でポート番号を取得
  ;

app.get('/', function(req, res) {
  var msg = 'access to pid =' + process.pid;
  console.log(msg);
  res.send(msg);
});

if (require.main === module) {
  // 単体で実行された場合はポートをリッスン
  app.listen(port);
}

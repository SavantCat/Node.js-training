var express = require('express')
  , app = module.exports = express.createServer()
  , port = process.argv[2] // 引数でポート番号を取得
  , RedisStore = require('connect-redis')(express)
  ;

app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.session({
    secret: 'test',
    // セッションを redis に保存
    store: new RedisStore()
  }));
});

app.get('/', function(req, res) {
  var msg = req.sessionID + ' on ' + process.pid;
  console.log(msg);
  res.send('Success! ' + msg);
});

if (require.main === module) {
  // 単体で実行された場合はポートをリッスン
  app.listen(port);
}

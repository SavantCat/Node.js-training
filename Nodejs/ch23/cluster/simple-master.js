var cluster = require('cluster')
  , server = require('./simple-worker')
  , port = process.argv[2] // 引数でポート番号を取得
  ;

if (cluster.isMaster) {
  console.log('master:', process.pid);
  // ワーカプロセスを 4 つフォーク
  for (var i = 0; i < 4; i++) {
    var worker = cluster.fork();
  }
}

if (cluster.isWorker) {
  // 読み込んだサーバを起動
  server.listen(port);
}

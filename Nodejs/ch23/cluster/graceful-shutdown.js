var cluster = require('cluster')
  , http = require('http')
  , stdout = process.stdout
  ;

if (cluster.isMaster) {
  console.log('maste を %d で起動しました。', process.pid);

  for (var i = 0; i < 4; i++) {
    // ワーカプロセスを 4 つフォーク
    cluster.fork();
  }

  cluster.on('fork', function(worker) {
    console.log('worker %d を %d でforkしました。', worker.id, worker.process.pid);
  });

  cluster.on('online', function(worker) {
    console.log('worker %d が正常に起動しました。', worker.id);
  });

  cluster.on('listening', function(worker, address) {
    console.log('worker %d は %j のリスニングを開始しました。', worker.id, address);
  });

  cluster.on('disconnect', function(worker, address) {
    console.log('worker %d が切断しました。', worker.id);
  });

  cluster.on('exit', function(worker, code, signal) {
    var exitCode = signal ? 'シグナル ' + signal : '終了コード ' + code;
    console.log('worker %d が %s により終了しました。', worker.id, exitCode);
    if (!worker.suicide) {
      // disconnect による切断でない場合は
      // ワーカを再起動する
      console.log('ワーカを起動します。');
      cluster.fork();
    }
  });

  // マスタが SIGTERM を受け取った場合は
  // 全プロセスを graceful shutdown する。
  process.on('SIGTERM', function() {
    console.log('master が SIGTERM を受け取りました。');
    cluster.disconnect(function() {
      console.log('全てのプロセスを終了します');
    });
  });
}

if (cluster.isWorker) {
  http.createServer(function(req, res) {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(3000);
}

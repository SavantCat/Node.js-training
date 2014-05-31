var child_process = require('child_process');
console.log('master on', process.pid);

// ワーカプロセスを fork
var worker = child_process.fork(__dirname + '/worker.js');

// 子プロセスにメッセージを送信
worker.send('from master to worker');

// 子プロセスからのメッセージを受信
worker.on('message', function(msg) {
  console.log(msg);
  // 子プロセスを終了
  worker.kill('SIGKILL');
});

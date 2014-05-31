var child_process = require('child_process');
var option = {
    cwd: undefined
  , env: process.env
  , setsid: true
};

console.log('master on', process.pid);

// ワーカを起動
var worker = child_process.spawn('node', ['worker.js'], option);

// ワーカの標準出力を監視
worker.stdout.on('data', function(data) {
  console.log('stdout: ' + data);
});

// ワーカの標準エラー出力を監視
worker.stderr.on('data', function(data) {
  console.log('stderr: ' + data);
});

// 0.5 秒後ワーカにシグナル SIGKILL を送信
setTimeout(function() {
  worker.kill('SIGKILL');
}, 3000);

// ワーカが終了したら
worker.on('exit', function(code, signal) {
  if (signal) {
    console.error(signal);
    // マスタを終了
    process.exit(1);
  }
});

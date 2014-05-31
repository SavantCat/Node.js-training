console.log('worker on', process.pid);

// 親プロセスからのメッセージを受信
process.on('message', function(msg) {
  // 親プロセスにメッセージを送信
  process.send('from worker to master');
  console.log(msg);
});

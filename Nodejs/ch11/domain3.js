// Domain を使う単純な例(エラーイベントを発生させる場合)
var domain = require('domain');
var events = require('events');
var d = domain.create();
d.on('error', function(e) {
  // ここでドメインで受けたエラーの処理を行う
  console.error('d:', e.message);
});
d.run(function() {
  // この関数内でエラーイベントを発生させると d でエラーを受ける
  var ee = new events.EventEmitter();
  ee.emit('error', new Error('emitted error'));
});

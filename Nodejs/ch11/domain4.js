// オブジェクトのImplicit Binding の例
var domain = require('domain');
var events = require('events');
var ee;
var d1 = domain.create();
var d2 = domain.create();
d1.on('error', function(e) {
  console.error('d1:', e.message);
});
d2.on('error', function(e) {
  console.error('d2:', e.message);
});
d1.run(function() {
  // 暗黙的に ee が d1ドメインに追加される
  ee = new events.EventEmitter();
});
d2.run(function() {
  // d2ドメイン内でもeeはd1ドメインでエラーを受ける
  ee.emit('error', new Error('emitted error'));
});

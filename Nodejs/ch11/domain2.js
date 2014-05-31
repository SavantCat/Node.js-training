// Domain を使う単純な例(エラーをスローする場合)
var domain = require('domain');
var d = domain.create();
d.on('error', function(e) {
  // ここでドメインで受けたエラーの処理を行う
  console.error('d:', e.message);
});
d.run(function() {
  // この関数内でエラーをスローすると d でエラーを受ける
  throw new Error('throwed error');
});

// コールバックのImplicit Binding の例
var domain = require('domain');
var fs = require('fs');
var d = domain.create();
d.on('error', function(e) {
  console.log('d:', e.message);
});
// process.nextTick, setTimeout, fs.open の非同期
// コールバックは暗黙的に dドメインにバインドされる
d.run(function() {
  process.nextTick(function() {
    setTimeout(function() {
      fs.readFile('non-exist.txt', 'utf8', function(err, data) {
        if (err) throw err;
      });
    }, 100);
  });
});

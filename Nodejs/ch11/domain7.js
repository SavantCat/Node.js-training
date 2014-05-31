var fs = require('fs');
var domain = require('domain');
var d = domain.create();
d.on('error', function(e) {
  console.log('Error:', e.message);
});
function readFileJSON(filename, cb) {
  fs.readFile(filename, 'utf8', d.bind(function(err, data) {
    if (err) throw err;
    return cb(JSON.parse(data));
  }));
}
readFileJSON('non-exist.txt', function(json) {
  console.log(json);
});

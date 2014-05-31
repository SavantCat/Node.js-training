var fs = require('fs');
var domain = require('domain');
var d = domain.create();
d.on('error', function(e) {
  console.log('Error:', e.message);
});
function readFileJSON(filename, cb) {
  fs.readFile(filename, 'utf8', d.intercept(function(data) {
    return cb(JSON.parse(data));
  }));
}
readFileJSON('non-exist.txt', function(json) {
  console.log(json);
});

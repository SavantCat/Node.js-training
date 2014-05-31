var async = require('async');

async.series([
  function(callback) {
    callback(null, 'hello');
  },
  function(callback) {
    callback(null, 'world');
  }
],
function(err, results) {
  // results[0]には 'hello'
  // results[1]には 'world'
});

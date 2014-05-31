var async = require('async');

async.series({
  first: function(callback) {
    callback(null, 'hello');
  },
  second: function(callback) {
    callback(null, 'world');
  }
},
function(err, results) {
  // results['first']には 'hello'
  // results['second']には 'world'
});

var async = require('async');

async.series([
  function(callback) {
    setTimeout(function() {
      console.log('first task');
      callback(null);
    }, 1000);
  },
  function(callback) {
    setTimeout(function() {
      console.log('second task');
      callback(null);
    }, 1000);
  }
],
function(err, results) {
  console.log('all done!');
});

console.log('next step');

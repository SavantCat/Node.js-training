var async = require('async');

function addNumbers(memo, item, callback) {
  setTimeout(function() {
    callback(null, memo + item);
  }, 1000);
}

async.reduce([1, 2, 3], 0, addNumbers, function(err, result) {
  if (err) {
    throw err;
  } else {
    // resultは、6
    console.log('result: %d', result);
  }
});

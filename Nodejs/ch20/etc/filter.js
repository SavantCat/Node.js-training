var async = require('async');

function isTrue(item, callback) {
  var value = (item === 'test2') ? false : true;
  callback(value);
}

async.filter(['test1', 'test2', 'test3'], isTrue, function(results) {
  // results[0]は、'test1'
  // results[1]は、'test3'
});

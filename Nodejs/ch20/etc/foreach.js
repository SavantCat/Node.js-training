var async = require('async');

function printItem(item, callback) {
  console.log(item);
  callback(null);
}

async.forEach(['test1', 'test2', 'test3'], printItem, function(err) {
  if (err) {
    throw err;
  }
});

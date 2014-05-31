var async = require('async');

function readFromDatabase(callback) {
  setTimeout(function() {
    callback(null, 'data from database');
  }, 5000);
}

function readFromFile(callback) {
  setTimeout(function() {
    callback(null, 'data from file');
  }, 3000);
}

async.parallel({
  one: function(callback) {
    readFromDatabase(callback);
  },
  two: function(callback) {
    readFromFile(callback);
  }
},
function(err, results) {
  if (err) {
    throw err;
  } else {
    console.log('all done: "%s" and "%s"', results['one'], results['two']);
  }
});

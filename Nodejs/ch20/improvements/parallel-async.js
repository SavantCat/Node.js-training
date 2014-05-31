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

async.parallel([
  function(callback) {
    readFromDatabase(callback);
  },
  function(callback) {
    readFromFile(callback);
  }
],
function(err, results) {
  if (err) {
    throw err;
  } else {
    console.log('all done: "%s" and "%s"', results[0], results[1]);
  }
});

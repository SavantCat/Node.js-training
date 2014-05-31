var fs = require('fs');
var async = require('async');

async.series([
  function(callback) {
    fs.unlink('previous.txt', callback);
  },
  function(callback) {
    fs.rename('current.txt', 'previous.txt', callback);
  },
  function(callback) {
    fs.rename('new.txt', 'current.txt', callback);
  }
],
function(err, results) {
  if (err) {
    throw err;
  } else {
    console.log('success!');
  }
});

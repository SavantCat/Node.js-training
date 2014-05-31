var fs = require('fs');
var async = require('async');

async.waterfall([
  function(callback) {
    callback(null, 'cat_pictures');
  },
  function(directory, callback) {
    fs.readdir(directory, callback);
  },
  function(files, callback) {
    console.log('there are %d pictures', files.length);
    callback(null);
  }
],
function(err) {
  if (err) {
    throw err;
  } else {
    console.log('done!');
  }
});

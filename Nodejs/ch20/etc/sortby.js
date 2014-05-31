var fs = require('fs');
var async = require('async');

function getFileSize(item, callback) {
  fs.stat(item, function(err, stats) {
    callback(err, stats.size);
  });
}

async.sortBy(['test1', 'test2', 'test3'], getFileSize, function(err, results) {
  // resultsは、ファイルサイズが小さい順
  results.forEach(function(result) {
    console.log(result);
  });
});

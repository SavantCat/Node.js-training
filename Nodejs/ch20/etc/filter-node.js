var path = require('path');
var async = require('async');

async.filter(['test1', 'test2', 'test3'], path.exists, function(results) {
});

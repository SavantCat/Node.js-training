var fs = require('fs');

var rs = fs.createReadStream('/tmp/target.txt', {encoding: 'utf-8', bufferSize: 1});
rs.on('data', function(chunk) {
    console.log(chunk);
});
rs.on('end', function() {
    console.log('<EOF>');
});

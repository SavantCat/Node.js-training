var path = require('path'),
    fs   = require('fs');

var filePath = path.join(__dirname, 'write.txt');

var writeStream = fs.createWriteStream(filePath);
writeStream.write('Hello World!');
writeStream.end();

writeStream.on('error', function(err) {
    console.log('An error occured');
    console.log(err);
});

writeStream.on('close', function() {
    console.log('writable stream closed');
});

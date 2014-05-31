var path = require('path'),
    fs   = require('fs');
var outputFilePath = path.join(__dirname, 'write.txt');
var writeStream = fs.createWriteStream(outputFilePath);

var inputFilePath = path.join(__dirname, 'test.txt');
var readStream = fs.createReadStream(inputFilePath, {bufferSize: 4});

writeStream.on('pipe', function() {
    console.log('a readableStream pipes writeStream');
});
writeStream.on('error', function(err) {
    console.log('An error occured');
    console.log(err);
});
writeStream.on('close', function() {
    console.log('writable stream closed');
});
readStream.pipe(writeStream);
    readStream.on('data', function(data) {
    console.log('>> a data event occured.');
});
readStream.on('end', function() {
    console.log('read end');
});
readStream.on('error', function(err) {
    console.log('An error occured');
    console.log(err);
});

var fs = require('fs');

var stdin = process.stdin;
var file = process.argv[2];
var output = fs.createWriteStream(file, {flags: 'a+'});
stdin.resume();
stdin.pipe(output);

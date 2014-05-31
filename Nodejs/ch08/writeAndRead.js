var fs = require('fs');

fs.writeFile('/tmp/target.txt', 'some data', 'utf-8', function(err) {
    if (err) throw err;
    fs.readFile('/tmp/target.txt', 'utf-8', function(err, data) {
        if (err) throw err;
        console.log(data);
    });
});

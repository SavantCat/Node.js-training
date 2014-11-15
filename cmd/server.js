console.log("****Node Console****");
process.stdin.setEncoding('utf8');
var exec = require('child_process').exec;



process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    process.stdout.write('data: ' + chunk);
    var child = exec(chunk, function(err, stdout, stderr) {
      if (!err) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr)
      } else {
        console.log(err);
        // err.code will be the exit code of the child process
        console.log(err.code);
        // err.signal will be set to the signal that terminated the process
        console.log(err.signal);
      }
    })
  }
});

process.stdin.on('end', function() {
  process.stdout.write('end');
});




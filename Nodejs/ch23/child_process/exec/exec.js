var child_process = require('child_process')
  , command = 'echo "hello world"'
  ;

// コマンドを実行
child_process.exec(command, function(err, stdout, stderr) {
  console.log(stdout); // hello world
});

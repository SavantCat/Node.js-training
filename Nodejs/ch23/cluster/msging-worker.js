var http = require('http')
  , port = process.argv[2]
  ;

var server = http.createServer(function(req, res) {
  var msg = 'access to pid = ' + process.pid;
  process.send('worker %d to master');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(msg);
});

process.on('message', function(msg) {
  console.log(msg);
});

if (require.main === module) {
  server.listen(port);
}

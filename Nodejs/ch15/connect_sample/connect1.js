var connect = require('connect');

var routing = function(req, res, next) {
  var msg = 'GET /';
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': msg.length
  });
  res.end(msg);
};

connect.createServer(
  routing
).listen(3000);

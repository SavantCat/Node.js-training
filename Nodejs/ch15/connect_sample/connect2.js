var connect = require('connect');
var http = require('http');

var log = function(req, res, next) {
  console.log(req.url);
  next();
};

var routing = function(req, res, next) {
  var msg = 'GET /';
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': msg.length
  });
  res.end(msg);
};

connect.createServer(
  log,
  routing
).listen(3000);

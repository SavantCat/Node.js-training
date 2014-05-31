var connect = require('connect');
var http = require('http');

var log = function(req, res, next) {
  console.log(req.url);
  next();
};

var routing = function(req, res, next) {
  if (req.url === '/route2') {
    return next();
  }
  var msg = 'GET /';
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': msg.length
  });
  res.end(msg);
};

var routing2 = function(req, res, next) {
  var msg = 'GET /route2';
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': msg.length
  });
  res.end(msg);
};

connect.createServer(
  log,
  routing,
  routing2
).listen(3000);

var http = require('http')
  , httpProxy = require('http-proxy')
  , parseCookie = require('connect').utils.parseCookie
  ;

var addresses = [
    { host: 'localhost', port: 3000 }
  , { host: 'localhost', port: 3001 }
  , { host: 'localhost', port: 3002 }
];

function getTarget(index) {
  index = index || Math.floor(Math.random() * 3);
  var target = addresses[index];
  return { index: index, host: target.host, port: target.port };
}

function stickySession(req, res) {
  var target, cookie;
  if (req.headers.cookie) cookie = parseCookie(req.headers.cookie);
  if (cookie && cookie.proxy) {
    target = getTarget(cookie.proxy);
  } else {
    target = getTarget();
    if (res) res.setHeader('Set-Cookie', 'proxy=' + target.index);
  }
  return target;
}

var server = http.createServer(function(req, res) {
  var target = stickySession(req, res);
  var proxy = new httpProxy.HttpProxy({ target: target });
  proxy.proxyRequest(req, res);
});

server.on('upgrade', function(req, socket, head) {
  var target = stickySession(req);
  var proxy = new httpProxy.HttpProxy({ target: target });
  proxy.proxyWebSocketRequest(req, socket, head);
});

server.listen(4000);

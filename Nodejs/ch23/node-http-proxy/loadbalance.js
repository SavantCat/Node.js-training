var http = require('http')
  , httpProxy = require('http-proxy')
  ;

var addresses = [
   { host: 'localhost', port: 3000 }
 , { host: 'localhost', port: 3001 }
 , { host: 'localhost', port: 3002 }
];

function target() {
  var rand = Math.floor(Math.random() * (addresses.length));
  return addresses[rand];
}

httpProxy.createServer(function(req, res, proxy) {
  proxy.proxyRequest(req, res, target());
}).listen(4000);

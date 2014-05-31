var httpProxy = require('http-proxy');

httpProxy.createServer(3000, 'localhost').listen(4000);

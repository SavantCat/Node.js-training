var http = require('http');
var server;
var port = 8888;

server = http.createServer(function(req, res) {
    debugger;
    res.writeHead(200);
    res.end('hello, world');
});

server.listen(port);

console.log('listening on http://127.0.0.1:' + port);

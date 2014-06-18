var net = require('net');

var server = net.createServer();
server.maxConnections = 3;

function Client(socket) {
  this.socket = socket;
}

Client.prototype.writeData = function(d) {
  var socket = this.socket;
  if (socket.writable) {
    var key = socket.remoteAddress + ':' + socket.remotePort;
    process.stdout.write('[' + key + '] - ' + d);
    socket.write('[R] ' + d);
  }
};

var clients = {};

function chomp(raw_text)
{
  return raw_text.replace(/(\n|\r)+$/,'');
}

server.on('connection', function(socket) {
  var status = server.connections + '/' + server.maxConnections;
  var key = socket.remoteAddress + ':' + socket.remotePort;
  console.log('Connection Start(' + status + ') - ' + key);
  clients[key] = new Client(socket);

  var data = '';
  var newline = /\r\n|\n/;
  socket.on('data', function(chunk) {
    var k = chunk.toString();
    if (newline.test(k)) {
      k = chomp(k);
      clients['127.0.0.1:' + k].writeData('test data\n');
      k ='';
    }
  });

  socket.on('end', function(socket) {
    console.log('Connection End(' + status + ') - ' + key);
    delete clients[key];
  });
});

server.on('close', function() {
  console.log('Server Closed');
});

process.on('SIGINT', function() {
  for (var i in clients) {
    var socket = clients[i].socket;
    socket.end();
  }
  server.close();
});

server.on('listening', function() {
  var addr = server.address();
  console.log('Listening Start on Server - ' + addr.address + ':' + addr.port);
});

server.listen(11111, '127.0.0.1');
// vim: set sw=2 sts=2 et :
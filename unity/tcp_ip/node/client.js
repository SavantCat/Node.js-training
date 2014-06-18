var net = require('net');

var options = {};
options.host = process.argv[2];
options.port = process.argv[3];

var client = net.connect(options);

client.on('error', function(e) {
  console.error('Connection Failed - ' + options.host + ':' + options.port);
  console.error(e.message);
});

client.on('connect', function() {
  console.log('Connection - ' + options.host + ':' + options.port);
});

process.on('SIGINT', function() {
  console.log('Connction Closed - ' + options.host + ':' + options.port);
  client.end();
});

process.stdin.on('data', function(data) {
  process.stdout.write('[S] ' + data);
  client.write(data);
});

client.on('data', function(chunk) {
  process.stdout.write(chunk.toString());
});

client.on('end', function(had_error) {
  console.log('Connction End - ' + options.host + ':' + options.port);
});

client.on('close', function() {
  console.log('Client Closed');
  process.exit(0);
});
// SNIサーバ向けHTTPSクライアント
var https = require('https');
var port = 1338;
var options1 = {host: 'foo', port: port};
var req1 = https.get(options1, function(res) {
  var data = '';
  res.on('data', function(chunk) {
    data += chunk;
  });
  res.on('end', function() {
    console.log('foo  GET:', data);
  });
});
var options2 = {host: 'foo2', port: port};
var req2 = https.get(options2, function(res) {
  var data = '';
  res.on('data', function(chunk) {
    data += chunk;
  });
  res.on('end', function() {
    console.log('foo2 GET:', data);
  });
});
var options3 = {host: 'foo3', port: port};
var req3 = https.get(options3, function(res) {
  var data = '';
  res.on('data', function(chunk) {
    data += chunk;
  });
  res.on('end', function() {
    console.log('foo3 GET:', data);
  });
});

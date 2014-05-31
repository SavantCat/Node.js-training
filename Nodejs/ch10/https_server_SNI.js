// HTTPS サーバ (SNI対応版)
// foo: SNI非対応クライアントでも動作するHTTPSサーバ
// foo2,foo3: SNI必要のバーチャルHTTPSサーバ
var https = require('https');
var fs = require('fs');
var port = 1338;
// SNI不要のHTTPSサーバ(foo)を作成
var options = {
  key: fs.readFileSync('foo-key.pem'),
  cert: fs.readFileSync('foo-cert.pem')};
var server = https.createServer(options, function(req, res) {
  var cleartext = req.connection;
  // SNI利用時はサーバ名が servername に渡る
  var servername = cleartext.servername;
  res.writeHead(200, {'Content-Type': 'text/plain'});
  switch (servername) {
  case 'foo2':
    res.end('Hello foo2 SSL Server');
    break;
  case 'foo3':
    res.end('Hello foo3 SSL Server');
    break;
  default: // SNI非対応向け
    res.end('Hello foo SSL Server');
    break;
  }
});
// 要SNIなバーチャルHTTPSサーバのTLS設定を追加
server.addContext('foo2', {
  key: fs.readFileSync('foo2-key.pem'),
  cert: fs.readFileSync('foo2-cert.pem')});

server.addContext('foo3', {
  key: fs.readFileSync('foo3-key.pem'),
  cert: fs.readFileSync('foo3-cert.pem')});

server.listen(port, function() {
  console.log('ssl server listening on ', port);
});

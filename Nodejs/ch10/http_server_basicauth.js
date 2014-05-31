// ベーシック認証に対応したHello Wold HTTPサーバ
var http = require('http');
var host = 'localhost';
var port = 1337;
var htpasswd = {'alice' : 'alicepass'}; // 認証情報
var server = http.createServer(function(req, res) {
  function showAuthContent(res, username, password) {
    // 認証情報が一致していれば200、不一致なら403を返す
    if (username in htpasswd && htpasswd[username] === password) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Hello Authed World\n');
    } else {
      res.writeHead(403, {'Content-Type': 'text/plain'});
      res.end('Forbidden\n');
    }
  }
  if (req.headers.authorization) {
    // Authorization ヘッダを取得・分解
    var header = req.headers.authorization.split(' ');
    if (header[0] === 'Basic' && header[1]) {
      // ユーザ名・パスワードを取得
      var data = (new Buffer(header[1], 'base64').toString()).split(':');
      // 認証結果に応じたHTTPレスポンスを返す
      showAuthContent(res, data[0], data[1]);
    } else {
      // Basic以外の認証方式の場合は 403 を返す
      res.writeHead(403, {'Content-Type': 'text/plain'});
      res.end('Forbidden\n');
    }
  } else {
    // Authorization ヘッダがない場合は 401を返す
    res.writeHead(401, {'Content-Type': 'text/plain',
                        'WWW-Authenticate': 'Basic realm="Username"'});
    res.end('Authorization Required');
  }
});
server.listen(port, function() {
  console.log('listening on', host + ':' + port);
});

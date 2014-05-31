// HTTP RESTfulサーバ
var http = require('http');
var port = 1337;
var obj = {}; // データを保管するオブジェクト
var server = http.createServer(function(req, res) {
  var remoteAddress = req.connection.remoteAddress;
  var header = {'Connection': 'close', 'Content-Length': 0};
  // データ保管のキーを url にして一意に保つ
  var key = req.url;
  // リクエストメソッド毎に処理を分ける
  switch (req.method) {
    // JSONデータを新規に登録する。すでに存在する場合は403エラーを返
    // す。不正なJSONデータの場合は400エラーを返す。
    case 'POST':
      if (obj[key]) {
        res.writeHead(403, header);
        res.end();
      } else {
        var data = '';
        req.on('data', function(chunk) {
          data += chunk;
        });
        req.on('end', function() {
          try {
            obj[key] = JSON.parse(data);
            res.writeHead(200, header);
            console.log('POST', key, obj[key], ' from ' + remoteAddress);
          } catch (e) {
            res.writeHead(400, e.message, header);
          }
          res.end();
        });
      }
      break;
    // 登録されたJSONデータを取得する。存在しない場合は404エラーを返す。
    case 'GET':
      if (obj[key]) {
        var json = JSON.stringify(obj[key]);
        res.writeHead(200, {
          'Content-Length': Buffer.byteLength(json),
          'Content-Type': 'application/json',
          'Connection': 'close'
        });
        res.write(json);
        console.log('GET', key, ' from ' + remoteAddress);
      } else {
        res.writeHead(404, header);
      }
      res.end();
      break;
    // 登録されたJSONデータを上書きする。存在しない場合は403エラーを
    // 返す。不正なJSONデータの場合は400エラーを返す。
    case 'PUT':
      if (obj[key]) {
        var data = '';
        req.on('data', function(chunk) {
          data += chunk;
        });
        req.on('end', function() {
          try {
            obj[key] = JSON.parse(data);
            res.writeHead(200, header);
            console.log('PUT', key, obj[key], ' from ' + remoteAddress);
          } catch (e) {
            res.writeHead(400, e.message, header);
          }
          res.end();
        });
      } else {
        res.writeHead(403, header);
        res.end();
      }
      break;
    // 登録されたJSONデータを削除する。存在しない場合は404エラーを返す。
    case 'DELETE':
      if (obj[key]) {
        delete obj[key];
        res.writeHead(200, header);
        console.log('DELTE', key, ' from ' + remoteAddress);
      } else {
        res.writeHead(404, header);
      }
      res.end();
      break;
  }
});
// エラーの出力(サーバ・ソケット関連2種類）
server.on('error', function(e) {
  console.log('Server Error', e.message);
});
server.on('clientError', function(e) {
  console.log('Client Error', e.message);
});

server.listen(port, function() {
  console.log('listening on ' + port);
});

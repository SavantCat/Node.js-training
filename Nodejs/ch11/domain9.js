var domain = require('domain');
var http = require('http');
var url = require('url');
var fs = require('fs');
http.createServer(function(req, res) {
  var pathname = url.parse(req.url).pathname;
  var reqd = domain.create();
  reqd.add(req); // requestオブジェクトをドメインにバインド
  reqd.on('error', function(e) { // エラーページの表示
    res.writeHead(404, {'Content-Type' : 'text/plain'});
    res.end('File Not Found\n');
  });
  if (/\.html$/.test(pathname)) {
    // public ディレクトリ以下のHTMLファイルを探す
    var filename = __dirname + '/public' + pathname;
    // HTMLファイルが存在しなければエラーページの表示
    fs.readFile(filename, 'utf8', reqd.intercept(function(data) {
      res.writeHead(200, {'Content-Type' : 'text/html',
                          'Content-Length': Buffer.byteLength(data)});
      res.end(data); // HTMLファイルの表示
    }));
  } else {
    req.emit('error', new Error('not found')); //エラーイベントの発生
  }
}).listen(8080, function() {
  console.log('listen on 8080');
});

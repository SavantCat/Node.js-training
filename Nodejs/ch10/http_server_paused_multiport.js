// HTTPレスポンスがランダムで遅延するHTTPサーバ
// 複数ポートで複数のHTTPサーバを立ち上げる
var http = require('http');
var servers = {};
var server_num = 3; // 立ち上げるサーバの台数
var host = 'localhost'; 
var port_start = 10001; // 1台目のポート番号

function createServer(servers, port) {
  var name = host + ':' + port;
  servers[name] = http.createServer(function(req, res) {
    var max_res_delay = 10; // 最大遅延時間(秒)
    var delay = Math.floor(max_res_delay * Math.random());
    // 最大遅延時間以内ランダム秒でレスポンスを遅延させる
    setTimeout(function()  {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Delayed ' + delay + '[sec]');
    }, delay * 1000);
  });
  servers[name].listen(port, function() {
    console.log('listening on', name);
  });
}

for (var i = 0; i < server_num; i++) {
  // ポート番号を1つずつ繰り上げてサーバを立ち上げる
  createServer(servers, port_start++);
}

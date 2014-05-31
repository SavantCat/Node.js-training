// 過剰なHTTPリクエストを行うHTTPクライアント (globalAgent利用時)
// リクエスト待ち数が最大max_request_queueに達するまで継続する
var http = require('http');
var server_num = 3;
var host = 'localhost';
var port_start = 10001; // 開始ポート
var req_targets = []; // 接続HTTPサーバ
var loop_counter = 0;
var req_interval = 0.1; // リクエスト送信間隔(秒)
var globalAgent = http.globalAgent; 

function printStatus(name, sockets, requests, evname) {
  var requests_num = requests[name] ? requests[name].length : 0;
  var sockets_num = sockets[name] ? sockets[name].length : 0;
  console.log(name, 'conns:', sockets_num, 'waits:', requests_num, ':', evname);
  return requests_num;
}

function clientRequest(req_targets) {
  var max_loop_counter = 100; // 最大繰り返し数
  var max_requests_queue = 10; // 最大リクエスト待ち数
  var name = req_targets[loop_counter % req_targets.length];
  var requests = globalAgent.requests;
  var sockets = globalAgent.sockets;
  var target = name.split(':');
  var req = http.get({host: target[0], port: target[1]});
  req.on('response', function(res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('end', function() {
      printStatus(name, sockets, requests, 'res end: ' + data);
    });
  });
  if (printStatus(name, sockets, requests, 'http.get') >= max_requests_queue) {
    console.log('===== no more new http.get() to', name, '=====');
    req_targets.splice(req_targets.indexOf(name), 1);
  }
  if (req_targets.length && loop_counter++ < max_loop_counter) {
    return true;
  } else {
    return false;
  }
}

// req_interval間隔でHTTPリクエストを送信
function runLoop(req_targets) {
  setTimeout(function() {
    // 最大繰り返し回数まで送り続ける
    if (clientRequest(req_targets)) {
      runLoop(req_targets);
    }
  }, req_interval * 1000);
}

for (var i = 0; i < server_num; i++) {
  var name = host + ':' + port_start;
  req_targets.push(name);
  port_start++;
}
console.log('===== http requests with globalAgent start ======');

runLoop(req_targets);

// 過剰なHTTPリクエストを行うHTTPクライアント
// 最大接続数が異なる3種類のカスタムエージェントを利用
// リクエスト待ち数が最大max_request_queueに達するまで継続する
var http = require('http');
var server_num = 3;
var host = 'localhost';
var port_start = 10001;
var req_targets = [];
var loop_counter = 0;
var agents = {};

function printStatus(name, sockets, requests, evname) {
  var requests_num = requests[name] ? requests[name].length : 0;
  var sockets_num = sockets[name] ? sockets[name].length : 0;
  console.log(name, 'conns:', sockets_num, 'waits:', requests_num, ':', evname);
  return requests_num;
}

function clientRequest(req_targets, agents) {
  var max_loop_counter = 100;
  var max_requests_queue = 10;
  var name = req_targets[loop_counter % req_targets.length];
  var requests = agents[name].requests;
  var sockets = agents[name].sockets;
  var target = name.split(':');
  // HTTPサーバ毎に異なるエージェントを指定してHTTPリクエストを送る
  var req = http.get({host: target[0], port: target[1], agent: agents[name]});
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

function runLoop(req_targets, agents) {
  var req_interval = 0.1; // [sec]
  setTimeout(function() {
    if (clientRequest(req_targets, agents)) {
      runLoop(req_targets, agents);
    }
  }, req_interval * 1000);
}

for (var i = 0; i < server_num; i++) {
  var name = host + ':' + port_start;
  // 最大接続数が異なるエージェントを生成
  agents[name] = new http.Agent({maxSockets: i + 1});
  req_targets.push(name);
  port_start++;
}
console.log('===== http requests with custom Agent start ======');

runLoop(req_targets, agents);

// マルチキャストサーバ(10秒後に自働終了)
var dgram = require('dgram');
var net = require('net');

// ソケットオブジェクトの生成
var socket = dgram.createSocket('udp4');

function showUsage() {
  console.error('Usage: node udp_multicast_server.js muliticast_ip port');
  process.exit();
}

function checkIP(ip) {
  if (net.isIPv4(ip)) {
    return ip;
  } else {
    throw new Error(ip + ' is not a IPv4 address');
  }
}

function checkPort(port) {
  if ((port = Number(port)) >= 0) {
    return port;
  } else {
    throw new Error(port + ' is not a port number');
  }
}

if (process.argv[2]) {
  var m_address = checkIP(process.argv[2]);
} else {
  showUsage();
}

if (process.argv[3]) {
  var m_port = checkPort(process.argv[3]);
} else {
  showUsage();
}

function closeSocket(socket) {
  var end_msg = 'Server ends';
  var end = new Buffer(end_msg);
  socket.send(end, 0, end.length, m_port, m_address, function() {
    console.log(end_msg);
    socket.close();
  });
}

function multicastSend(i) {
  // 10回送信したら終了させる
  maxcall = 10;
  if (i > maxcall) {
    closeSocket(socket);
    return;
  }
  var hello = new Buffer(i + ': hello from server pid='+ process.pid);
  // 一秒毎にマルチキャストパケットを送信
  setTimeout(function() {
    socket.send(hello, 0, hello.length, m_port, m_address);
    multicastSend(++i);
  }, 1000);
}

socket.on('listening', function(data) {
  var addr = socket.address();
  console.log('Start Multicast Server - ' +
              addr.address + ':' + addr.port);
  var join = new Buffer('Server joins. pid='+ process.pid);
  // マルチキャストの参加情報を流す
  socket.send(join, 0, join.length, m_port, m_address);
  multicastSend(0);
});

socket.on('message', function(data) {
  console.log(data.toString());
});

socket.bind(m_port, m_address);
// ルーター外部に流れないようにTTLを1に明示的に指定
socket.setMulticastTTL(1);
// マルチキャストグループに参加
socket.addMembership(m_address);

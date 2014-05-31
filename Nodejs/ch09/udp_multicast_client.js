// マルチキャストクライアント(20秒後に自働終了)
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
  socket.close();
  console.log('Client ends');
}

var tmout;
socket.on('listening', function() {
  var addr = socket.address();
  console.log('Start Multicast Client - ' +
              addr.address + ':' + addr.port);
  var join = new Buffer('Client joins. pid='+ process.pid);
  // マルチキャストの参加情報を流す
  socket.send(join, 0, join.length, m_port, m_address);
  // 20秒後に終了させる
  tmout = setTimeout(function() {
    closeSocket(socket);
  }, 20 * 1000);
});

// マルチキャスト受信処理
socket.on('message', function(data) {
  var msg = data.toString();
  console.log(msg);
  // サーバ終了のメッセージ受信でクライアントも終了
  if (msg === 'Server ends') {
    clearTimeout(tmout);
    closeSocket(socket);
  }
});

socket.bind(m_port, m_address);
// ルーター外部に流れないようにTTLを1に明示的に指定
socket.setMulticastTTL(1);
// マルチキャストグループに参加
socket.addMembership(m_address);

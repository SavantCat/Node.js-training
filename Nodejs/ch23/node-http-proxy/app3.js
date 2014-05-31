var express = require('express')
  , app = module.exports = express.createServer()
  , port = process.argv[2]
  , RedisStore = require('connect-redis')(express)
  , io = require('socket.io').listen(app)
  , redis = require('redis')
  ;

app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.session({
    secret: 'test',
    // セッションを redis に保存
    store: new RedisStore()
  }));
  // 静的ファイルを配信
  app.use(express.static(__dirname + '/public'));
});

io.configure('development', function() {
  // WebSocket 通信に限定
  io.set('transports', ['websocket']);
});

io.sockets.on('connection', function(socket) {
  var subscriber = redis.createClient()
    , publisher = redis.createClient()
    ;

  subscriber.subscribe('socket message');

  subscriber.on('message', function(channel, message) {
    var message = JSON.parse(message);
    socket.json.emit('msg push', message);
  });

  socket.on('msg send', function(msg) {
    msg.socketid = socket.id;
    msg.pid = process.pid;
    publisher.publish('socket message', JSON.stringify(msg));
  });

  socket.on('disconnect', function() {
    subscriber.unsubscribe();
    subscriber.end();
    publisher.end();
  });
});

if (require.main === module) {
  // 単体で実行された場合はポートをリッスン
  app.listen(port);
}

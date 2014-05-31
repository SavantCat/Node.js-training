// Client
var socket = io.connect();
socket.on('connect', function() {
  var interval = setInterval(function() {
    socket.json.emit('msg send', { msg: 'Hello' });
  }, 1000);

  socket.on('msg push', function(msg) {
    var message = msg.msg + ' SockeID=' + msg.socketid + ' PID=' + msg.pid;
    document.getElementById('console').innerText += message + '\n';
  });

  socket.on('disconnect', function() {
    clearInterval(interval);
  });
});

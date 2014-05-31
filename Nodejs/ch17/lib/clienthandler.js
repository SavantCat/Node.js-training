function ClientHandler(io, dataHandler) {
  this.channels = {};

  this.io = io;
  this.dataHandler = dataHandler;
}

ClientHandler.prototype.addClient = function(socket, message) {
  var channel = message.channel
    , clients = this.channels[channel] || {}
    , username = message.username;

  if (!clients[username]) {
    clients[username] = { socketId: socket.id, username: username };
    this.channels[channel] = clients;

    this.sendUsers(channel);
  }
};

ClientHandler.prototype.removeClient = function(socket) {
  var deleted = false;
  for (var channel in this.channels) {
    for (var username in this.channels[channel]) {
      if (this.channels[channel][username].socketId == socket.id) {
        delete this.channels[channel][username];
        deleted = true;
        break;
      }
    }

    if (deleted) {
      this.sendUsers(channel);
      break;
    }
  }
};

ClientHandler.prototype.sendUsers = function(channel) {
  if (this.channels[channel]) {
    var count = 0;
    for (var username in this.channels[channel]) {
      count += 1;
    }

    for (var username in this.channels[channel]) {
      var socketId = this.channels[channel][username].socketId
        , socket = this.io.sockets.socket(socketId);

      socket.json.emit('users', { count: count });
    }
  }
};

ClientHandler.prototype.sendInitialFiles = function(socket, message) {
  var that = this
    , username = message.username
    , channel = message.channel;

  this.dataHandler.getFileList(channel, function(err, res) {
    if (!err) {
      var send = function(rows, channel, username) {
        if (rows.length > 0) {
          var row = rows.shift();
          that.dataHandler.getFile(row.value._id, function(error, response) {
            if (!error) {
              that.sendFileToUser(row.value.from, channel, username, response);
            }
            send(rows, channel, username);
          });
        }
      };
      send(res.rows, channel, username);
    }
  });
};

ClientHandler.prototype.sendFileToUser = function(from, channel, to, data) {
  var client = this.channels[channel][to]
    , target = this.io.sockets.socket(client.socketId);

  target.json.emit('file', {
      from: from
    , data: data.data
    , id: data.id
    , fileName: data.fileName
    , contentType: data.contentType
  });
};

ClientHandler.prototype.sendFileToChannel = function(from, channel, id) {
  var that = this;

  this.dataHandler.getFile(id, function(err, res) {
    if (!err) {
      for (var username in that.channels[channel]) {
        that.sendFileToUser(from, channel, username, res);
      }
    }
  });
};

exports.ClientHandler = ClientHandler;


/**
 * Module dependencies.
 */

var express = require('express')
  , socketio = require('socket.io')
  , redis = require('redis')
  , events = require('events')
  , routes = require('./routes')
  , Twitter = require('./lib/twitter')
  , settings = require('./oauth_settings');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);
app.get('/:keyword', routes.index);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

var io = socketio.listen(app);
var ee = new events.EventEmitter();
io.sockets.on('connection', function(socket) {
  ee.on('hashtags', function(hashtags) {
    socket.emit('hashtags', hashtags);
  });
  sendHashtags(socket);
});

var tw = new Twitter(settings);
var db = redis.createClient();
tw.streaming('sample', function(stream) {
  stream.on('data', function(data) {
    if (data.text) {
      var tags = data.entities.hashtags;
      for (var i = 0; i < tags.length; i++) {
        var hashtag = tags[i].text.toLowerCase();
        db.zincrby('_hashtagcount', 1, hashtag);
        ee.emit(hashtag, data.text);
      }
      io.sockets.emit('tweet', data.text);
    }
  });
});

function sendHashtags(socket) {
  db.zrevrange('hashtagcount', 0, 4, 'withscores', function(err, value) {
    if (err) return console.log(err.toString());
    var hashtags = [];
    for (var i = 0; i < value.length; i += 2) {
      hashtags.push({
          hashtag: value[i]
        , count: value[i + 1]
      });
    }
    socket = socket ? socket : ee;
    socket.emit('hashtags', hashtags);
  });
}

setInterval(function() {
  db.rename('_hashtagcount', 'hashtagcount', function(err, value) {
    if (err) return console.log(err.toString());
    sendHashtags();
  });
}, 1000 * 60 * 10);

var namespaces = [];
module.exports.addChannel = function(namespace) {
  if (namespaces.indexOf(namespace) !== -1) return;
  io.of('/' + namespace).on('connection', function(socket) {
    ee.on(namespace, function(data) {
      socket.emit('tweet', data);
    });
    ee.on('hashtags', function(hashtags) {
      socket.emit('hashtags', hashtags);
    })
    sendHashtags(socket);
  });
  namespaces.push(namespace);
};
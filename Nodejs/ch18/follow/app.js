
/**
 * Module dependencies.
 */

var express = require('express')
  , socketio = require('socket.io')
  , redis = require('redis')
  , auth = require('connect-auth')
  , http = require('http')
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
  app.use(express.session({ secret: 'my secret' }));
  app.use(auth([auth.Twitter({
    consumerKey: settings.consumer_key,
    consumerSecret: settings.consumer_secret,
    callback: 'http://localhost:3000/login'
  })]));
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
const TITLE = 'Follow Nearby All';
var db = redis.createClient();

app.get('/', require('./routes/root').root(TITLE).index);
app.get('/login', require('./routes/login').login(TITLE).index);
app.get('/logout', require('./routes/logout').logout(TITLE).index);
app.get('/start', require('./routes/start').start(TITLE, db).index);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

var clients = [];
var io = socketio.listen(app);
io.sockets.on('connection', function(socket) {
  socket.on('position', function(data) {
    data.sid = socket.id;
    clients.push(data);

    clients.forEach(function(client) {
      if (client.name && client.name !== data.name) {
        var distance = calcDistance(data, client);
        console.log(distance);
        if (distance < 500) {
          send(data, client.name);
          send(client, data.name);
        }
      }
    });

    setTimeout(function() {
      delete clients[clients.indexOf(data)];
      socket.emit('end');
    }, 1000 * 10);
  });
  socket.on('follow', function(data) {
    followAll(data.name, data.follows);
  });
});

function send(client, name) {
  http.get({
    host: 'api.twitter.com',
    port: 80,
    path: '/1/users/profile_image/' + name + '.json'
  }, function(res) {
    io.sockets.socket(client.sid).emit('user', {
      name: name,
      imgUrl: res.headers.location
    });
  });
}

function calcDistance(data1, data2) {
  return Math.round(Math.sqrt(
    Math.pow((data1.longitude - data2.longitude) / 0.0111 * 1000, 2) +
    Math.pow((data1.latitude - data2.latitude) / 0.0091 * 1000, 2)), 1);
}

function followAll(name, follows) {
  db.hget(name, 'access_token', function(err, value) {
    if (err) throw err;
    settings.access_token = value;
    db.hget(name, 'access_token_secret', function(err, value) {
      if (err) throw err;
      settings.access_token_secret = value;
      var tw = new Twitter(settings);
      follows.forEach(function(element) {
        tw.friendships('create', {screen_name: element}, function(err, data) {
          if (err) console.log(err.toString());
        });
      });
    });
  });
}


/**
 * Module dependencies.
 */

var express = require('express')
  , socketio = require('socket.io')
  , config = require('./config.js')
  , DataHandler = require('./lib/datahandler').DataHandler
  , dataHandler = new DataHandler(config.storage);

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('view options', { layout: true });
  app.use(express.bodyParser({
      uploadDir: config.server.uploadPath
    , keepExtensions: true
  }));
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: config.server.session.secret }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.dynamicHelpers({
    message: function(req, res) {
      return req.flash('error')[0] || '';
    }
  , resources: function(req, res) {
      return res.local('resources') || [];
    }
  , variables: function(req, res) {
      return res.local('variables') || []
    }
});

function checkAuthenticated(req, res, next) {
  if(req.session.loggedIn) {
    next();
  } else {
    req.flash('error', 'You need to have username!');
    res.redirect('/login');
  }
}

app.listen(config.server.port, config.server.host);
console.log('node is rocking on %s:%d!', config.server.host, config.server.port);

var io = socketio.listen(app)
  , ClientHandler = require('./lib/clienthandler').ClientHandler
  , clientHandler = new ClientHandler(io, dataHandler);

// Routes

var routes = {
    root: require('./routes/root').root()
  , login: require('./routes/login').login()
  , channels: require('./routes/channels').channels()
  , files: require('./routes/files').files(dataHandler, clientHandler)
};

app.get('/', routes.root.index);

app.get('/login', routes.login.index);
app.post('/login', routes.login.create);

app.get('/channels', checkAuthenticated, routes.channels.index);
app.get('/channels/:channelName', checkAuthenticated, routes.channels.show);

app.post('/files', checkAuthenticated, routes.files.create);
app.get('/files/:fileName', routes.files.show);

// socket.io

io.configure(function() {
  io.set('log level', 1);
});

io.sockets.on('connection', function(socket) {
  socket.on('greeting', function(message) {
    clientHandler.addClient(socket, message);
    clientHandler.sendInitialFiles(socket, message);
  });
  socket.on('disconnect', function() {
    clientHandler.removeClient(socket);
  });
});


/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , models = require('./models')
  , lib = require('./lib')
  , RedisStore = require('connect-redis')(express)
  ;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.redirect('top', '/topics');
  app.use(express.favicon());
  app.use(lib.parallel(
    express.bodyParser(),
    express.cookieParser()
  ));
  app.use(lib.parallel(
    express.methodOverride(),
    express.session({
      secret: 'your secret here',
      store: new RedisStore(),
      cookie: {
        maxAge: false
      }
    })
  ));
  app.use(express.logger({
    stream: lib.logStream,
    buffer: 500
  }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(lib.notFound('http://node-forum'));
});

app.configure('development', function(){
  models.init('localhost', 'forum_dev');
});

app.configure('production', function(){
  models.init('localhost', 'forum_prod');
});

app.configure('test', function() {
  models.init('localhost', 'forum_test');
});

// View Helper
app.helpers(lib.helpers);

// Dynamic View Helper
app.dynamicHelpers(lib.dynamicHelpers);

// Routes

// GET /
app.get('/', lib.loginRequired, routes.index);

// GET /topics/1
// GET /topics?topic_id=1
app.get('/topics/:topic_id?', lib.loginRequired, routes.topics.show);

// GET /topics/1/posts/1
app.get('/topics/:topic_id/posts/:post_id', lib.loginRequired, routes.topics.posts.show);

// POST /topics/1/posts
app.post('/topics/:topic_id/posts', lib.loginRequired, routes.topics.posts.create);

// DELETE /topics/1/posts/1
app.del('/topics/:topic_id/posts/:post_id', lib.loginRequired, routes.topics.posts.delete);

// GET /topics
app.get('/topics', lib.loginRequired, routes.topics.index);

// POST /users
app.post('/users', routes.users.create);

// GET /sessions/new
app.get('/sessions/new', routes.sessions.new);

// GET /sessions/destroy
app.get('/sessions/destroy', routes.sessions.delete);

// POST /sessions
app.post('/sessions', routes.sessions.create);

// Error Handler
app.error(lib.notFoundHandler);
app.error(lib.errorHandler);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

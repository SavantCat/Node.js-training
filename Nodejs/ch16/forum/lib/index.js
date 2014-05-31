var util = require('util')
  , fs = require('fs')
  , models = require('../models')
  , User = models.UserModel
  ;

// Utility
var setCookie = exports.setCookie = function(res, val) {
  res.cookie('authtoken', val, {
    path: '/',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  });
};

exports.parallel = function() {
  var list = arguments;
  return function(req, res, next) {
    var current = 0;
    var len = list.length;
    for (var i = 0; i < len; ++i) {
      var fun = list[i];
      fun(req, res, function() {
        if (++current === len) {
          next();
        }
      });
    }
  };
};

exports.fork = function(fun) {
  return function(req, res, next) {
    fun(req, res, function(){});
    next();
  };
};

// Log Stream
exports.logStream = fs.createWriteStream('./logs/access.log', { flags: 'a' });

// Error
// 404 用のエラー
// リクエストされた URI を受け取ることができる。
function NotFound(path) {
  Error.call(this, 'Not Found');
  Error.captureStackTrace(this, this.constructor); // スタックトレースの格納
  this.name = 'NotFound';
  this.path = path;
}
util.inherits(NotFound, Error);

exports.NotFound = NotFound;

// Middleware
exports.notFound = function(host) {
  return function(req, res, next) {
    next(new NotFound(host + req.url));
  };
};

// Route-Middleware
exports.loginRequired = function(req, res, next) {
  if (req.session.username) {
    return next();
  }
  if (!req.cookies.authtoken) {
    // session も Cookie も無い場合ログインページにリダイレクト
    return res.redirect('/sessions/new');
  }
  // Cookie がある場合
  var token = JSON.parse(req.cookies.authtoken);
  var condition = {
    username: token.username,
    authcookie: token.authcookie
  }
  // Cookie を用いて認証する。
  User.findOne(condition, function(err, result) {
    if (err) {
      return next(err);
    }
    if (!result) {
      // ログインページにリダイレクト
      return res.redirect('/sessions/new');
    }
    var update = { authcookie: models.getAuthCookie() };
    // authcookie を更新
    User.update(condition, update, function(err, numAffected) {
      if (err) {
        return next(err);
      }
      // session を更新
      req.session.username = result.username;
      var newtoken = {
        username: result.username,
        authcookie: update.authcookie
      };
      // Cookie を新しい値で更新
      setCookie(res, JSON.stringify(newtoken));
      next();
    });
  });
};

// ViewHelper
exports.helpers = {
  // url と 名前からリンクを作成する。
  link_to: function(name, url) {
    return '<a href="' + url + '">' + name + '</a>';
  },
  // 空白を &nbsp; に、改行文字を <br /> に変換する。
  text_format: function(text) {
    return text.replace(/ /g, '&nbsp;').replace(/\r\n|\n|\r/g, '<br />');
  }
};

// Dynamic View Helper
exports.dynamicHelpers = {
  username_or_login: function(req, res) {
    if (req.session.username) {
      return ''
        + '<p class="login_user">Login as ' + req.session.username + '</p>'
        + '<p class="logout"><a href="/sessions/destroy">logout</a></p>';
    }
    return '<p class="login"><a href="/sessions/new">login</a></p>';
  },
  message: function(req, res) {
    return function(type) {
      var messages = req.flash(type); // 該当するメッセージを取り出す。
      if (!messages) {
        return '';
      }
      var buf = '<ul class="message ' + type + '">';
      messages.forEach(function(msg) {
        var li = '<li>' + msg + '</li>';
        buf += li;
      });
      buf += '</ul>';
      return buf;
    };
  }
};

// ErrorHandler
exports.notFoundHandler = function(err, req, res, next) {
  if (err instanceof NotFound) {
    res.render('err', {
      status: 404, // status code 404 を設定
      title: '404 Page Not Found',
      err: err
    });
  } else {
    return next(err);
  }
};

exports.errorHandler = function(err, req, res) {
  res.render('err', {
    status: 500, // status code 500 を設定
    title: '500 Internal Server Error',
    err: err
  });
};

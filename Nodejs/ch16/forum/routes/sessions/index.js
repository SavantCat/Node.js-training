var models = require('../../models')
  , lib = require('../../lib')
  , User = models.UserModel
  ;

exports.new = function(req, res, next) {
  res.render('sessions/new', {
    title: 'Login'
  });
};

exports.create = function(req, res) {
  var condition = {
    username: req.param('username'),
    password: req.param('password')
  };
  var rememberme = req.param('rememberme');
  User.findOne(condition, function(err, result) {
    if (err) {
      return next(err);
    }
    if (!result) {
      req.flash('loginErr', 'authentication failed!');
      return res.redirect('back');
    }
    if (rememberme) {
      // Cookie を保存する。
      var newtoken = {
        username: result.username,
        authcookie: result.authcookie
      };
      lib.setCookie(res, JSON.stringify(newtoken));
    }
    req.session.username = result.username;
    res.redirect('top');
  });
};

exports.delete = function(req, res) {
  req.session.destroy();
  res.clearCookie('authtoken', { path: '/' });
  res.redirect('/sessions/new');
};

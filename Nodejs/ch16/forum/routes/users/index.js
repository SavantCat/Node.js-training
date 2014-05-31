var models = require('../../models')
  , lib = require('../../lib')
  , User = models.UserModel
  ;

exports.create = function(req, res, next) {
  var username = req.param('username')
    , password = req.param('password')
    , password2 = req.param('password2')
    , rememberme = req.param('rememberme')
    ;

  var user = new User({
    username: username
  });
  user.setPassword(password, password2);
  user.save(function(err, result) {
    if (err) {
      if (err.code === 11000) {
        // ユーザ名の重複
        req.flash('registerErr', 'username already exist!');
        req.flash('registerErr', 'select another username!');
        return res.redirect('back');
      }
      if (err.name === 'ValidationError') {
        if (err.errors.password_mismatch) {
          // パスワードミスマッチ
          req.flash('registerErr', 'two passwords dosen\'t match!');
        } else {
          // その他エラー
          req.flash('registerErr', 'check your inputs again!');
        }
        return res.redirect('back');
      }
      return next(err);
    }
    if (rememberme) {
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

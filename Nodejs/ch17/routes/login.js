exports.login = function() {
  return {
      index: function(req, res) {
        res.local('resources', [
            { type: 'css', uri: '/stylesheets/login.css' }
          , { type: 'javascript', uri: '/javascripts/login.js' }
        ]);
        res.render('login');
      }
    , create: function(req, res) {
        if (req.param('username')) {
          req.session.loggedIn = true;
          req.session.username = req.param('username');
          res.redirect('/channels');
        } else {
          req.flash('error', 'Username cannot be empty.');
          res.redirect('back');
        }
      }
  };
};

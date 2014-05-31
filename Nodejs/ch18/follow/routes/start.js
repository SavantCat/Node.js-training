exports.start = function(title, db) {
  return {
    index: function(req, res) {
      if (!req.isAuthenticated()) {
        res.redirect('/', 303);
      } else {
        var name = req.getAuthDetails().user.username;
        db.hset(name, 'access_token', req.getAuthDetails()['twitter_oauth_token']);
        db.hset(name, 'access_token_secret', req.getAuthDetails()['twitter_oauth_token_secret']);
        res.render('start', {
          title: title,
          authenticated: true,
          name: name
        });
      }
    }
  };
};
exports.login = function(title) {
  return {
    index: function(req, res) {
      if (req.query.denied) {
        res.render('authng', {
          title: title,
          authenticated: false
        });
      } else {
        req.authenticate(['twitter'], function(err, authenticated) {
          if (err) throw err;
          if (authenticated) {
            res.redirect('/', 303);
          }
        });
      }
    }
  };
};
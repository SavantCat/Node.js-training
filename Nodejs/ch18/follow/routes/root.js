exports.root = function(title) {
  return {
    index: function(req, res) {
      if (!req.isAuthenticated()) {
        res.render('index', {
          title: title,
          authenticated: false
        });
      } else {
        var name = req.getAuthDetails().user.username;
        res.render('authok', {
          title: title,
          authenticated: true,
          name: name
        });
      }
    }
  };
};
exports.logout = function() {
  return {
    index: function(req, res) {
      req.logout();
      res.redirect('/', 303);
    }
  };
};
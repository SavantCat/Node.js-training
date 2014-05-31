/*
 * GET home page.
 */

exports.root = function() {
  return {
      index: function(req, res) {
        res.render('index', { title: 'Express' })
      }
  };
};

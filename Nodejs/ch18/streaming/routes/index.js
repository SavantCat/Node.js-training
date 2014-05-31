
/*
 * GET home page.
 */

exports.index = function(req, res){
  var keyword = '';
  if (req.params.keyword) {
    keyword = req.params.keyword;
    require.main.exports.addChannel(keyword);
  }
  res.render('index', {
      title: 'Twitter Public Timeline Sampling'
    , keyword: keyword
  });
};
var models = require('../../models')
  , topics = models.topics
  , PostModel = models.PostModel
  , lib = require('../../lib')
  , NotFound = lib.NotFound
  ;

exports.index = function(req, res) {
  res.render('topics/index', {
    title: 'Topics',
    topics: topics
  });
};

exports.show = function(req, res, next) {
  // /topics/1 か /topics?topic_id=1 の場合 1 になる
  var topic_id = parseInt(req.param('topic_id'), 10);
  if (!topic_id) {
    return next();
  }
  if (!topics[topic_id-1]) {
    return next(new NotFound(req.url)); // 追加したエラーを生成。
  }
  PostModel.where('topic_id', topic_id).run(function(err, result) {
    if (err) {
      return next(err);
    }
    res.render('topics/show', {
      title: topics[topic_id - 1].name,
      topic_id: topic_id,
      posts: result
    });
  });
};

exports.posts = require('./posts');

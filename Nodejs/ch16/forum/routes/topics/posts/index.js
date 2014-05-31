var models = require('../../../models')
  , topics = models.topics
  , PostModel = models.PostModel
  ;

exports.create = function(req, res, next) {
  var topic_id = req.param('topic_id'); // = req.param.topic_id
  var title = req.param('title');       // = req.body.title
  var detail = req.param('detail');     // = req.body.detail
  var post = new PostModel({
    topic_id: topic_id,
    title: title,
    detail: detail,
    username: req.session.username
  });
  post.save(function(err, result) {
    if(err) {
      if(err.name == 'ValidationError') {
        req.flash('postErr', 'invalid input');
        return res.redirect('back');
      }
      return next(err);
    }
    res.redirect('back');
  });
};

exports.delete = function(req, res, next) {
  var topic_id = req.param('topic_id');
  var condition = {
    _id: req.param('post_id'),
    username: req.session.username
  };
  PostModel.remove(condition, function(err, result) {
    if (err) {
      return next(err);
    }
    if (result === 0) {
      // 一件も削除されなかった場合
      req.flash('deleteErr', 'Can\'t delete this topic');
      return res.redirect('back');
    }
    res.redirect('/topics/' + topic_id);
  });
};

exports.show = function(req, res, next) {
  var topic_id = req.param('topic_id');
  var post_id = req.param('post_id');
  PostModel.findById(post_id, function(err, result) {
    if (err) {
      return next(err);
    }
    if (!result) {
      // 結果が取得できなかった場合
      req.flash('getPostErr', 'Can\'t get this post');
      return res.redirect('back');
    }
    res.render('topics/posts/show', {
      title: result.title,
      topic_id: topic_id,
      post_id: post_id,
      post: result
    });
  });
};

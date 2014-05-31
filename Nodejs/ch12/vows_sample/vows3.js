var vows = require('vows')
  , assert = require('assert')
  ;
var i = 0;

vows.describe('my_suite').addBatch({
  'topicの評価回数の確認': {
    topic: function() {
      return ++i;
    },
    'topic は 1 を返す': function(topic) {
      assert.equal(topic, 1);
    },
    'topic は 2 を返す': function(topic) {
      assert.equal(topic, 2);
    }
  }
}).export(module);

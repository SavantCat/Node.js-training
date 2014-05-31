var vows = require('vows')
  , assert = require('assert')
  ;
var i = 0;

vows.describe('my_sweet').addBatch({
  'topicが関数の場合': {
    topic: function() {
      return ++i;
    },
    '引数は topic の戻り値': function(topic) {
      assert.equal(topic, 1);
    }
  }
}).export(module);

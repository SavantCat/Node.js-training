var vows = require('vows')
  , assert = require('assert')
  ;

vows.describe('コンテキストのネスト').addBatch({
  '親コンテキスト': {
    topic: 10,
    '子コンテキスト': {
      topic: function(parent) {
        return parent * 2;
      },
      '子のvow': function(topic) {
        assert.equal(topic, 20);
      },
      '孫コンテキスト': {
        topic: function(parent) { // 上位のコンテキストの topic を取得
          return parent * 2;
        },
        '孫のvow': function(topic) {
          assert.equal(topic, 40);
        }
      }
    }
  }
}).export(module);

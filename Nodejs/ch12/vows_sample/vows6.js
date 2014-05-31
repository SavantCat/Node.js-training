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
        topic: function(parent) {
          return parent * 2;
        },
        '孫のvow': function(topic) {
          assert.equal(topic, 40);
        },
        'ひ孫コンテキスト': {
          topic: function(parent, granpa, great_granpa) { // より上位の topic の値を取得
            var ans = parent // 40
                    + granpa // 20
                    + great_granpa; // 10
            return ans;
          },
          'ひ孫のvow': function(topic) {
            assert.equal(topic, 40 + 20 + 10);
          }
        }
      }
    }
  }
}).export(module);

var vows = require('vows')
  , assert = require('assert')
  ;

vows.describe('コンテキストのネスト').addBatch({
  '親コンテキスト': {
    topic: '親のトピック',
    '子コンテキスト': {
      topic: '子のトピック',
      '子のvow': function(topic) {
        assert.equal(topic, '子のトピック');
      },
      '孫コンテキスト': {
        topic: '孫のトピック',
        '孫のvow': function(topic) {
          assert.equal(topic, '孫のトピック');
        }
      }
    }
  }
}).export(module);

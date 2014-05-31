var vows = require('vows')
  , assert = require('assert')
  ;

vows.describe('スイート名').addBatch({
  'コンテキスト名': {
    topic: 'Hello',
    'vow 名': function(topic) {
      assert.equal(topic, 'Hello');
    }
  }
}).export(module);

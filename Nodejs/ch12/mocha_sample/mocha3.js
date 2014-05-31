// exports スタイル
var assert = require('chai').assert;
var a = 10;

module.exports = {
  'sample1': {
    'a is 10': function() {
      assert.equal(a, 10);
    }
  }
};

// BDD スタイル
var should = require('chai').should();
var a = 10;

describe('sample1', function() {
  it('a is 10', function() {
    a.should.equal(10);
  });
});

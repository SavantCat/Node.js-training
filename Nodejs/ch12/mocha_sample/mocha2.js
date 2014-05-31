// TDD スタイル
var expect = require('chai').expect;
var a = 10;

suite('sample1', function() {
  test('a is 10', function() {
    expect(a).to.equal(10);
  });
});

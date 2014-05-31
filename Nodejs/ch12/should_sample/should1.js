// var assert = require('assert');
var should = require('should');
var a = 2;

try {
  // assert.equal(a, 1, 'a is equals to 1');
  a.should.equal(1);
} catch (err) {
  console.log('---- AssertionError ----');
  console.log(err);
  console.log('---- stack trace ----');
  console.log(err.stack);
}

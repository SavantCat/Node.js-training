var assert = require('assert');
var a = 2;

try {
  assert.equal(a, 1, 'a is equal to 1');
} catch (err) {
  console.log('---- AssertionError ----');
  console.log(err);
  console.log('---- stack trace ----');
  console.log(err.stack);
}

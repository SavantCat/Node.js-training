var should = require('chai').should();

describe('sample.txt', function() {
  before(function(done) {
    console.log('before');
    done();
  });

  after(function(done) {
    console.log('after');
    done();
  });

  beforeEach(function(done) {
    console.log('beforeEach');
    done();
  });

  afterEach(function(done) {
    console.log('afterEach');
    done();
  });

  describe('describe1', function() {
    it('1,2', function() {
      console.log('1');
      console.log('2');
    });
  });

  describe('describe2', function() {
    it('3', function() {
      console.log('3');
    });
    it('4', function() {
      console.log('4');
    });
  });
});

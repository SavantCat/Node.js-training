var should = require('chai').should();
var fs = require('fs')
  ;

describe('sample.txt', function() {
  it('should not be empty', function(done) {
    fs.exists('sample.txt', function(exists) {
      exists.should.be.true;
      done();
    });
  });
  it('has text data', function(done) {
    fs.readFile('sample.txt', 'utf-8', function(err, data) {
      data.should.equal('sample text\n');
      done();
    });
  });
});

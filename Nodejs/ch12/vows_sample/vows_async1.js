var vows = require('vows')
  , assert = require('assert')
  , fs = require('fs')
  ;

vows.describe('test fs').addBatch({
  'read_file_async': {
    topic: function() {
      fs.readFile('./testfile.txt', 'utf8', function(err, data) {
        if (err) throw err;
        return data;
      });
    },
    'can be successed': function(data) {
      assert.equal(data, 'inner text of testfile!\n');
    }
  }
})
.export(module);

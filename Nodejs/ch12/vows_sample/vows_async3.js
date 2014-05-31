var vows = require('vows')
  , assert = require('assert')
  , fs = require('fs')
  , events = require('events')
  ;

vows.describe('test fs').addBatch({
  'read_fiel_async': {
    topic: function() {
      var emitter = new events.EventEmitter();
      fs.readFile('./testfile.txt', 'utf8', function(err, data) {
        if (err) {
          emitter.emit('error', err);
        } else {
          emitter.emit('success', data);
        }
      });
      return emitter;
    },
    'can be successed': function(err, data) {
      assert.isNull(err);
      assert.equal(data, 'inner text of testfile!\n');
    }
  }
})
.export(module);


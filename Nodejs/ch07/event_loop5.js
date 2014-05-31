var events = require('events');
var util = require('util');
function SyncEmitter() {
  this.emit('bar');
}
util.inherits(SyncEmitter, events.EventEmitter);
var foo = new SyncEmitter();
// このリスナは呼ばれない
foo.on('bar', function() {
  console.log('bar event emitted');
});

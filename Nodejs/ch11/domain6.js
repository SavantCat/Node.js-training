var domain = require('domain');
var events = require('events');
var d = domain.create();
d.on('error', function(e) {
  console.log(e.message);
});
var ee = new events.EventEmitter();
d.add(ee);
ee.emit('error', new Error('ee error'));

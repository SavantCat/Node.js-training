var cluster = require('cluster');

cluster.setupMaster({
  exec: 'msging-worker.js',
  args: [3000]
});

for (var i = 0; i < 4; i++) {
  var worker = cluster.fork();
  worker.send('master to worker ' + worker.id);
}

Object.keys(cluster.workers).forEach(function(id) {
  cluster.workers[id].on('message', function(msg) {
    console.log(msg, id);
  });
});


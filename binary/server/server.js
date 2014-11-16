var ws = require('websocket.io')
var server = ws.listen(3000)

console.log('Start server'); 
server.on('connection', function (client) {
    
    client.on('message', function (data) {
        console.log(data);
    });
  
    client.on('close', function () {
        console.log('Disconnected');   
    });
});

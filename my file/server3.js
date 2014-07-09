var http = require('http');
var fs = require('fs');

var settings = require('./settings');
console.log(settings);
var server = http.createServer();

server.on('request',function(req,res){
    fs.readFile(__dirname + '/index.html','utf-8',function(err,data){
        if (err) {
            res.writeHead(404,{'Context-Type': 'text/plain'});
            res.write('not found!');
            return res.end();
        }else{
        res.writeHead(200,{'Context-Type': 'text/html'});
        res.write(data);
        res.end();
    }
    });
});

server.listen(settings.port,settings.host);
console.log("server listening ....");
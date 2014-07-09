var http = require('http');
var fs = require('fs');
var ejs = require('ejs');

var settings = require('./settings');
console.log(settings);
var server = http.createServer();

//ブロッキング命令
var template = fs.readFileSync(__dirname + '/index.ejs','utf-8');

var n = 0;
server.on('request',function(req,res){
    n++;
    var data = ejs.render(template,{
        title: "hello",
        text: "<strong>World</strong>",
        n: n
    });
    res.writeHead(200,{'Context-Type': 'text/html'});
    res.write(data);
    res.end();
});

server.listen(settings.port,settings.host);
console.log("server listening ....");
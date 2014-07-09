var http = require('http');
var fs = require('fs');
var ejs = require('ejs');
var qs = require('querystring');

var settings = require('./settings');
var server = http.createServer();

//ブロッキング命令
var template = fs.readFileSync(__dirname + '/bbs.ejs','utf-8');

var posts = [];

function renderForm(posts,res){
    var data = ejs.render(template,{
        posts: posts
    });
    res.writeHead(200,{'Context-Type': 'text/html'});
    res.write(data);
    res.end();
}

server.on('request',function(req,res){
    if (req.method == 'POST') {
        req.data = "";
        req.on("readable",function(){
            req.data += req.read();
        });
        req.on("end",function(){
            var query = qs.parse(req.data);
            posts.push(query.name);
            renderForm(posts,res);
        });
        console.log(posts);
    }else{
        renderForm(posts, res);
        console.log(posts);
    }
   
});

server.listen(settings.port,settings.host);
console.log("server listening ....");
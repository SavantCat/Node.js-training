var express = require('express');
var ejs = require("ejs");
 
var app = express();
 
app.engine('ejs',ejs.renderFile);
 
app.get("/", function(req, res){
    res.render('test.ejs', {
        title: 'Test Page' , 
        content: 'this is test.'
    });
});
 
app.listen(1234);
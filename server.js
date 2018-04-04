var express = require('express');
var querystring = require('querystring');
var http = require('http');
var db = require('./JSAPI/DataBaseHandler.js');

var app = express();

function processPost(request, response, callback) {
    var queryData = "";
    if(typeof callback !== 'function') return null;

    if(request.method == 'POST') {
        request.on('data', function(data) {
            queryData += data;
            if(queryData.length > 1e6) {
                queryData = "";
                response.writeHead(413, {'Content-Type': 'text/plain'}).end();
                request.connection.destroy();
            }
        });

        request.on('end', function() {
            request.post = querystring.parse(queryData);
            callback();
        });

    } else {
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end();
    }
}

app.use(express.static(__dirname + '/static'));

db.init();

app.get('/', function(req, res) {
	console.log("COUCOU !");
	res.render('index.ejs');
});

app.get('/channels', function(req,res) {
	res.render('channels.ejs');
})

app.get('/login', function(req, res){
	res.render('login.ejs');
})

app.get('/create-account', function(req, res){
	res.render('create-account.ejs');
})

app.get('/home', function(req, res){
	res.render('home.ejs');
})

app.post('/create-account', function(req, res){
	processPost(req, res, function(){
		console.log(req.post);
		res.render('create-account.ejs')
	})
})

app.listen(8080,"localhost");

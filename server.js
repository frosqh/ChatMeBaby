var express = require('express');
var querystring = require('querystring');
var http = require('http');
var db = require('./JSAPI/DataBaseHandler.js');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();
app.use(cookieParser());
app.use(session({secret: "ChatMeCharoy"}));


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

function disconnect(req){
	req.session.username=undefined;
}

function login(username, password){
	
}

app.use(express.static(__dirname + '/static'));

db.init();

app.get('/', function(req, res) {
	
	if (req.session.user){
		userf = req.session.user;
	} else {
		userf = "Anonymous";
		req.session.user=userf;
	}

	res.render('index.ejs', {user: userf});
});

app.get('/channels', function(req,res) {
	res.render('channels.ejs');
})

app.get('/login', function(req, res){
	res.render('login.ejs');
})

app.post('/login', function(req, res){
	processPost(req, res, function(){
		user = req.post.username;
		pass = req.post.password;
		var sql="SELECT Password FROM User WHERE Username='"+user+"'";
		con.query(sql, function(err, result, fields){
		if (err) throw err;
		if (result.length > 0){
			p = result[0].Password;
			if (db.helper.hashFnv32a(p,true)==pass){
				req.session.username = user;
				res.redirect('/');
			} else {
				res.send("Erf !");
			}
		} else {
			res.send("Erf !");
		}
	});
	})
})

app.get('/create-account', function(req, res){
	res.render('create-account.ejs');
})

app.get('/home', function(req, res){
	res.render('home.ejs');
})

app.post('/create-account', function(req, res){
	processPost(req, res, function(){
		db.User(req.post.username,req.post.email,req.post.password);
		req.session.user=req.post.username;
		res.redirect("/");
	})
})

app.get('/logout', function(req, res){
	disconnect(req);
	res.redirect("/");
})

app.listen(8080,"localhost");

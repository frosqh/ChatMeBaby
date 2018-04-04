var express = require('express');
var querystring = require('querystring');
var http = require('http');
var server = http.createServer(express);
var io = require('socket.io').list(server);
var ent = require('ent');
var db = require('./JSAPI/DataBaseHandler.js');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var socket = io.listen(server);

var app = express();
app.use(cookieParser());
app.use(session({
	secret: "ChateCharoy",
	resave : true,
	saveUninitialized: true
}));

var users={};

io.sockets.on('connection', function(socket) {
	var me=false;
	for (var k in users){
		socket.emit('nouveau_client', users[k]);
	}

	socket.on('login', function(err){
		me=user;
		m.username=ent.encore(me.username);
		me.id="id"+ent.encode(user.username);
		users[me.id]=me;
		io.socket.emit('nouveau_client', me);
	});
	socket.on('message', function(message){
		message.content=ent.encode(message.content);
		io.sockets.emit('msg',message);
	});

	socket.on('disconnect', function(){
		if(!me){
			return false;
		}
		delete users[me.id];
		io.sockets.emit('deconnexion_client',me);
	})
})


function processPost(request, response, callback) {
	var queryData = "";
	if(typeof callback !== 'function') return null;

	if(request.method == 'POST') {
		request.on('data', function(data) {
			queryData += data;
			if(queryData.length > 1e6) {
				queryData = "";
				console.log("Problem ? :p");
				response.writeHead(413, {'Content-Type': 'text/plain'}).end();
				request.connection.destroy();
			}
		});

		request.on('end', function() {
			request.post = querystring.parse(queryData);
			callback();
		});

	} else {
		console.log("Problem ! ><");
		response.writeHead(405, {'Content-Type': 'text/plain'});
		response.end();
	}
}

function disconnect(req){
	req.session.user=undefined;
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
	res.render('chan.ejs');
})

app.get('/login', function(req, res){
	if (req.session.user && req.session.user!="Anonymous"){
		res.redirect("/");
		return;
	}
	res.render('login.ejs', {wrong: undefined});
})

app.post('/login', function(req, res){
	if (req.session.user && req.session.user!="Anonymous"){
		res.redirect("/");
		return;
	}
	processPost(req, res, function(){
		user = req.post.user;
		pass = req.post.password;		
		var sql="SELECT Password FROM User WHERE UserName='"+user+"'";
		db.con.query(sql, function(err, result, fields){
			if (err) throw err;
			if (result.length > 0){
				p = result[0].Password;
				if (db.helper.hashFnv32a(pass,true)==p){
					req.session.user = user;
					res.redirect('/');
				} else {
					console.log("Wrong password !");
					res.render('login.ejs',{wrong: "Pass", pass: pass, user: user});
				}
			} else {
				console.log("Wrong username !");
				res.render('login.ejs', {wrong: "User", pass: "pass", user: user});
			}
		});
	})
})

app.get('/create-account', function(req, res){
	if (req.session.user && req.session.user!="Anonymous"){
		res.redirect("/");
		return;
	}
	res.render('create-account.ejs', {notif: undefined});
})

app.get('/home', function(req, res){
	res.render('home.ejs');
})

app.post('/create-account', function(req, res){
	if (req.session.user && req.session.user!="Anonymous"){
		res.redirect("/");
		return;
	}
	processPost(req, res, function(){
		var sql = "SELECT UserID FROM User WHERE UserName ='"+req.post.username+"'";
		db.con.query(sql, function(err, result, fields){
			if (err) throw err;
			if (result.info.numRows == 0){
				var sql = "SELECT UserID FROM User WHERE Mail ='"+req.post.email+"'";
				db.con.query(sql, function(err, result, fields){
					if (err) throw err;
					if (result.info.numRows == 0){
						db.User(req.post.username,req.post.email,req.post.password);
						req.session.user=req.post.username;
						res.redirect("/");
					} else {
						render("create-account.ejs", {notif: "This mail is alreay used. Perhaps should you try to login"});
					}
				})
				
			} else {
				res.render("create-account.ejs",{notif: "This username is already taken"});
			}
		})

	})
})

app.get('/logout', function(req, res){
	disconnect(req);
	res.redirect("/");
})

app.get('/user/:id', function(req, res){
	res.send("Profil de l'utilisateur : "+req.params.id);
})

app.get('/confirm/:id', function(req,res){
	var sql = "SELECT * FROM Confirmation WHERE ID='"+req.params.id+"'";
	console.log(sql);
	db.con.query(sql, function(err, result, fields){
		if (err) throw err;
		console.log(result);
		if (result.info.numRows != 0){
			db.setConfirmed(result[0].UserID,1);
			res.redirect("/");
		} else {
			res.redirect("/404");
		}
	});
});

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});

app.listen(8080,"localhost");

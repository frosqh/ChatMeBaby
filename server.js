var express = require('express');
var app = express();
app.use(express.static(__dirname + '/static'));
var querystring = require('querystring');
var http = require('http');
var server = http.createServer(app);
server.listen(8080);
var io = require('socket.io')(server);
var ent = require('ent');
var fs = require('fs');
var mobile = require("is-mobile");
var db = require('./JSAPI/DataBaseHandler.js');
var cookieParser = require('cookie-parser');
var session = require('express-session');



var socket = io.listen(server);


db.init()

app.use(cookieParser());
app.use(session({
	secret: "ChatMeCharoy",
	resave : true,
	saveUninitialized: true
}));

var users=[];
io.sockets.on('connection', function(socket) {
	var it=false;
	var me=false;
	for (k in users){
		socket.emit('nouveau_client', users[k]);
	}

	socket.on('login', function(user){
		if(users[user.username] != undefined && !users[user.username].connected){
			users[user.username].connected = 1;
			me = user;
			me.connected = 1;
			io.sockets.emit('connecti',me);
		} else {
			me = user;
			me.username=ent.encode(me.username);
			me.connected = 1;
			users[user.username] = me;
			io.sockets.emit('nouveau_client', me);
		}
	});

	socket.on('message', function(message){
		message.content=ent.encode(message.content);
		var sql = "SELECT UserID, AvatarURI FROM User WHERE UserName ='"+message.user+"'";
		db.con.query(sql, function(err, result, fields){
			if (err) throw err;
			if (result.info.numRows != 0){
				id = result[0].UserID
				av = result[0].AvatarURI
				chan = message.channel.substring(1,message.channel.length);
				var sql= "SELECT ChannelID FROM Channel WHERE Name ='"+chan+"'";
				db.con.query(sql, function(err, result, fields){
					if (err) throw err;
					if (result.info.numRows > 0){
						db.Message(id,result[0].ChannelID,message.content, message.user, av);
						message.image = av;
						io.sockets.emit('msg',message);
					}
				})

			}
		});
	});

	socket.on('disconnect', function(user){
		if(!me){
			return false;
		}
		if (users[me.username] != undefined) {
			users[me.username].connected=0;
		}
		me.conected=0;
		io.sockets.emit('deconnexion_client',me);

	})

	socket.on('getMessages', function(channel){
		channelName = channel.channel.substring(1,channel.channel.length);
		var sql = "SELECT ChannelID FROM Channel WHERE Name='"+channelName+"'";
		db.con.query(sql, function(err, result, fields){
			if (err) throw err;
			if (result.info.numRows > 0){
				var sql = "SELECT * FROM Message WHERE ChannelId="+result[0].ChannelID+"";
				db.con.query(sql, function(err, result, fields){
					if (err) throw err;
					socket.emit("messages",result);
				});
			}

		})
	});

	socket.on('getUser',function(){
		socket.emit('user',me);
	});

	//chanName est le nom du channel à check
	socket.on('checkName',function(chanName){
		var sql = "SELECT ChannelID FROM Channel WHERE Name='"+chanName+"'";
		db.con.query(sql, function(err, result, fields){
			if (err) throw err;
			if (result.info.numRows > 0 ){
				socket.emit("nameDispo",0);
			} else {
				socket.emit("nameDispo",1);
			}
		});
		//On envoit 1 si le nom est disponible
	});

	//On recoit le nouveau channel
	//channel.name : nom du channel
	//channel.status : Channel "public" ou "private"
	//channel.users : liste des noms des utilisateurs a ajouter
	socket.on('newChannel',function(channel){
		db.Channel(channel.name, channel.status);
		addUsers(channel);

	});

	socket.on('addUser', function(data){
		addUsers(data)});

})

function addUsers(channel){setTimeout(function(){
	console.log(channel.name);
	console.log(channel.users);
	var sql = "SELECT ChannelID FROM Channel WHERE Name='"+channel.name+"'";
			db.con.query(sql, function(err, result, fields){
				if (err) throw err;
				if (result.info.numRows > 0){
					channelID = result[0].ChannelID;
					for (i in channel.users){
						u = channel.users[i];
						var sql = "SELECT UserID FROM User WHERE UserName='"+u+"'";
						console.log(sql);
						db.con.query(sql, function(err, result, fields){
							if (err) throw err;
							console.log(result);
							if (result.info.numRows > 0){
								setTimeout(function(){db.UserByChannel(result[0].UserID, channelID, channel.name,25);},i*50);
							}
						});
					}
				} else {
					console.log("SRSLY ?");
				}
		});},300);


}



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
	var sql = "SELECT UserID FROM User WHERE UserName ='"+req.session.user+"'";
	db.con.query(sql, function(err, result, fields){
		if (err) throw err;
		if (result.info.numRows != 0){
			db.disconnect(result[0].UserID);
		}
	});
	req.session.user=undefined;
}

function getAge(birthdate){
	if (birthdate == null){
		return "???";
	}
	var today = new Date();
	var t = birthdate.split('-');
	var age = today.getFullYear() - t[0];
	var m = today.getMonth()-t[1];
	if (m<0 || (m===0 && today.getDate<t[2])){
		age--;
	}
	return age;
}

app.get('/', function(req, res) {
	if (req.session.user){
		userf = req.session.user;
	} else {
		userf = "Anonymous";
		req.session.user=userf;
	}
	if (mobile(req)){
		if (req.session.user==undefined || req.session.user=='Anonymous'){
			res.render('login.ejs', {wrong:undefined});
		} else {
			var sql = "SELECT UserID FROM User WHERE UserName = '"+req.session.user+"'";
			db.con.query(sql, function(err, result, fields){
				if (err) throw err;
				if (result.info.numRows > 0){
					var sql = "SELECT Name FROM UserByChannel WHERE UserID = "+result[0].UserID;
					db.con.query(sql, function(err, result, fields){
						if (err) throw err;
						l="";
						for (i=0;i<result.info.numRows;i++){
							l+=result[i].Name+" ";
						}
					res.render('home-mobile.ejs', {user: req.session.user, channels:(l.substring(0,l.length-1)).split(' ')});
			});
		}	})
		}


	} else {
		res.render('home.ejs', {user: userf}); 
	}
});

app.get('/lecharoy', function(req, res) {
	res.render('charoy.ejs');
});

app.get('/channels', function(req,res) {
	if (!req.session.user || req.session.user=="Anonymous"){
		res.redirect("/login");
		return;
	}
	var sql = "SELECT UserID FROM User WHERE UserName = '"+req.session.user+"'";
	db.con.query(sql, function(err, result, fields){
		if (err) throw err;
		if (result.info.numRows > 0){
			var sql = "SELECT Name FROM UserByChannel WHERE UserID = "+result[0].UserID;
			db.con.query(sql, function(err, result, fields){
				if (err) throw err;
				l="";
				for (i=0;i<result.info.numRows;i++){
					l+=result[i].Name+" ";
				}
				res.render('chan.ejs', {user: req.session.user, channels:(l.substring(0,l.length-1)).split(' ')});
			});
		} else {
			res.redirect('/');
		}
	})
});

app.post('/channels', function(req, res) {
	processPost(req, res, function(){

	})
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
		var sql="SELECT Password,UserID,Connected FROM User WHERE UserName='"+user+"'";
		db.con.query(sql, function(err, result, fields){
			if (err) throw err;
			if (result.length > 0){
				p = result[0].Password;
				if (db.helper.hashFnv32a(pass,true)==p){
					db.connect(result[0].UserID);
					req.session.user = user;
					res.redirect('/');
				} else {
					res.render('login.ejs',{wrong: "Pass", pass: pass, user: user});
				}
			} else {
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
	if (mobile(req)){
		res.render('create-account-mobile.ejs', {notif: undefined});
	} else {
		res.render('create-account.ejs', {notif: undefined});
	}
})

app.get('/home', function(req, res){
	res.render('index.ejs');
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
						setTimeout(function(){
							console.log(req.post);
							var sql = "SELECT UserID FROM User WHERE UserName ='"+req.post.username+"'";
							db.con.query(sql, function(err, result, fields){
								if (err) throw err;
								if (result.info.numRows != 0){
									if (req.post.firstname){
										db.setFirstName(result[0].UserID, req.post.firstname);
									}
									if (req.post.lastname){
										db.setLastName(result[0].UserID, req.post.lastname);
									}
									if (req.post.gender){
										if (req.post.gender=='male'){
											db.setGender(result[0].UserID, 0);
										}
										if (req.post.gender=='female'){
											db.setGender(result[0].UserID, 1);
										}
										if (req.post.gender=='notsure'){
											db.setGender(result[0].UserID, 2);
										}
									}
									if (req.post.birthdate){
										db.setBirthDate(result[0].UserID,req.post.birthdate);
									}
									if (req.post.phonenumber){
										db.setPhoneNumber(result[0].UserID, req.post.phonenumber);
									}
									if (req.post.city){
										db.setCity(result[0].UserID, req.post.city);
									}
									if (req.post.description){
										db.setDescription(result[0].UserID, req.post.description);
									}
									db.connect(result[0].UserID);
								} else {
								}
							});
						},1000);
						req.session.user=req.post.username;
						res.render("confirm-email.ejs");
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

app.get('/confirm/:id', function(req,res){
	var sql = "SELECT * FROM Confirmation WHERE ID='"+req.params.id+"'";
	db.con.query(sql, function(err, result, fields){
		if (err) throw err;
		if (result.info.numRows != 0){
			db.setConfirmed(result[0].UserID,1);
			res.redirect("/");
		} else {
			res.redirect("/404");
		}
	});
});

app.get('/profile', function(req,res){
	if (!req.session.user || req.session.user=="Anonymous"){
		res.redirect("/login");
		return;
	}
	var sql = "SELECT * FROM User WHERE UserName ='"+req.session.user+"'";
	db.con.query(sql, function(err, result, fields){
		if (err) throw err;
		if (result.info.numRows == 0){
			res.redirect("/");
		} else {
			var descr = result[0].Description;
			var gend = result[0].Gender;
			var ag = getAge(result[0].BirthDate);
			var use = result[0].UserName
			var first = result[0].FirstName;
			var last = result[0].LastName;
			var birt = result[0].BirthDate;
			var phone = result[0].PhoneNumber;
			var cit = result[0].City;
			var mail = result[0].Mail;
			var av = result[0].AvatarURI;
			if (descr != null){
				des = descr.replace(RegExp("(:)(\\w+)(:)",'g'),function(p1,p2,p3,p4){ return '<i class="em em-'+p3+'"></i>'}); } else {des=undefined}
				res.render('profile.ejs', {email: mail, city: cit, phonenumber: phone, birth: birt, firstname: first, lastname: last, user: use, desc: descr, gender: gend, age:ag, avatar:av, descToShow : des});
				return;
			}
		})
});

app.post('/profile', function(req, res){
	if (!req.session.user || req.session.user=='Anonymous'){
		return;
	}
	var sql = "SELECT * FROM User WHERE UserName ='"+req.session.user+"'";
	db.con.query(sql, function(err, result, fields){
		if (err) throw err;
		if (result.info.numRows == 0){
			res.redirect("/");
		} else {
			processPost(req, res, function(){
				var firstname = req.post.firstname;
				var gender = req.post.gender;
				var city = req.post.city;
				var desc = req.post.description;
				var lastname = req.post.lastname;
				var birthdate = req.post.birthdate;
				var phonenumber = req.post.phonenumber;
				var mail = req.post.new_email;
				var pass = req.post.current_password;
				var newpass = req.post.new_password;
				if (firstname != null){
					db.setFirstName(result[0].UserID, firstname);
				}
				if (gender != null){
					if (gender == 'male'){
						gender=0;
					}
					if (gender == 'female'){
						gender=1;
					}
					if (gender == 'notsure'){
						gender=2;
					}
					db.setGender(result[0].UserID, gender);
				}
				if (city != null){
					db.setCity(result[0].UserID, city);
				}
				if (desc != null){
					db.setDescription(result[0].UserID, desc);
				}
				if (lastname != null){
					db.setLastName(result[0].UserID, lastname);
				}
				if (birthdate != null){
					db.setBirthDate(result[0].UserID, birthdate);
				}
				if (phonenumber != null){
					db.setPhoneNumber(result[0].UserID, phonenumber);
				}
				if (mail != null){
					db.setMail(result[0].UserID, mail);
				}
				if (pass!=null && db.helper.hashFnv32a(pass)==result[0].Password){
					db.setPassword(newpass);
				}
				if (pass!=null){
					res.redirect("/logout");
				} else {
					res.redirect("/");
				}
			}); 
		}
	});
});

app.get('/user/:id', function(req, res){
	var sql = "SELECT * FROM User WHERE UserID ="+req.params.id;
	db.con.query(sql, function(err, result, fields){
		if (err) throw err;
		if (result.info.numRows == 0){
			res.redirect("/");
		} else {
			var descr = result[0].Description;

			if (descr != null){des = descr.replace(RegExp("(:)(\\w+)(:)",'g'),function(p1,p2,p3,p4){ return '<i class="em em-'+p3+'"></i>'}); } else {des=undefined}

			var gend = result[0].Gender;
			var ag = getAge(result[0].BirthDate);
			var use = result[0].UserName
			var first = result[0].FirstName;
			var last = result[0].LastName;
			var birt = result[0].BirthDate;
			var phone = result[0].PhoneNumber;
			var cit = result[0].City;
			var mail = result[0].Mail;
			var av = result[0].AvatarURI;
			res.render('profile_min.ejs', {email: mail, city: cit, phonenumber: phone, birth: birt, firstname: first, lastname: last, user: use, desc: descr, gender: gend, age:ag, avatar:av, descToShow : des});
			return;
		}
	})
})

app.get('/api/users', function(req, res){
	var sql = "SELECT UserID, UserName, Mail, FirstName, LastName, BirthDate, AvatarURI, Description, PhoneNumber, City, Gender FROM User";
	db.con.query(sql, function(err, result, fields){
		if (err) throw err;
		if (result.info.numRows == 0){
			res.status(200).json();
		} else {
			res.status(200).json(result);
		}
	});
});

app.get('/surprise', function(req, res){
	res.render('surprise-me.html');
});

app.get('/friends', function(req, res){
	res.render('friends.html');
});

app.get('/api/user/:id', function(req, res){
	var sql = "SELECT UserID, UserName, Mail, FirstName, LastName, BirthDate, AvatarURI, Description, PhoneNumber, City, Gender FROM User WHERE UserID="+req.params.id;
	db.con.query(sql, function(err, result, field){
		if (err)  throw err;
		if( result.info.numRows == 0){
			res.status(404).json();
		} else {
			res.status(200).json(result);
		}
	});
});

app.post('/api/user/:id', function(req, res){
	res.status(405).json();
});

app.get('/api/channels/', function(req, res){
	var sql = "SELECT * FROM Channel";
	db.con.query(sql, function(err, result, field){
		if (err) throw err;
		if (result.info.numRows == 0){
			res.status(200).json();
		} else {
			res.status(200).json(result);
		}
	});
});

app.get('/api/channel/:id', function(req, res){
	var sql = "SELECT * FROM Channel WHERE ChannelID="+req.params.id;
	db.con.query(sql, function(err, result, field){
		if (err) throw err;
		if (result.info.numRows == 0){
			res.status(404).json();
		} else {
			res.status(200).json(result);
		}
	});
});

app.use(function(req, res, next){
	res.status(404).render("404.ejs");
});

//app.listen(8080,"localhost");

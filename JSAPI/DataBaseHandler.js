var mysql = require('mysql');
const fs = require('fs');

var con = mysql.creationConnection({
	host: "localhost",
	user: "admin",
	password : "1234"
})

con.connect(function(err){
	if (err) throw err;
	console.log("Connected !");
});

function init(){
	con.query("CREATE DATABASE ChatMeDB", function(err,result){
		if (err) throw err;
	});
	con.changeUser({database : 'chatMeDB'}, function(err) {
  		if (err) throw err;
	});
	fs.readFile('chatMeDB.sql', (err, data)=>{
		if (err) throw err;
	});
	con.query(data, function(err, result) {
		if (err) throw err;
	});
}

function User(UserID, UserName, Mail){
	var sql="INSERT INTO User (UserID,UserName,Mail) VALUES ("+UserID+",'"+UserName"','"+Mail"')";
	con.query(sql, function(err, result) {
		if (err) throw err;
	});
}

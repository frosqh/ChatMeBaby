var Client = require('mariasql');
var result = {};
const fs = require('fs');
const helper= require('./Helper');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'chatmebaby2k18@gmail.com',
		pass: 'chatmecharoy'
	}
});

var con = new Client({
	host: 'localhost',
	user: 'root',
	password: '1234',

});
//Init DataBase (first Launch)

module.exports = {
	Client,
	fs,
	helper,
	con,
	init:function(){
		con.query("CREATE DATABASE IF NOT EXISTS ChatMeDB", function(err,result){
			if (err) throw err;
			con.query("USE ChatMeDB", function(err) {
				if (err) throw err;
			//console.log("Succeed!");
			fs.readFile('ChatMeDB.sql', 'utf8', (err, data)=>{
				if (err) throw err;
				v = data.split(";");
				for (var w in v.slice(0,v.length-1)){
					con.query(v[w]+";", function(err, result) {
						if (err) throw err;
					});
				}

			});
		});
		});
	},
	// Création User
	User:function(UserName, Mail, Password){
		var sql="SELECT * FROM User";
		con.query(sql, function(err,result){
			if (err) throw err;
			if (result == undefined){
				UserID=  0;
			} else {
				UserID = result.info.numRows;
			}
			var sql="INSERT INTO User (UserID,UserName,Mail,Password,Connected,Confirmed) VALUES ("+UserID+",'"+UserName+"','"+Mail+"','"+helper.hashFnv32a(Password,true)+"',"+0+","+0+")";
			con.query(sql, function(err, result) {
				if (err) throw err;
				sendMail(Mail,"Welcome to ChatMeBaby !", "Hi " + UserName + ", thanks for signing up ! </br> You should confirm your address <a href='"+generateConfirm(UserID,UserName)+"'> here </a>");
			});
		});
	},
	//API User
	getUsersList:function(){
		var sql="SELECT * FROM User";
		con.query(sql, function(err, result, fields){
			if (err) throw err;
			return result.length;
		});
	},
	setConfirmed:function(UserID, confirmed){
		var sql = "UPDATE User SET Confirmed="+confirmed+" WHERE UserID ="+UserID;
		con.query(sql, function(err, result){
			if (err) throw err;
		})
	}, 
}
// API User

function getUserId(username){ //À modifier, l'async fout le bordel monstre ><
var sql="SELECT UserID FROM User WHERE Username='"+username+"'";
con.query(sql, function(err, result, fields){
	if (err) throw err;
	if (result.length > 0){
		return result[0].UserID;
	} else {
		throw ("Not any "+username);
	}
});
}

function setConnected(UserID, connected){
	var sql="UPDATE User SET Connected ="+connected+" WHERE UserID="+UserID;
	con.query(sql, function(err, result){
		if (err) throw err;
	});
}

function connect(UserID){
	setConnected(UserID,1);
}

function disconnect(UserID){
	setConnected(UserID,0);
}

function setFirstName(UserID, firstName){
	var sql="UPDATE User SET FirstName = '"+firstName+"' WHERE UserID ="+UserID;
	con.query(sql, function(err, result){
		if (err) throw err;
	});
}

function setLastName(UserID, lastName){
	var sql="UPDATE User SET LastName = '"+lastName+"' WHERE UserID ="+UserID;
	con.query(sql, function(err, result){
		if (err) throw err;
	});
}

function setBirthDate(UserID, birthDate){
	var sql="UPDATE User SET BirthDate ='"+birthDate+"' WHERE UserID ="+UserID;
	con.query(sql, function(err, result){
		if (err) throw err;
	});
}

function setAvatar(UserID, avatarURI){
	var sql="UPDATE User SET AvatarURI ='"+avatarURI+"' WHERE UserID ="+UserID;
	con.query(sql, function(err,result){
		if (err) throw err;
	});
}

function setStatus(UserID, status){
	var sql = "UPDATE User SET Status ="+status+" WHERE UserID ="+UserID;
	con.query(sql, function(err, resut){
		if (err) throw err;
	});
}

function setDescription(UserID, desc){
	var sql="UPDATE User SET Description ='"+desc+"' WHERE UserID ="+UserID;
	con.query(sql, function(err, result){
		if (err) throw err;
	});
}

function setPhoneNumber(UserID, phoneNumbe){
	var sql="UPDATE User SET PhoneNumber ="+phoneNumbe+" WHERE UserID ="+UserID;
	con.query(sql, function(err, result){
		if (err) throw err;
	});
}

function setSkype(UserID, skype){
	var sql="UPDATE User SET Skype ='"+skype+"' WHERE UserID ="+UserID;
	con.query(sql, function(err, result){
		if (err) throw err;
	});
}

//Création Confirmation

function Confirmation(UserName, UserID){
	console.log("Entrée dans Confirmation");
	console.log("UserName" + UserName);
	console.log(UserID);
	var sql = 'INSERT INTO Confirmation (ID, UserID) VALUES (\''+UserName+"',"+UserID+")";
	console.log(sql);
	con.query(sql, function(err, result){
		if (err) throw err;
		return result.info.insertId;
	});
}

// Création Preferences
function Preferences(UserID){
	var sql="SELECT * FROM Preferences";
	con.query(sql, function(err,result){
		if (err) throw err;
		if (result == undefined){
			PrefID=  0;
		} else {
			PrefID = result.info.numRows;
		}
		var sql="INSERT INTO Preferences (PrefID, UserID, Theme, Display) VALUES ("+PrefID+","+UserID+",0,0)";
		con.query(sql, function(err, result){
			if (err) throw err;
			return result.info.insertId;
		});
	});

}

// API Preferences
function getPrefFrom(UserID){ //idem, il faut le bouger ^^'
var sql="SELECT PrefID FROM Preferences WHERE UserID="+UserID;
con.query(sql, function(err, result, fields){
	if (err) throw err;
});
if (result.length > 0){
	return result[0].PrefID;
} else {
	throw ("Not any "+UserID);
}
}

function setTheme(PrefID,Theme){
	var sql="UPDATE Preferences SET Theme="+Theme+"WHERE PrefID="+PrefID;
	con.query(sql, function(err, result){
		if (err) throw err;
	});
}


function setDisplay(PrefID, display){
	var sql="UPDATE Preferences SET Display="+display+"WHERE PrefID="+PrefID;
	con.query(sql, function(err, result){
		if (err) throw err;
	});
}

// Création Channel
function Channel(Name){
	var sql="SELECT * FROM Channel";
	con.query(sql, function(err,result){
		if (err) throw err;
		if (result == undefined){
			ChannelID=  0;
		} else {
			ChannelID = result.info.numRows;
		}
		var sql="INSERT INTO Channel (ChannelID, Name, CreationDate) VALUES ("+ChannelID+",'"+Name+"',NOW())";
		con.query(sql, function(err, result){
			if (err) throw err;
			Settings(result.info.insertId);
			return result.info.insertId;
		});
	});
}

// API Channel
function setName(channelID, name){
	var sql="UPDATE Channel SET Name='"+name+"' WHERE ChannelID="+channelID;
	con.query(sql, function(err, result){
		if (err) throw err;
	});
}

function setLogo(channelID, logo){
	var sql="UPDATE Channel SET Logo='"+logo+"' WHERE ChannelID="+channelID;
	con.query(sql, function(err, result){
		if (err) throw err;
	});
}

function setChannelDesc(channelID, desc){
	var sql="UPDATE Channel SET Description='"+desc+"' WHERE ChannelID="+channelID;
	con.query(sql, function(err, result){
		if (err) throw err;
	});
}

function getChannelID(name){ //A changer !
	var sql="SELECT ChannelID FROM Channel WHERE Name='"+name+"'";
	con.query(sql, function(err, result, fields){
		if (err) throw err;
	});
	if (result.length > 0){
		return result[0].ChannelID;
	} else {
		throw ("Not any "+name);
	}
}

// Création Settings
function Settings(channelID){
	var sql="SELECT * FROM Settings";
	con.query(sql, function(err,result){
		if (err) throw err;
		if (result == undefined){
			settingsID=  0;
		} else {
			settingsID = result.info.numRows;
		}
		var sql="INSERT INTO Settings (SettingsID,ChannelID) VALUES ("+settingsID+","+channelID+")";
		con.query(sql, function(err, result){
			if (err) throw err;
			return result.info.insertId;
		});
	});
}

//API Settings
function getSettFrom(channelID){ //A changer !
	var sql="SELECT SettingID FROM Settings WHERE ChannelID="+channelID;
	con.query(sql, function(err, result, fields){
		if (err) throw err;
	});
	if (result.length > 0){
		return result[0].SettingID;
	} else {
		throw ("Not any "+channelID);
	}
}

function setSetting1(SettingId, setting1){
	var sql="UPDATE Settings SET Setting1="+setting1+"WHERE SettingsID="+SettingId;
	con.query(sql, function(err, result){
		if (err) throw err;
	});
}

//Création Message
function Message(UserId, ChannelId, Text){
	var sql="SELECT * FROM Message";
	con.query(sql, function(err,result){
		if (err) throw err;
		if (result == undefined){
			messageId  = 0;
		} else {
			
			messageId = result.info.numRows;
		}
		console.log("Channel "+ChannelId);
		console.log("Pignouf "+UserId);
		console.log(Text);
		var sql="INSERT INTO Message (MessageID, UserID, ChannelID, Text, SendDate) VALUES ("+messageId+","+UserId+","+ChannelId+",'"+Text+"',NOW())";
		con.query(sql, function(err, result){
			if (err) throw err;
			return result.info.insertId;
		});
	});
}

//API Message
function setPJ(MessageID, PJ){
	var sql="UPDATE Message SET PJ='"+PJ+"'WHERE MessageID="+MessageID;
	con.query(sql, function(err, result){
		if (err) throw err;
	});
}

//Création UserByChannel
function UserByChannel(UserID, ChannelID, Power){
	var sql="SELECT * FROM UserByChannel";
	con.query(sql, function(err, result){
		if (err) throw err;
		if (result == undefined){
			UbCId = 0;
		} else {
			UbCId = result.info.numRows;
		}
		var sql="INSERT INTO UserByChannel (ID, UserID, ChannelID, Power) VALUES ("+UbCId+","+UserID+","+ChannelID+","+Power+")";
		con.query(sql, function(err, result){
			if (err) throw err;
			return result.info.insertId;
		})
	})
}

//API UserByChannel
function setTitle(UbCId,Title){
	var sql="UPDATE UserByChannel SET Title='"+Title+"' WHERE ID="+UbCId;
	con.query(sql, function(err, result){
		if (err) throw err;
	});
}

//Suite API



function test(){
	i = User("frosqh", "frosqh@gmail.com","pass");
	setTimeout(function(){
		j = User("Cha", "neko@gmail.com", "word");
		c = Channel("Inu");
		m = Message(i,c,"Plop ^^");
		n = Message(j,c,"Hey ^^");
		k = Message(i,c,"Sans accent :p");
	},1000);
}

function sendMail(addr, subject, body) {
	var mailOptions = {
		from: 'chatmebaby2k18@gmail.com',
		to: addr,
		subject: subject,
		html: body
	};

	transporter.sendMail(mailOptions, function(error, info){
		if (error){
			console.log(error);
		} else {
			console.log('Email sent: '+info.response);
		}
	});
}

function generateConfirm(UserId, UserName){
	console.log(UserName);
	console.log(UserId);
	user = helper.hashFnv32a(UserName,true);
	console.log("Avant le call à Confirmation !");
	Confirmation(user, UserId);
	return "193.54.15.211/confirm/"+user;
}

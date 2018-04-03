var Client = require('mariasql');
const fs = require('fs');
const helper= require('./Helper');

var con = new Client({
	host: 'localhost',
	user: 'root',

});
var c=0;

init();

//Init DataBase (first Launch)

function init(){
	con.query("CREATE DATABASE IF NOT EXISTS ChatMeDB", function(err,result){
		if (err) throw err;
		con.query("USE ChatMeDB", function(err) {
			if (err) throw err;
		//console.log("Succeed!");
			fs.readFile('ChatMeDB.sql', 'utf8', (err, data)=>{
				if (err) throw err;
				v = data.split(";");
				for (var w in v.slice(0,v.length-1)){
					console.log(w);
					con.query(v[w]+";", function(err, result) {
						if (err) throw err;
					});
				}
				test();
			});
		});
	});
	
	


}

function test(){
	console.log(helper.getDate())
	User("frosko5","frosqh@gmail.com","2134");
}


//AutoIncr

function autoIncrUser(){
	var l = getUsersList()
	if (l==undefined){
		return 0;
	} else {
		console.log(l);
		return l.length+1
	}
}


// Création User

function User(UserName, Mail, Password){
	UserID = autoIncrUser();
	var sql="INSERT INTO User (UserID,UserName,Mail,Password,Connected) VALUES ("+UserID+",'"+UserName+"','"+Mail+"','"+helper.hashFnv32a(Password,true)+"',"+0+")";
	con.query(sql, function(err, result) {
		if (err) throw err;
		return result.insertId;
		//Preferences(result.insertId);
	});
}

// API User

function getUsersList(){
	var sql="SELECT * FROM User";
	con.query(sql, function(err, result, fields){
		if (err) throw err;
		return result;
	});
}

function getUserId(username){
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

// Création Preferences
function Preferences(UserID){
	PrefID = autoIncrPref();
	var sql="INSERT INTO Preferences (PrefID, UserID, Theme, Display) VALUES ("+PrefID+","+UserID+",0,0)";
	con.query(sql, function(err, result){
		if (err) throw err;
	});
	return result.insertId;
}

// API Preferences
function getPrefFrom(UserID){
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

function setThemeOf(UserId, Theme){
	PrefID = getPrefFrom(UserId);
	setTheme(PrefID,Theme);
}

function setDisplay(PrefID, display){
	var sql="UPDATE Preferences SET Display="+display+"WHERE PrefID="+PrefID;
	con.query(sql, function(err, result){
		if (err) throw err;
	});
}

function setDisplayOf(UserID, display){
	PrefID = getPrefFrom(UserID);
	setDisplay(PrefID, display);
}

// Création Channel
function Channel(Name){
	ChannelID = autoIncrChan();
	var sql="INSERT INTO Channel (ChannelID, Name, CreationDate) VALUES ("+ChannelID+",'"+Name+"','"+getDate()+"')";
	con.query(sql, function(err, result){
		if (err) throw err;
	});
	Settings(result.insertId);
	return result.insertId;
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

function getChannelID(name){
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
	settingsID = autoIncrSet();
	var sql="INSERT INTO Settings (SettingsID,ChannelID) VALUES ("+settingsID+","+channelID+")";
	con.query(sql, function(err, result){
		if (err) throw err;
	});
	return result.insertId;
}

//API Settings
function getSettFrom(channelID){
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

function setSetting1Of(ChannelId, setting1){
	settingId = getSetFrom(channelID);
	setSetting1(settingId,setting1);
}

//Création Message
function Message(UserId, ChannelId, Text){
	messageId = autoIncrMsg();
	var sql="INSERT INTO Message (MessageID, UserID, ChannelID, Text, SendDate) VALUES ("+messageId+","+UserId+","+ChannelId+","+Text+",CURRENT_TIMESTAMP)";
	con.query(sql, function(err, result){
		if (err) throw err;
	});
	return result.insertId;
}
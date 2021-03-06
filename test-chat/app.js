var express = require('express');
var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
    fs = require('fs');
//server.listen(80,"http://193.54.12.211");
var socket = io.listen(server);

// Chargement de la page index.html
app.get('/', function (req, res) {
  app.use(express.static(__dirname+'/public'));
  res.sendFile(__dirname + '/index.html');
});

var users= {};


io.sockets.on('connection', function (socket) {

    socket.join('general');
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    var me=false;
    var rooms=false;
    for(var k in users){
      socket.emit('nouveau_client',users[k]);
    }

    socket.on('login', function(user) {
        me=user;
        me.username=ent.encode(me.username);
        me.id=ent.encode(user.username)+Math.random();
        console.log(me.id);
        users[me.id]=me;
        io.sockets.emit('nouveau_client', me);
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        message.content=ent.encode(message.content);
        io.sockets.emit('msg', message);
    });

    socket.on('disconnect',function(){
        if(!me){
          return false;
        }
        delete users[me.id];
        io.sockets.emit('deconnexion_client',me);
      });

      socket.on('room',function(room){
        if(rooms)
        socket.leave(rooms);

        rooms = room;
        console.log('room',rooms);
        socket.join(room);
        });


});


server.listen(8080);

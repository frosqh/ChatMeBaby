var express = require('express');

var app = express();

app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res) {
	res.render('index.ejs');
});

app.get('/channels', function(req,res) {
	res.render('channels.ejs');
})

app.listen(80,"localhost");
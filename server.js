var express = require('express');
var fs = require('fs');
var app = express();

app.set('views', __dirname + '/public/jade');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	res.render('index');
});

app.get('/api/imageNames', function (req, res) {
	var imagePath = './public/resizedImg';
	var images = fs.readdirSync(imagePath);

	// delete extra files
	for (var i = 0; i < images.length; i++) {
		if (images[i].indexOf('png') === -1 && images[i].indexOf('jpg') === -1 && images[i].indexOf('JPG') === -1) {
			images.splice(i--, 1);
		}
	}

	res.json(images);
});

app.listen(3000);
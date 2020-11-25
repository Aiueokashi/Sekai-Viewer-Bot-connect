const http = require('http');
http
	.createServer(function(req, res) {
		res.write('keep aliving!');
		res.end();
	})
	.listen(8080);
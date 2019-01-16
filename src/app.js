const fs = require('fs');

const app = (req, res) => {
	let path = '.' + req.url;
	getUrl(res, path);
};

const getUrl = function (res, path) {
	fs.readFile(path, (err, data) => {
		try {
			res.statusCode = 200;
			res.write(data);
			res.end();
		}
		catch (err) {
			console.log(err);
		}
	})
}

// Export a function that can act as a handler

module.exports = app;
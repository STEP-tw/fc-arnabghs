const fs = require('fs');

const app = (req, res) => {
	let path = '.' + req.url;
	sendResponse(res, path);
};

const sendResponse = function (res, path) {
	fs.readFile(path, (err, data) => {
		try {
			res.statusCode = 200;
			res.write(data);
			res.end();
		}
		catch (err) {
			res.statusCode = 400;
			res.write("Not Found");
			res.end();
		}
	})
}

// Export a function that can act as a handler

module.exports = app;
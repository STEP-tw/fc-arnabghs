const fs = require('fs');

const send = function (res, content, statusCode = 200) {
	res.statusCode = statusCode;
	res.write(content);
	res.end();
}

const sendResponse = function (res, path) {
	let errorMsg = "Not Found";
	fs.readFile(path, (err, data) => {
		try {
			send(res, data);
		}
		catch (err) {
			send(res, errorMsg, 404);
		}
	})
}

const getDetails = function (content) {
	let details = content.split('&');
	let comment = details[1].split('=')[1].split('+').join(' ').split('%0D%0A').join('\n');
	let name = details[0].split('=')[1].split('+').join(' ').split('%0D%0A').join('\n');
	let dateAndTime = new Date().toLocaleString();
	return { dateAndTime, name, comment };
}

const app = (req, res) => {
	let path = './public' + req.url;
	if (req.url == '/') path = "./public/index.html";
	if (req.url == '/handleComment') {
		let content = "";
		req.on('data', (chunk) => content += chunk)
		req.on('end', () => {
			let details = JSON.stringify(getDetails(content));
			fs.appendFile("./public/comments.json", details, (err) => {
				if (err) throw err;
				console.log('The data was appended to file!');
			});
			res.write(JSON.stringify(details) + '\nData got submited.');
			res.end();
		})
		return;
	}
	sendResponse(res, path);
};

// Export a function that can act as a handler

module.exports = { app };
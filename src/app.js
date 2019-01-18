const fs = require('fs');
const commentDetails = require('../public/database/comments.json');
const WebFrame = require('./frameWork');
const { getDetails, createTable } = require('../public/guestBook.js');

const send = function (res, content, statusCode = 200) {
	res.statusCode = statusCode;
	res.write(content);
	res.end();
}

const sendResponse = function (res, path) {
	let errorMsg = "Not Found";
	fs.readFile(path, (err, data) => {
		if (err) {
			let statusCode = 500;
			console.log(err);
			if (err.code = 'ENOENT') statusCode = 404;
			send(res, errorMsg, statusCode);
			return;
		}
		send(res, data);
	})
}

const provideData = function (req, res) {
	let path = './public' + req.url;
	if (req.url == '/') path = "./public/index.html";
	sendResponse(res, path);
}

const appendTableInGuest = function (req, res) {
	fs.readFile("./public/guestBook.html", (err, data) => {
		data += createTable(commentDetails);
		send(res, data);
	});
}

const addDataToGuestBook = function (req, res) {
	let content = "";
	req.on('data', (chunk) => content += chunk)
	req.on('end', () => {
		commentDetails.unshift(getDetails(content));
		fs.writeFile("./public/database/comments.json", JSON.stringify(commentDetails), (err) => {
			if (err) throw err;
			console.log('The data was appended to file!');
		});
	})
	appendTableInGuest(req, res);
}

const app = new WebFrame();
app.get('/guestBook.html', appendTableInGuest);
app.post('/guestBook.html', addDataToGuestBook);
app.use(provideData);
const handleRequest = app.handleRequest.bind(app)

module.exports = handleRequest;
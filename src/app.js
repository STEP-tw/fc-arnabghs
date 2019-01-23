const fs = require('fs');
let commentDetails = fs.readFileSync("./public/database/comments.json", "utf-8");
commentDetails = JSON.parse(commentDetails);
const WebFrame = require('./frameWork');
const { getDetails } = require('./guestBook');

const uppperPart = {
	loginPage: `<form id="form" method="POST">
					<div class="feedbackHeading"> Leave a Comment </div>
					<div>Name : <input type="text" name="name" required></div>
					comment : <textarea name="comment" form="form" rows="5" cols="40">  </textarea>
					<div><input class="submitButton" type="submit" value="submit"></div>
					<hr>
					</form>`
}

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
	getGuestPage(req, res);
}

const getComments = function (req, res) {
	send(res, JSON.stringify(commentDetails));
}

const getGuestPage = function (req, res) {
	let path = './public' + req.url;
	let page = fs.readFileSync(path, 'utf8');
	page = page.replace("###FORM###", uppperPart.loginPage);
	send(res, page);
}

const app = new WebFrame();
app.post('/guestBook.html', addDataToGuestBook);
app.get('/guestBook.html', getGuestPage);
app.get("/comments", getComments);
app.use(provideData);
const handleRequest = app.handleRequest.bind(app)

module.exports = handleRequest;
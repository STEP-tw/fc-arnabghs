const fs = require('fs');
let commentDetails = fs.readFileSync("./public/database/comments.json", "utf-8");
commentDetails = JSON.parse(commentDetails);
const WebFrame = require('./frameWork');
const { getDetails } = require('./guestBook');

const uppperPart = {
	loggedInPage: function (name) {
		return `<form id="form" method="POST">
					<div class="feedbackHeading"> Leave a Comment </div>
					<div>Name : ${name} 
					<button type="submit" formaction = "/logout" formmethod = "POST"> Logout </button></div><br>
					comment : <textarea name="comment" form="form" rows="5" cols="40">  </textarea>
					<div><input class="submitButton" type="submit" value="submit"></div>
					<hr>
					</form>`},
	loginPage: function () {
		return `<form id="form" action="/login" method="POST">
	<div class="feedbackHeading"> Login to Comment </div>
	<div>Name : <input type="text" name="name" required>
	<input class="submitButton" type="submit" value="Login"></div>
	<hr>
	</form>` }
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

const addNameWithComment = function (req, content) {
	let comment = getDetails(content);
	let userName = req.headers.cookie.split('=')[1];
	comment.name = userName;
	commentDetails.unshift(comment);
	return commentDetails;
}

const addDataToGuestBook = function (req, res) {
	let content = "";
	req.on('data', (chunk) => content += chunk)
	req.on('end', () => {
		let commentDetails = addNameWithComment(req, content);
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
	let logPart = "loginPage";
	let userName = "Name of User Appears here";

	if (req.headers.cookie) {
		logPart = "loggedInPage";
		userName = req.headers.cookie.split('=')[1];
	}
	page = page.replace("###FORM###", uppperPart[logPart](userName));
	send(res, page);
}

const logUserIn = function (req, res) {
	let content = "";
	req.on('data', (chunk) => content += chunk);
	req.on('end', () => {
		res.setHeader("Set-Cookie", `username=${content.split('=')[1]}`);
		res.writeHead(302, { Location: "/guestBook.html" });
		res.end();
	})
}

const logOutUser = function (req, res) {
	const expiryDate = "Thu, 01 Jan 1970 00:00:00 UTC";
	res.setHeader("Set-Cookie", `username=;expires=${expiryDate};`);
	res.writeHead(302, { Location: "/guestBook.html" });
	res.end();
}

const app = new WebFrame();
app.post('/guestBook.html', addDataToGuestBook);
app.get('/guestBook.html', getGuestPage);
app.get("/comments", getComments);
app.post("/login", logUserIn);
app.post("/logout", logOutUser);
app.use(provideData);
const handleRequest = app.handleRequest.bind(app)

module.exports = handleRequest;
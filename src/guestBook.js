const getDetails = function (content) {
	let details = content.split('&');
	let comment = details[1].split('=')[1].replace(/\+/g, ' ');
	let name = details[0].split('=')[1].replace(/\+/g, ' ');
	name = decodeURIComponent(name);
	comment = decodeURIComponent(comment);
	let dateAndTime = new Date().toLocaleString();
	return { dateAndTime, name, comment };
}


module.exports = { getDetails };